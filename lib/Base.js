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
var Proto = require('./Proto');
var DecorationDecorator = require('./decorators/DecorationDecorator');
var slice = Array.prototype.slice;

var config = require('../config');
var ctor = config.ctor;

var Base = Proto.extendSelfWithDescriptors({
  /*******
    Create a new object whose prototype property inherits from the current
    object's prototype property.
    The new object will have a prototype property with properties {protoProps},
    and will itself have properties {objProps}.
    For the prototype property, its inheritance chain is extended with each call to extend.
    The object itself will always have Base as its prototype.
  *******/
  extend: {
    value: function(protoProps, objProps) {
      objProps = objProps || {};
      protoProps = protoProps || {};

      var obj = Base.extendSelf(objProps);
      obj.defineProperty('prototype', {
        value: this.prototype.extendSelf(protoProps)
      });
      return obj;
    }
  },

  /*******
    Same as extend, but with custom descriptors.
  *******/
  extendWithDescriptors: {
    value: function(protoDescriptors, objDescriptors) {
      objDescriptors = objDescriptors || {};
      protoDescriptors = protoDescriptors || {};

      var obj = proto.extendSelfWithDescriptors(objDescriptors);
      obj.defineProperty('prototype', {
        value: this.prototype.extendSelfWithDescriptors(protoDescriptors),
        configurable: true
      });
      return obj;
    }
  },

  /*******
    Create an object whose prototype is the current object's
    prototype property and initialize it.
  *******/
  create: {
    value: function() {
      var obj = Object.create(this.prototype);
      return obj[ctor].apply(obj, arguments) || obj;
    }
  }

});

/*******
  The prototype property
*******/
Base.defineProperty('prototype', {
  value: Proto,
  configurable: true
});


/*******
  *~*~ Decorate with the ability to be decorated ~*~*
*******/
Base = DecorationDecorator.decorate(Base);

/*******
  Lock in dat flava
*******/
Object.seal(Base);

return Base;

});
