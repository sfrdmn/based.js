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
        root['basedjs']['Util'] = factory();
    }
})(this, function() {

var slice = Array.prototype.slice;

var Util = {};

// Util.mixinOwnPropertyNames(A, B, C ...) mixin to A

Util.mixinOwnPropertyNames = function() {
  var args = slice.call(arguments);
  var obj = args.shift();
  args.forEach(function(source) {
    Object.getOwnPropertyNames(source).forEach(function(prop) {
      obj[prop] = source[prop];
    });
  });
  return obj;
};

Util.mixinOwnPropertyNamesAndDescriptors = function() {
  var args = slice.call(arguments);
  var obj = args.shift();
  var descriptors = {};
  args.forEach(function(source) {
    Object.getOwnPropertyNames(source).forEach(function(prop) {
      var descriptor = Object.getOwnPropertyDescriptor(source, prop);
      descriptors[prop] = descriptor;
    });
  });
  return Object.defineProperties(obj, descriptors);
};

Util.mixinKeys = function() {
  var args = slice.call(arguments);
  var obj = args.shift();
  args.forEach(function(source) {
    Object.keys(source).forEach(function(key) {
      obj[key] = source[key];
    });
  });
  return obj;
};

Util.mixinKeysAndDescriptors = function() {
  var args = slice.call(arguments);
  var obj = args.shift();
  var descriptors = {};
  args.forEach(function(source) {
    Object.keys(source).forEach(function(key) {
      var descriptor = Object.getOwnPropertyDescriptor(source, key);
      descriptors[key] = descriptor;
    });
  });
  return Object.defineProperties(obj, descriptors);
};

Util.cloneOwnPropertyNames = function(obj) {
  var proto = Object.getPrototypeOf(obj);
  var clone = Object.create(proto);
  Object.getOwnPropertyNames(obj).forEach(function(prop) {
    clone[prop] = obj[prop];
  });
  return clone;
};

Util.cloneOwnPropertyNamesAndDescriptors = function(obj) {
  var proto = Object.getPrototypeOf(obj);
  var descriptors = {};
  Object.getOwnPropertyNames(obj).forEach(function(prop) {
    var descriptor = Object.getOwnPropertyDescriptor(obj, prop);
    descriptors[prop] = descriptor;
  });
  return Object.create(proto, descriptors);
};

Util.cloneKeys = function(obj) {
  var proto = Object.getPrototypeOf(obj);
  var clone = Object.create(proto);
  Object.keys(obj).forEach(function(key) {
    clone[key] = obj[key];
  });
  return clone;
};

Util.cloneKeysAndDescriptors = function(obj) {
  var proto = Object.getPrototypeOf(obj);
  var descriptors = {};
  Object.keys(obj).forEach(function(key) {
    var descriptor = Object.getOwnPropertyDescriptor(obj, key);
    descriptors[key] = descriptor;
  });
  return Object.create(proto, descriptors);
};

return Util;

});
