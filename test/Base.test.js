var Base = require('../lib/Base');
var Util = require('../lib/Util');

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
      // TODO
      var A = Base.extend();
      var B = Base.extend({});
      test.done();
    },

    testExtendWithProperties: function(test) {
      // TODO
      var A = Base.extend(this.unionObj);
      var protoA = Object.getPrototypeOf(A);
      var B = Base.extend(this.unionObjWithDescriptors);
      test.done();
    },

    testExtendWithDescriptors: function(test) {
      // TODO
      var errorThrown = null;
      try {
        var Buttz = Base.extendWithDescriptors(this.unionObj);
      } catch (e) {
        errorThrown = true;
      }
      test.ok(errorThrown, 'Should NOT extend with invalid descriptors');
        test.done();
    }

  },

  createTests: {

    testCreate: function(test) {
      var A = Base.extend();
      var a = A.create();
      test.equal(A.prototype, Object.getPrototypeOf(a),
          'A.create gives object whose prototype is A.prototype');
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

    testCreateInitializeCalled: function(test) {
      // TODO
      test.done();
    }

  }

};
