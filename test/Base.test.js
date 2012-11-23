var Base = require('../lib/Base.js');
var Util = require('../lib/Util.js');

var __Base__ = Base // Save original Base for polyfills


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

  extendTests: {

    testEmptyExtend: function(test) {
      var A = Base.extend();
      var size = Object.getOwnPropertyNames(A).length;
      test.equal(size, 0, 'Extended object should have no properties');

      var protoA = Object.getPrototypeOf(A);
      test.equal(protoA, Base, 'Extended object prototype should be the Base object');
      test.notEqual(A, Base, 'Extended object should not be the Base object. Duh');

      var B = Base.extend({});
      var size = Object.getOwnPropertyNames(B).length;
      var protoB = Object.getPrototypeOf(B);
      test.deepEqual({size: size, proto: protoB}, {size: 0, proto: Base},
          'Extend should work with empty object as param');
      test.done();
    },

    testExtendWithProperties: function(test) {
      var A = Base.extend(this.unionObj);
      test.deepEqual(A, this.unionObj, 'Extended object should have properties passed to extend');

      var protoA = Object.getPrototypeOf(A);
      test.equal(protoA, Base, 'Extended object prototype should be the Base object');

      var B = Base.extend(this.unionObjWithDescriptors);
      test.deepEqual(B, {isCool: 'cool'}, 'Non-enumerable properties of source should NOT be enumerable in dest');
      test.equal(typeof B.isLame, 'undefined', 'Non-enumerable properties of source should NOT exist in dest');

      test.done();
    },

    testExtendWithDescriptors: function(test) {
      var errorThrown = null;
      try {
        var Buttz = Base.extendWithDescriptors(this.unionObj);
      } catch (e) {
        errorThrown = true;
      }
      test.ok(errorThrown, 'Should NOT extend with invalid descriptors');
      var A = Base.extend();
      var protoA = Object.getPrototypeOf(A);
      test.equal(protoA, Base,
          'Extended object prototype should be the Base object');

      var B = Base.extendWithDescriptors(this.descriptors);
      test.deepEqual(B, {isCool: 'cool'},
          'Non-enumerable properties of source should NOT be enumerable in dest');
      test.equal(B.isLame, 'lame',
          'Non-enumerable properties of source should exist in dest');
        test.done();
    }

  },

  extendCreateTests: {

    testExtendAndCreate: function(test) {
      var A = Base.extend({
        initialize: function(answer) {
          this.answer = answer;
        }
      });
      var B = A.extendAndCreate({
        isItSoCool: function() {
          return this.answer;
        }
      }, ['yes!']);
      test.ok(B.isItSoCool, 'B should be extended with new method');
      test.ok(B.answer, 'B should have been initialized with args');
      test.equal(B.isItSoCool(), 'yes!', 'B should be so cool');
      test.done();
    },

    testExtendWithDescriptorsAndCreate: function(test) {
      // TODO
      test.done();
    },

  },

  createTests: {

    testCreate: function(test) {
      var A = Base.extend();
      var a = A.create();
      test.equal(A, Object.getPrototypeOf(a),
          'A.create gives object whose prototype is A');
      test.done();
    }

  },

  cloneTests: {

    testClone: function(test) {
      var A = Base.extendWithDescriptors(this.descriptors);
      var B = A.clone();
      test.deepEqual(B.isCool, 'cool', 'Clone should clone');
      test.deepEqual(B.isCool, A.isCool, 'Clone should clone, duh');
      test.ok(!B.isLame, 'Clone should only clone enumerable props');
      test.done();
    },

    testCloneAll: function(test) {
      var A = Base.extendWithDescriptors(this.descriptors);
      var B = A.cloneAll();
      test.deepEqual(B.isCool, 'cool', 'Clone should clone');
      test.deepEqual(B.isCool, A.isCool, 'Clone should clone, duh');
      test.ok(B.isLame, 'Clone should only clone enumerable props');
      test.done();
    }

  },

  mixinTests: {

    testMixin: function(test) {
      var A = Base.extendWithDescriptors(this.descriptors);
      var B = Base.extend();
      B.mixin(A);
      test.deepEqual(B, this.coolObj, 'Mixin should mix in');
      test.ok(!B.isLame, 'Should not mixin non-enumerable props');
      test.done();
    },

    testMixinAll: function(test) {
      var A = Base.extendWithDescriptors(this.descriptors);
      var B = Base.extend();
      B.mixinAll(A);
      test.deepEqual(B, this.coolObj, 'Mixin should mix in');
      test.ok(B.isLame, 'Should also mixin non-enumerable props');
      test.done();
    }

  },

  customDefaultDescriptorTests: {

    setCustomDescriptor: function(test) {
      var A = Base.extend({
        hi: function() {
          return 'hi! :)';
        }
      });
      A.defaultDescriptor = {
        enumerable: false,
        configurable: false,
        writable: false
      };
      var B = A.extend();
      test.ok(B, !B.hi, 'Added prop should now be non-enumerable and thus not extended');
      test.done();
    }

  },

  polyfillTests: {

    setUp: function(callback) {
      // Remove descriptors from Base to allow polyfills
      Base = Util.cloneOwnPropertyNames(__Base__);
      callback();
    },

    tearDown: function(callback) {
      // Restor original Base
      Base = __Base__;
      callback();
    },

    testExtendInitializeNotCalled: function(test) {
      var callCount = 0;
      Base.initialize = function() {
        callCount++;
      };

      var A = Base.extend();
      test.equal(callCount, 0, 'Intialize should not be called on object extend');
      test.done();
    },

    testCreateInitializeCalled: function(test) {
      var callCount = 0;
      Base.initialize = function() {
        callCount++;
      };

      var A = Base.create();
      test.equal(callCount, 1, 'Intialize should be called on object create');
      test.done();
    }

  }

};
