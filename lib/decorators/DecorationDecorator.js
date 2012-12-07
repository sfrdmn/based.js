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

var Base = require('./Base');
var Proto = require('./Proto');


var DecorationDecorator = Decorator.extendSelf({

  extend: function(protoProps, objProps) {
    if (objProps.decorators && objProps.decorators.length) {
      return extendWithDecorators.apply(this,
          ['extend', protoProps, objProps]);
    } else {
      return this.decoratedObj_.extend.apply(this, arguments);
    }
  },

  extendWithDescriptors: function(protoDescriptors, objDescriptors) {
    if (objDescriptors.decorators &&
        objDescriptors.decorators.value.length) {
      return extendWithDecorators.apply(this,
          ['extendWithDescriptors', protoDescriptors, objDescriptors]);
    } else {
      return this.decoratedObj_.extendWithDescriptors.apply(this, arguments);
    }
  },

  decorators: {
    value: []
  },

  addDecorators: {
    value: function(decorators) {
      this.decorators = this.decorators.concat(decorators || []);
    }
  },

  removeDecorator: {
    value: function(decoratorToDelete) {
      this.decorators.some(function(decorator, i) {
        if (decorator === decoratorToDelete) {
          this.decorators =
              this.decorators.slice(i, 1);
          return true;
        }
      });
    }
  }

})

function extendWithDecorators(extendMethod, protoExtend, objExtend) {
    var decorators = objExtend.decorators || [];
    delete objExtend.decorators;

    var obj = this.decoratedObj_[extendMethod](protoExtend, objExtend);

    var proto = obj.prototype;
    decorators.forEach(function(key) {
      proto = decorators[key].decorate(proto);
    });

    obj.addDecorators(decorators);
    obj.defineProperty('prototype', {
      value: proto,
      configurable: true
    });

    return decoratedObj;
}

/*******
  Lock in dat flava
*******/
Object.seal(DecorationDecorator);

return DecorationDecorator;

});
