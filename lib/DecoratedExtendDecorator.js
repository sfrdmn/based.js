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
        root['basedjs']['Decorated'] = factory();
    }
})(this, function() {

var Base = require('./Base');
var Proto = require('./Proto');


var DecoratedExtendDecorator = Decorator.extendSelf({

  extend: function(protoProps, objProps) {
    return extendWithDecorators.apply(this,
        ['extend', protoProps, objProps]);
  },

  extendWithDescriptors: function(protoDescriptors, objDescriptors) {
    return extendWithDecorators.apply(this,
        ['extendWithDescriptors', protoDescriptors, objDescriptors]);
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
      this.decorators.forEach(function(decorator, i) {
        if (decorator === decoratorToDelete) {
          this.decorators =
              this.decorators.slice(i, 1);
        }
      });
    }
  }

})


var DecoratedBase = DecoratedExtendDecorator.decorate(Base);

function extendWithDecorators(extendMethod, protoProps, objProps) {
    var decorators = objProps.decorators || [];
    delete objProps.decorators;

    var decoratedObj =
        this.decoratedObj_[extendMethod](protoProps, objProps);

    var decoratedProto = decoratedObj.prototype;
    decorators.forEach(function(key) {
      decoratedObj = decorators[key].decorate(decoratedProto);
    });
    decoratedObj.addDecorators(decorators);

    return decoratedObj;
}

/*******
  Lock in dat flava
*******/
Object.seal(Decorated);

return DecoratedBase;

});
