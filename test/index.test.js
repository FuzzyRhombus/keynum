var test = require('tape');
var Enum = require('../enum');

var obj = {
    A: 1,
    B: 2,
    C: 3
};

test('creating an Enum type', function (t) {
    var keys = ['A', 'B', {C:5}, 'D', {0:10}, '1'];
    var enum1 = Enum(obj),
        enum2 = Enum(keys);
    t.throws(Enum, /invalid/i, 'throws an error if argument passed');
    t.throws(Enum.bind(null, []), /invalid/i, 'throws an error if empty object is passed');
    t.throws(Enum.bind(null, {}), /invalid/i, 'throws an error if empty array passed');

    Object.keys(obj).forEach(function (key) {
        if (enum1[key] !== obj[key]) t.fail('does not copy all key:value pairs to enum');
    });
    t.pass('can copy an objects enumerable key:value pairs as Enum');

    t.equal(enum2.A, 0, 'enumerated values start at 0 when not given an explicit value');
    t.equal(enum2.C, 5, 'can set key:value pair to override enumerated index');
    t.ok(enum2.B === 1 && enum2.D === 6, 'enumerated values increment by 1 from the previous value when not explicit');
    t.equal(enum2['0'], 10, 'can enumerate numerical keys');

    t.ok(Object.isFrozen(enum1) && Object.isFrozen(enum2), 'always freezes the returned Enum');

    t.end();
});

test('checking Enum contains a key or value', function (t) {
    var testEnum = Enum(obj);
    t.equal(testEnum.has('A'), 'A', 'returns key if the Enum contains the given key');
    t.equal(testEnum.has(obj.A), 'A', 'returns key if the Enum contains a key with the given value');
    t.notok(testEnum.has('D') && testEnum.has(4), 'returns false if the Enum does not contain given key or value');
    t.notok(testEnum.has(), 'returns false if no argument is passed to has');
    t.end();
});

test('getting Enum values', function (t) {
    var testEnum = Enum(obj);
    t.equal(testEnum.get('A'), obj.A, 'returns the value for the given key');
    t.equal(testEnum.get(obj.A), obj.A, 'returns the value if the Enum contains the given value');
    t.equal(testEnum.get('D') && testEnum.get(4), undefined, 'returns undefined if Enum does not contain key or value');
    t.end();
});

test('getting enumerated keys of Enum', function (t) {
    t.plan(2);
    var testEnum = Enum(obj);
    t.deepEqual(testEnum.keys(), Object.keys(obj), 'returns an array of the enumerated keys');
    t.notEqual(testEnum.keys(), Object.keys(testEnum), 'does not return enumerable properties of Enum');
});
