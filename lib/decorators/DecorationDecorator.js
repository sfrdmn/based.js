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

var Decorator = require('./Decorator');

var DecorationDecorator = Decorator.extendSelf({

  extend: function(protoProps, objProps) {
    if (objProps && objProps.decorators && objProps.decorators.length) {
      return extendWithDecorators.apply(this,
          ['extend', protoProps, objProps]);
    } else {
      return this.decoratedObj_.extend.apply(this, arguments);
    }
  },

  extendWithDescriptors: function(protoDescriptors, objDescriptors) {
    if (objDescriptors && objDescriptors.decorators &&
        objDescriptors.decorators.value.length) {
      return extendWithDecorators.apply(this,
          ['extendWithDescriptors', protoDescriptors, objDescriptors]);
    } else {
      return this.decoratedObj_.extendWithDescriptors.apply(this, arguments);
    }
  },

  decorators: {
    value: []
  }

})

function extendWithDecorators(extendMethod, protoExtend, objExtend) {
    var decorators = objExtend.decorators || (objExtend.decorators [];

    var obj = this.decoratedObj_[extendMethod](protoExtend, objExtend);

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
