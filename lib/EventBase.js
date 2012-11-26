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
        root['basedjs']['EventBase'] = factory();
    }
})(this, function() {

  var Util = require('./Util');
  var EventEmitter = require('EventEmitter');

  var EventBase = Base.extend();
  Util.mixinOwnPropertyNames(EventBase, EventEmitter.prototype);

});
