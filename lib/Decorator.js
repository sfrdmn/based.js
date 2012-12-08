(function (root, factory) {
    if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else {
      // whatev
    }
})(this, function() {

var Proto = require('./Proto');

var Decorator = Proto.extendSelf({

  decorate: function(obj) {
    var result = Proto.extendSelfWithObject.call(obj, this);

    result._deco_ = obj;

    return result;
  }

});

/*******
  Lock in dat flava
*******/
Object.seal(Decorator);

return Decorator;

});
