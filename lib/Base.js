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

var Util = require('./Util.js');
var slice = Array.prototype.slice;

var Base = Object.create(Object.prototype, {

  defaultDescriptor: {
    get: function() {
      return this.defaultDescriptor_;
    },
    set: function(descriptor) {
      this.defaultDescriptor_ = descriptor;
    }
  },

  create: {
    value: function() {
      var obj = Object.create(this);
      obj.initialize.apply(obj, arguments);
      return obj;
    }
  },

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

  cloneExtend: {
    value: function(props) {
      var obj = this.clone();
      obj.mixin(props);
      return obj;
    }
  },

  cloneCreate: {
    value: function() {
      var obj = this.clone();
      obj.initialize.apply(obj, argumenst);
      return obj;
    }
  },

  extend: {
    value: function(props) {
      var self = this;
      var descriptors = {};
      if (props) {
        Object.keys(props).forEach(function(key) {
          descriptors[key] = Util.cloneKeys(self.defaultDescriptor_);
          descriptors[key]['value'] = props[key];
        });
      }
      return Object.create(this, descriptors);
    }
  },

  extendWithDescriptors: {
    value: function(descriptors) {
      return Object.create(this, descriptors);
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

  initialize: {
    value: function() {}
  }

});

Base.defaultDescriptor_ = {
  enumerable: true,
  writable: true,
  configurable: true
};

return Base;
});
