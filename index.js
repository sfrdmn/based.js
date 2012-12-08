var config = require('./config');

module.exports = {

  Util: require('./lib/Util'),

  Proto: require('./lib/Proto'),

  Base: require('./lib/Base'),

  Decorator: require('./lib/Decorator'),

  decorators: require('./lib/decorators'),

  configure: function(options) {
    this.Util.mixinKeys(config, options);
  }
}
