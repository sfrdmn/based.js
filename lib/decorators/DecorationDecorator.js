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
        root['basedjs']['DecorationDecorator'] = factory();
    }
})(this, function() {

var Decorator = require('../Decorator');

var DecorationDecorator = Decorator.extendSelf({

  extend: function(protoProps, objProps) {
    var obj = this.decoratedObj_.extend.apply(this, arguments);

    if (objProps &&
        objProps.decorators &&
        objProps.decorators.length) {

      var decorators = objProps.decorators;
      decoratePrototypeProperty(obj, decorators);
    }

    return obj;
  },

  extendWithDescriptors: function(protoDescriptors, objDescriptors) {
    var obj = this.decoratedObj_.extendWithDescriptors.apply(this, arguments);

    if (objDescriptors &&
        objDescriptors.decorators &&
        objDescriptors.decorators.value &&
        objDescriptors.decorators.value.length) {

      var decorators = objDescriptors.decorators.value;
      decoratePrototypeProperty(obj, decorators);
    }

    return obj;
  },

  decorators: {
    value: []
  }

})

function decoratePrototypeProperty(obj, decorators) {
    var proto = obj.prototype;
    decorators.forEach(function(decorator) {
      proto = decorator.decorate(proto);
    });

    obj.defineProperty('prototype', {
      value: proto,
      configurable: true
    });

    return obj;
}

/*******
  Lock in dat flava
*******/
Object.seal(DecorationDecorator);

return DecorationDecorator;

});
