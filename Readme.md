# based.js
![](http://i.imgur.com/SiCJZ.jpg)

Some ECMA5 savvy inheritance/general object management including descriptor aware mixins, clones, etc.

Pretty prototypal. Distinction is not made between "class" objects and instances,
but rather between uninitialized objects and initialized objects

`create` creates a new object and initializes it,
`extend` creates a new object without initializing it.

No prototype property and thus no "class properties" :/

## Usage
```Javascript
var Base = require('basedjs').Base

var A = Base.extend({
  hi: function() {
    return 'hey dood :)';
  }
});

var a = A.create();
a.hi();
```

<blockquote>
  <p>AK40 send ya, A fuckin blessin</p>
  <cite>Lil B</cite>
</blockquote>
