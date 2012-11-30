var index = require('../index');

module.exports = exports = {

  testHappiness: function(test) {
    test.ok(true, 'True is true :)');
    test.done();
  },

  testModuleIsOK: function(test) {
    test.ok(index.Base, 'Yeah!');
    test.ok(index.Proto, 'Yeah!');
    test.ok(index.Util, 'Yeah!');
    test.ok(index.configure, 'Yeah!');
    test.done();
  }

};
