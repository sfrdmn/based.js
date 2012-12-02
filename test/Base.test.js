var Base = require('../lib/Base');
var Proto = require('../lib/Proto');
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
      var A = Base.extend();
      var B = Base.extend({});
      var protoA = Object.getPrototypeOf(A);
      var protoProtoA = Object.getPrototypeOf(A.prototype);
      var protoB = Object.getPrototypeOf(B);
      var protoProtoB = Object.getPrototypeOf(B.prototype);

      test.equals(protoA, Base, 'Prototype of extended object should be Base');
      test.ok(protoA.prototype, 'Extended object should have prototype property');
      test.equals(protoProtoA, Proto, 'Prototype property prototype should be Proto');
      test.equals(protoB, Base, 'Prototype of extended object should be Base');
      test.ok(protoB.prototype, 'Extended object should have prototype property');
      test.equals(protoProtoB, Proto, 'Prototype property prototype should be Proto');
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

  },

  functionalityTests: {

    prototypeChainTest: function(test) {
      var A = Base.extend({
        name: 'A_proto'
      }, {
        name: 'A'
      });
      var B = A.extend({
        name: 'B_proto'
      }, {
        name: 'B'
      });
      var C = B.extend({
        name: 'C_proto'
      }, {
        name: 'C'
      });
      [A, B, C].forEach(function(Obj, i, list) {
        var proto = Object.getPrototypeOf(Obj);
        var parentObj = Base;
        var obj = Obj.create();
        test.equals(proto, parentObj, Obj.name + ' should inherit from Base');
        test.equals(Object.getPrototypeOf(obj), Obj.prototype, 'Created obj should inherit from Obj prototype');
      });
      [Proto, A.prototype, B.prototype, C.prototype].forEach(function(obj, i, list) {
        if (i) {
          var proto = Object.getPrototypeOf(obj);
          var parentObj = list[i - 1];
          test.equals(proto, parentObj, obj.name + ' should inherit from ' + parentObj.name);
        }
      });
      test.done();
    }

  }

};
