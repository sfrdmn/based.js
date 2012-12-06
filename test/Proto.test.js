var Proto = require('../lib/Proto');
var Util = require('../lib/Util');

var __Proto__ = Proto // Save original Proto for polyfills


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
    this.unionObjWithDescriptors = Object.create(Object.prototype,
        this.descriptors);
    callback();
  },

  testHappiness: function(test) {
    test.ok(true, 'True is true :)');
    test.done();
  },

  extendSelfTests: {

    testEmptyExtend: function(test) {
      var A = Proto.extendSelf();
      var size = Object.getOwnPropertyNames(A).length;
      test.equal(size, 0, 'Extended object should have no properties');

      var protoA = Object.getPrototypeOf(A);
      test.equal(protoA, Proto, 'Extended object prototype should be the Proto object');
      test.notEqual(A, Proto, 'Extended object should not be the Proto object. Duh');

      var B = Proto.extendSelf({});
      var size = Object.getOwnPropertyNames(B).length;
      var protoB = Object.getPrototypeOf(B);
      test.deepEqual({size: size, proto: protoB}, {size: 0, proto: Proto},
          'Extend should work with empty object as param');
      test.done();
    },

    testExtendWithProperties: function(test) {
      var A = Proto.extendSelf(this.unionObj);
      test.deepEqual(A, this.unionObj, 'Extended object should have properties passed to extendSelf');

      var protoA = Object.getPrototypeOf(A);
      test.equal(protoA, Proto, 'Extended object prototype should be the Proto object');

      var B = Proto.extendSelf(this.unionObjWithDescriptors);
      test.deepEqual(B, {isCool: 'cool'}, 'Non-enumerable properties of source should NOT be enumerable in dest');
      test.equal(typeof B.isLame, 'undefined', 'Non-enumerable properties of source should NOT exist in dest');

      test.done();
    },

    testExtendWithDescriptors: function(test) {
      var errorThrown = null;
      try {
        var Buttz = Proto.extendSelfWithDescriptors(this.unionObj);
      } catch (e) {
        errorThrown = true;
      }
      test.ok(errorThrown, 'Should NOT extendSelf with invalid descriptors');
      var A = Proto.extendSelf();
      var protoA = Object.getPrototypeOf(A);
      test.equal(protoA, Proto,
          'Extended object prototype should be the Proto object');

      var B = Proto.extendSelfWithDescriptors(this.descriptors);
      test.deepEqual(B, {isCool: 'cool'},
          'Non-enumerable properties of source should NOT be enumerable in dest');
      test.equal(B.isLame, 'lame',
          'Non-enumerable properties of source should exist in dest');
        test.done();
    },

    testExtendSelfWithObject: function(test) {
      var A = Proto.extendSelfWithObject(
          this.unionObjWithDescriptors);
      test.ok(A.isCool, "Object should be cool");
      test.ok(A.isLame, "Object should be lame");
      test.deepEqual(A, this.coolObj,
          "Should have same property descriptors as extend obj");
      test.done();
    }

  },

  createSelfTests: {

    testCreate: function(test) {
      var A = Proto.extendSelf();
      var a = A.createSelf();
      test.equal(A, Object.getPrototypeOf(a),
          'A.createSelf gives object whose prototype is A');
      test.done();
    }

  },

  cloneTests: {

    testClone: function(test) {
      var A = Proto.extendSelfWithDescriptors(this.descriptors);
      var B = A.clone();
      test.deepEqual(B.isCool, 'cool', 'Clone should clone');
      test.deepEqual(B.isCool, A.isCool, 'Clone should clone, duh');
      test.ok(!B.isLame, 'Clone should only clone enumerable props');
      test.done();
    },

    testCloneAll: function(test) {
      var A = Proto.extendSelfWithDescriptors(this.descriptors);
      var B = A.cloneAll();
      test.deepEqual(B.isCool, 'cool', 'Clone should clone');
      test.deepEqual(B.isCool, A.isCool, 'Clone should clone, duh');
      test.ok(B.isLame, 'Clone should only clone enumerable props');
      test.done();
    },

    testCloneExtend: function(test) {
      // TODO
      test.done();
    },

    testCloneCreate: function(test) {
      // TODO
      test.done();
    }

  },

  mixinTests: {

    testMixin: function(test) {
      var A = Proto.extendSelfWithDescriptors(this.descriptors);
      var B = Proto.extendSelf();
      B.mixin(A);
      test.deepEqual(B, this.coolObj, 'Mixin should mix in');
      test.ok(!B.isLame, 'Should not mixin non-enumerable props');
      test.done();
    },

    testMixinAll: function(test) {
      var A = Proto.extendSelfWithDescriptors(this.descriptors);
      var B = Proto.extendSelf();
      B.mixinAll(A);
      test.deepEqual(B, this.coolObj, 'Mixin should mix in');
      test.ok(B.isLame, 'Should also mixin non-enumerable props');
      test.done();
    }

  },

  customDefaultDescriptorTests: {

    setCustomDescriptor: function(test) {
      var A = Proto.extendSelf({
        hi: function() {
          return 'hi! :)';
        }
      });
      A.defaultDescriptor = {
        enumerable: false,
        configurable: false,
        writable: false
      };
      var B = A.extendSelf();
      test.ok(B, !B.hi, 'Added prop should now be non-enumerable and thus not extendSelfed');
      test.done();
    }

  },

  polyfillTests: {

    setUp: function(callback) {
      // Remove descriptors from Proto to allow polyfills
      Proto = Util.cloneOwnPropertyNames(__Proto__);
      callback();
    },

    tearDown: function(callback) {
      // Restor original Proto
      Proto = __Proto__;
      callback();
    },

    testExtendInitializeNotCalled: function(test) {
      var callCount = 0;
      Proto.initialize = function() {
        callCount++;
      };

      var A = Proto.extendSelf();
      test.equal(callCount, 0, 'Intialize should not be called on object extendSelf');
      test.done();
    },

    testCreateInitializeCalled: function(test) {
      var callCount = 0;
      Proto.initialize = function() {
        callCount++;
      };

      var A = Proto.createSelf();
      test.equal(callCount, 1, 'Intialize should be called on object createSelf');
      test.done();
    }

  },

  miscTests: {

    testGetDescriptors: function(test) {
      var A = Proto.extendSelfWithDescriptors(this.descriptors);
      var descriptors = A.getDescriptors();
      test.deepEqual(descriptors, this.descriptors,
          "Descriptor representation of object should be correct");
      test.done();
    }

  }

};
