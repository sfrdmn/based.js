var Util = require('../lib/Util.js');
var _ = require('underscore');

module.exports = exports = {

  setUp: function(callback) {
    this.coolObj = {
      isCool: 'cool'
    };
    this.lameObj = {
      isLame: 'lame'
    };
    this.unionObj = {
      isCool: 'cool',
      isLame: 'lame'
    };
    this.coolDescriptor = {
      value: 'cool',
      enumerable: true,
      writable: false,
      configurable: true
    };
    this.lameDescriptor = {
      value: 'lame',
      enumerable: false,
      writable: false,
      configurable: true
    };
    this.descriptors = {
      isCool: this.coolDescriptor,
      isLame: this.lameDescriptor
    };
    this.coolObjWithDescriptors = Object.create(Object.prototype, {
      isCool: this.coolDescriptor
    });
    this.lameObjWithDescriptors = Object.create(Object.prototype, {
      isLame: this.lameDescriptor
    });
    this.unionObjWithDescriptors = Object.create(Object.prototype,
        this.descriptors);
    callback();
  },

  testHappiness: function(test) {
    test.ok(true, 'True is true :)');
    test.done();
  },

  objectMixinTests: {

    testMixinOwnPropertyNames: function(test) {
      var A = _.clone(this.coolObj);
      var B = _.clone(this.lameObj);
      Util.mixinOwnPropertyNames(A, B);
      test.deepEqual(A, this.unionObj,
          'C should be union of A and B');

      var chain = Util.mixinOwnPropertyNames(B, A);
      test.equals(chain, B, 'Should be chainable');

      var D = this.coolObjWithDescriptors;
      var E = this.lameObjWithDescriptors;
      Util.mixinOwnPropertyNames(D, E);
      test.deepEqual(D, this.unionObj,
          'Non-enumerable properties in source should be enumerable in dest');
      test.done();
    },

    testMixinOwnPropertyNamesAndDescriptors: function(test) {
      var A = _.clone(this.coolObj);
      var B = _.clone(this.lameObj);
      Util.mixinOwnPropertyNamesAndDescriptors(A, B);
      test.deepEqual(A, this.unionObj,
          'C should be union of A and B');

      var chain = Util.mixinOwnPropertyNamesAndDescriptors(B, A);
      test.equals(chain, B, 'Should be chainable');

      var D = this.coolObjWithDescriptors;
      var E = this.lameObjWithDescriptors;
      Util.mixinOwnPropertyNamesAndDescriptors(D, E);
      test.deepEqual(D, this.coolObj,
          'Deep equal should only iterate enumerable properties of union'); // TODO
      test.equals(D.isLame, 'lame', 'Dest should contain non-enumerable properties of source');

      var descriptor = Object.getOwnPropertyDescriptor(E, 'isLame');
      test.deepEqual(descriptor, this.lameDescriptor,
          'Descriptor should be set properly');
      test.done();
    },

    testMixinKeys: function(test) {
      var A = _.clone(this.coolObj);
      var B = _.clone(this.lameObj);
      Util.mixinKeys(A, B);
      test.deepEqual(A, this.unionObj,
          'C should be union of A and B');

      var chain = Util.mixinKeys(B, A);
      test.equals(chain, B, 'Should be chainable');

      var D = this.coolObjWithDescriptors;
      var E = this.lameObjWithDescriptors;
      Util.mixinKeys(D, E);
      test.deepEqual(D, this.coolObj,
          'Non-enumerable properties in source should NOT be enumerable in dest');
      test.equals(typeof D.isLame, 'undefined',
          'Dest should NOT contain source\'s non-enumerable properties');
      test.done();
    },

    testMixinKeysAndDescriptors: function(test) {
      var A = _.clone(this.coolObj);
      var B = _.clone(this.lameObj);
      Util.mixinKeysAndDescriptors(A, B);
      test.deepEqual(A, this.unionObj,
          'C should be union of A and B');

      var chain = Util.mixinKeysAndDescriptors(B, A);
      test.equals(chain, B, 'Should be chainable');

      var D = this.coolObjWithDescriptors;
      var E = this.lameObjWithDescriptors;
      Util.mixinKeysAndDescriptors(D, E);
      test.deepEqual(D, this.coolObj,
          'Deep equal should only iterate enumerable properties of union');
      test.equals(typeof D.isLame, 'undefined', 'Dest should NOT contain non-enumerable properties of source');

      var descriptor = Object.getOwnPropertyDescriptor(E, 'isLame');
      test.deepEqual(descriptor, this.lameDescriptor, 'Descriptor should be set properly');
      test.done();
    },

  },

  objectCloneTests: {

    testCloneOwnPropertyNames: function(test) {
      var A = {isCool: 'cool', isLame: 'lame'};
      var B = Util.cloneOwnPropertyNames(A);
      test.deepEqual(B, A, 'Clone should be equal to parent');

      var D = Object.create(Object.prototype, {
        isCool: {
          value: 'cool',
          enumerable: true
        },
        isLame: {
          value: 'lame',
          enumerable: false
        }
      });
      var E = Util.cloneOwnPropertyNames(D);
      test.deepEqual(E, A, 'Non enumerable properties in parent should be enumberable in clone');
      test.done();
    },

    testCloneOwnPropertyNamesAndDescriptors: function(test) {
      var A = _.clone(this.unionObj);
      var B = Util.cloneOwnPropertyNamesAndDescriptors(A);
      test.deepEqual(B, A, 'Clone should be equal to parent');

      var D = this.unionObjWithDescriptors;
      var E = Util.cloneOwnPropertyNamesAndDescriptors(D);
      test.deepEqual(E, this.coolObj, 'Non enumerable properties in parent should NOT be enumberable in clone');
      test.equals(E.isLame, 'lame', 'Non-enumerable properties in parent should exist in clone');
      test.done();
    },

    testCloneKeys: function(test) {
      var A = _.clone(this.unionObj);
      var B = Util.cloneKeys(A);
      test.deepEqual(B, A, 'Clone should be equal to parent');


      var D = this.unionObjWithDescriptors;
      var E = Util.cloneKeys(D);
      test.deepEqual(E, this.coolObj, 'Non enumerable properties in parent should not be enumberable in clone');
      test.equals(typeof E.isLame, 'undefined', 'Non enumerable properties in parent should NOT exist in clone');
      test.done();
    },

    testCloneKeysAndDescriptors: function(test) {
      var A = _.clone(this.unionObj);
      var B = Util.cloneKeysAndDescriptors(A);
      test.deepEqual(B, A, 'Clone should be equal to parent');

      var D = this.unionObjWithDescriptors;
      var E = Util.cloneKeysAndDescriptors(D);
      test.deepEqual(E, this.coolObj, 'Non enumerable properties in parent should NOT be enumberable in clone');
      test.equals(typeof E.isLame, 'undefined', 'Non-enumerable properties in parent should NOT exist in clone');
      test.done();
    }

  }

};
