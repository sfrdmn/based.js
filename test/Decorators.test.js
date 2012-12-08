var Base = require('../lib/Base');
var Proto = require('../lib/Proto');
var Util = require('../lib/Util');
var decorators = require('../lib/decorators');
var Decorator = require('../lib/Decorator');
var EventDecorator = decorators.EventDecorator;

var OldGuyDecorator = Decorator.extendSelf({
  getName: function(){
    return this._deco_.getName() + ' Sr.';
  }
});

module.exports = exports = {

  testHappiness: function(test) {
    test.ok(true, 'True is true :)');
    test.done();
  },

  testExtendWithDecorators: function(test) {
    var A = Base.extend({
      getName: function() {
        return 'Jon Knox';
      }
    }, {
      decorators: [OldGuyDecorator]
    });
    var a = A.create();
    test.equal(a.getName(), 'Jon Knox Sr.');
    test.done();
  },

  testEventDecorator: function(test) {
    test.expect(1);
    var A = Base.extend({
      msg: 'hey!'
    }, {
      decorators: [EventDecorator]
    });
    var a = A.create();
    a.on('go', function() {
      test.equals(a.msg, 'hey!');
    });
    a.emit('go');
    test.done();
  },

  testMultipleDecorators: function(test) {
    var A = Base.extend({
      getName: function() {
        return 'Jon Knox';
      }
    }, {
      decorators: [OldGuyDecorator, OldGuyDecorator]
    });
    var a = A.create();
    test.equal(a.getName(), 'Jon Knox Sr. Sr.');
    test.done();
  }

};
