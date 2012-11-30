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
        root['basedjs']['Base'] = factory();
    }
})(this, function() {

var Util = require('./Util');
var slice = Array.prototype.slice;

var config = require('../config');
var ctor = config.ctor;

var Base = Object.create(Object.prototype, {

  defaultDescriptor: {
    get: function() {
      return this.defaultDescriptor;
    },
    set: function(descriptor) {
      this.defaultDescriptor = descriptor;
    },
    value: {
      configurable: true,
      enumerable: true,
      writable: true
    }
  },

  createSelf: {
    value: function() {
      var obj = Object.create(this);
      return obj[ctor].apply(obj, arguments) || obj;
    }
  },

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

  extendSelfWithDescriptors: {
    value: function(descriptors) {
      return Object.create(this, descriptors);
    }
  },

//  mixinClone: {
//    value: function(props) {
//      var obj = this.clone();
//      obj.mixin(props);
//      return obj;
//    }
//  },
//
//  mixinCloneWithDescriptors: {
//    value: function(descriptors) {
//      var obj = this.clone();
//      obj.defineProperties(descriptors);
//      return obj;
//    }
//  },
//
//  cloneInit: {
//    value: function() {
//      var obj = this.clone();
//      obj[ctor].apply(obj, argumenst);
//      return obj;
//    }
//  },
//
//  cloneAllInit: {
//    value: function() {
//      var obj = this.cloneAll();
//      obj[ctor].apply(obj, argumenst);
//      return obj;
//    }
//  },

  clone: {
    value: function() {
      var obj = Object.create(Object.getPrototypeOf(this));
      Util.mixinKeysAndDescriptors(obj, this);
      return obj;
    }
  },

  cloneAll: {
    value: function() {
      var obj = Object.create(Object.getPrototypeOf(this));
      Util.mixinOwnPropertyNamesAndDescriptors(obj, this);
      return obj;
    }
  },

  mixin: {
    value: function() {
      var args = slice.call(arguments);
      args.unshift(this);
      return Util.mixinKeysAndDescriptors
          .apply(Util, args);
    }
  },

  mixinAll: {
    value: function() {
      var args = slice.call(arguments);
      args.unshift(this);
      return Util.mixinOwnPropertyNamesAndDescriptors
          .apply(Util, args);
    }
  },

  defineProperties: {
    value: function(descriptors) {
      return Object.defineProperties(this, descriptors);
    }
  },

  defineProperty: {
    value: function(key, descriptor) {
      Object.defineProperty(this, key, descriptor);
    }
  }

});

/*******
  Provide an empty, catch-all initializtion function
*******/
Base.defineProperty(ctor, {
  value: function() {}
});

return Base;

});
