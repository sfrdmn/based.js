var config = require('./config');

module.exports = {
  Util: require('./lib/Util'),

  Proto: require('./lib/Proto'),

  Base: require('./lib/Base'),

  configure: function(options) {
    this.Util.mixinKeys(config, options);
  }
}
