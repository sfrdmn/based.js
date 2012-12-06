(function (root, factory) {
    if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else {
        root['basedjs'] = root['basedjs'] || {};
        root['basedjs']['Proto'] = factory();
    }
})(this, function() {

var Util = require('./Util');
var slice = Array.prototype.slice;

var config = require('../config');
var ctor = config.ctor;

var Proto = Object.create(Object.prototype, {

  /*******
    Descriptor to use for extend methods called without explicit descriptors
  *******/
  defaultDescriptor: {
    writable: true,
    value : {
      configurable: true,
      enumerable: true,
      writable: true
    }
  },

  /*******
    Create a new object whose prototype is the current object
    Initialize the new object
  *******/
  createSelf: {
    value: function() {
      var obj = Object.create(this);
      return obj[ctor].apply(obj, arguments) || obj;
    }
  },

  /*******
    Create a new object whose prototype is the current object
    The new object will have the properties {props}, each defined with
    the default descriptor
  *******/
  extendSelf: {
    value: function(props) {
      var that = this;
      var descriptors = {};
      if (props) {
        Object.keys(props).forEach(function(key) {
          descriptors[key] = Util.cloneKeys(that.defaultDescriptor);
          descriptors[key]['value'] = props[key];
        });
      }
      return Object.create(this, descriptors);
    }
  },

  /*******
    Same as extendSelf, except descriptors are given explicitly
  *******/
  extendSelfWithDescriptors: {
    value: function(descriptors) {
      return Object.create(this, descriptors);
    }
  },

  /*******
    Same as extendSelfWithDescriptors, except descriptors are
    extracted from an object
  *******/
  extendSelfWithObject: {
    value: function(obj) {
      var descriptors = this.getDescriptors.call(obj);
      return this.extendSelfWithDescriptors(descriptors);
    }
  },

  /*******
    Create a new object whose prototype is the same as the current object's
    and which posseses all enumerable properties of the current object
  *******/
  clone: {
    value: function() {
      var obj = Object.create(Object.getPrototypeOf(this));
      Util.mixinKeysAndDescriptors(obj, this);
      return obj;
    }
  },

  /*******
    Same as clone, but the new object possesses both the enumerable
    and non-enumerable properties of the current object
  *******/
  cloneAll: {
    value: function() {
      var obj = Object.create(Object.getPrototypeOf(this));
      Util.mixinOwnPropertyNamesAndDescriptors(obj, this);
      return obj;
    }
  },

  /*******
    Mixin the enumerable properties of N objects into the curent object
  *******/
  mixin: {
    value: function() {
      var args = slice.call(arguments);
      args.unshift(this);
      return Util.mixinKeysAndDescriptors
          .apply(Util, args);
    }
  },

  /*******
    Same as mixin, but mixes in both enumerable and non-enumerable properties
  *******/
  mixinAll: {
    value: function() {
      var args = slice.call(arguments);
      args.unshift(this);
      return Util.mixinOwnPropertyNamesAndDescriptors
          .apply(Util, args);
    }
  },

  /*******
    Convenience function to defineProperties on the current object
  *******/
  defineProperties: {
    value: function(descriptors) {
      return Object.defineProperties(this, descriptors);
    }
  },

  /*******
    Convenience function to defineProperty on the current object
  *******/
  defineProperty: {
    value: function(key, descriptor) {
      Object.defineProperty(this, key, descriptor);
    }
  },

  /*******
    Get a descriptor representation of the object's own properties.
  *******/
  getDescriptors: {
    value: function() {
      var that = this;
      var descriptors = {};
      Object.getOwnPropertyNames(this).forEach(function(key) {
        var descriptor =
            Object.getOwnPropertyDescriptor(that, key);
        descriptors[key] = descriptor;
      });
      return descriptors;
    }
  }

});

/*******
  Provide an empty, catch-all initializtion function
*******/
Proto.defineProperty(ctor, {
  value: function() {}
});

/*******
  Lock in dat flava
*******/
Object.seal(Proto);

return Proto;

});
