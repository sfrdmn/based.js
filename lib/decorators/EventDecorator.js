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
        root['basedjs']['EventDecorator'] = factory();
    }
})(this, function() {

var EventEmitter = require('events').EventEmitter;
var Decorator = require('./Decorator');



var EventDecorator = Decorator.extendSelfWithObject(EventEmitter.prototype);

/*******
  Lock in dat flava
*******/
Object.seal(EventDecorator);

return EventDecorator;

});
