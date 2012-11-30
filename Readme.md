# based.js
![](http://i.imgur.com/SiCJZ.jpg)

Some ECMA5 savvy inheritance/general object management including descriptor aware mixins, clones, etc.

Main points:

* Make it easier to manage object descriptors
* `Proto` should provide simple, highly cohesive object manipulation methods which can be used to
more easily build specialized objects (such as `Base`)
* `Base` should be a kinda normal-ish Javascript class object

Objects which inherit from `Proto` have the following methods:

* createSelf
* extendSelf
* extendSelfWithDescriptors
* clone
* cloneAll
* mixin
* mixinAll
* defineProperties
* defineProperty

`Base` inherits from `Proto`

Objects which inherit from `Base` have the following methods:

* create
* extend
* extendWithDescriptors

## Usage
```Javascript
var Base = require('basedjs').Base

var A = Base.extend({
  initialize: function() {
    this.msg = 'yo';
  },
  hi: function() {
    return 'hey dood :)';
  }
}, {
  isCool: 'yes'
});

var a = A.create();
a.hi(); // 'hey dood :)'
a.msg; // 'yo'
A.isCool; // 'yes'

var b = a.extend() // Error
var b = a.extendSelf() // Works
```

BSD License

<blockquote>
  <p>AK40 send ya, A fuckin blessin</p>
  <cite>Lil B</cite>
</blockquote>
