# keynum

A simple enum type with emphasis on keys

## Basic usage
````javascript
var Enum = require('keynum');

var size = Enum(['SMALL', 'MEDIUM', 'BIG']);

console.log(size.SMALL); // => 0
console.log(size.MEDIUM); // => 1
console.log(size.BIG); // => 2

// using .get
console.log(size.get('SMALL')); // => 0
console.log(size.get(0)); // => 0

// getting all enumerated keys
var keys = size.keys(); // ['SMALL', 'MEDIUM', 'BIG']

````

`keynum` is intended to make key:value matching easy using `.has` and `.get`

````javascript
// the key is returned if the given key or value exists
console.log(size.has('SMALL')); // => 'SMALL'
console.log(size.has(0)); // => 'SMALL'

console.log(size.has('TINY')); // => false
console.log(size.get('TINY') && size.get(45)); // => undefined
````
so you can do things like this:
````javascript
var validType = size.get(size.has(someKeyOrValue) || size.MEDIUM); // defaults to MEDIUM if an invalid type is given
````

`keynum` types are always returned as a frozen object to prevent changes.

## More advanced enumeration
An enum can be created from an array or an object. This gives greater control over the associated values. By default values start at 0 and increment by 1 as can be seen earlier. This can be overridden by providing single key:value objects as an array entry:

````javascript
var size = Enum(['TINY', 'SMALL', {MEDIUM: 4}, {BIG: 10}, 'MASSIVE']);
console.log(size.TINY); // => 0
console.log(size.MEDIUM); // => 4
console.log(size.MASSIVE); // => 11
````

or by just using an object:

````javascript
var size = Enum({
    SMALL: 1,
    BIG: 10
    MEDIUM: 5
}); // order does not matter
console.log(size.SMALL); // => 1
console.log(size.MEDIUM); // => 5
console.log(size.BIG); // => 10
````

The new operator is optional; use however you would like to:
`Enum(['A', 'B', 'C']) || new Enum(['D', 'E', 'F']);`

----
### Tests
Run tests using `npm test`
