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

/*******
  For compatibility with the new keyword
*******/
function ctor() {
  this.initialize.apply(this, arguments);
};

/*******
  Base object properties
*******/
var BaseProps = {

  /*******
    Create a new object whose prototype property inherits from the current
    object's prototype property.
    The new object will have a prototype property with properties protoProps,
    and will itself have properties objProps.
  *******/
  extend: function(protoProps, objProps) {
    var obj = function() {
      ctor.apply(this, arguments);
    };
    var that = this;
    var protoDescriptors = {};

    if (protoProps) {
      Object.keys(protoProps).forEach(function(key) {
        protoDescriptors[key] =
            getPopulatedDefaultDecriptor.call(that, protoProps[key]);
      });
    }
    obj.prototype = Object.create(this.prototype, protoDescriptors);

    if (objProps) {
      Object.keys(objProps).forEach(function(key) {
        var descriptor =
            getPopulatedDefaultDescriptor.call(that, objProps[key]);
        Object.defineProperty(obj, key, descriptor);
      });
    }
    return obj;
  },

  /*******
    Same as extend, but with custom descriptors.
  *******/
  extendWithDescriptors: function(protoDescriptors, objDescriptors) {
    var obj = ctor;
    obj.prototype = Object.create(this.prototype, protoDescriptors);
    Object.keys(objDescriptors).forEach(key) {
      Object.defineProperty(obj, key, objDescriptors[key]);
    });
    return obj;
  }

};

/*******
  Base object prototype property properties
*******/
var PROTO_PROPS = {

};

/*******
  Build Base object
*******/
var protoDescriptors = {};
var objDescriptors = {};
Object.keys(PROTO_PROPS, function(key) {
  protoDescriptors[key] = {};
  protoDescriptors['value'] = PROTO_PROPS[key];
});
Object.keys(OBJ_PROPS, function(key) {
  objDescriptors[key] = {};
  objDescriptors['value'] = OBJ_PROPS[key];
});
var BBase = OBJ_PROPS.extendWithDescriptors.call(
    Object, protoDescriptors, objDescriptors);

var Base = ctor;

Base.prototype = Object.create(Object.prototype, {
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
      var obj = Object.create(this.prototype);
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

function getPopulatedDefaultDescriptor = function(value) {
  var descriptor = Util.cloneKeys(this.defaultDescriptor_);
  descriptor['value'] = value;
  return descriptor;
}

Base.defaultDescriptor_ = {
  enumerable: true,
  writable: true,
  configurable: true
};

return Base;
});
