var test = require('tape');
var Enum = require('../enum');

var objFixture = {
        A: 1,
        B: 2,
        C: 3
    },
    arrayFixture = [
        'A', 'B', {C:5}, 'D', {0:10}, '1'
    ],
    crazyFixture = ['oNe', 'Two', 'tHrEE'];

test('prevent creating an empty enum', function (t) {
    t.throws(Enum, /invalid/i, 'throws an error if argument passed');
    t.throws(function () {
        var e = new Enum({});
    }, /invalid/i, 'throws an error if empty object is passed');
    t.throws(function () {
        var e = new Enum([]);
    }, /invalid/i, 'throws an error if empty array passed');
    t.end();
});

test('creating a single value enum', function (t) {
    t.plan(1);
    var testEnum = new Enum('test');
    t.equal(testEnum.test, 0, 'creates an enum with single key');
});

test('creating an enum from an object', function (t) {
    var testEnum = Enum(objFixture);
    Object.keys(objFixture).forEach(function (key) {
        if (testEnum[key] !== objFixture[key]) t.fail('does not copy all key:value pairs to enum');
    });
    t.pass('can copy an objects enumerable key:value pairs as Enum');
    t.end();
});

test('creating an enum from an array', function (t) {
    var testEnum = Enum(arrayFixture);
    t.equal(testEnum.A, 0, 'enumerated values start at 0 when not given an explicit value');
    t.equal(testEnum.C, 5, 'can set key:value pair to override enumerated index');
    t.ok(testEnum.B === 1 && testEnum.D === 6, 'enumerated values increment by 1 from the previous value when not explicit');
    t.equal(testEnum['0'], 10, 'can enumerate numerical keys');
    t.end();
});

test('check if enum has a key or value', function (t) {
    var testEnum = Enum(objFixture);
    t.equal(testEnum.has('A'), 'A', 'returns key if the Enum contains the given key');
    t.equal(testEnum.has(objFixture.A), 'A', 'returns key if the Enum contains a key with the given value');
    t.notok(testEnum.has('D'), 'returns false if the Enum does not contain given key');
    t.notok(testEnum.has(4), 'returns false if the Enum does not contain given value');
    t.notok(testEnum.has(), 'returns false if no argument is passed to has');
    t.end();
});

test('getting values from enum', function (t) {
    var testEnum = Enum(objFixture);
    t.equal(testEnum.get('A'), objFixture.A, 'returns the value for the given key');
    t.equal(testEnum.A, objFixture.A, 'can get value by key');
    t.equal(testEnum.get(objFixture.A), objFixture.A, 'returns the value if the Enum contains the given value');
    t.equal(testEnum.get('D') && testEnum.get(4), undefined, 'returns undefined if Enum does not contain key or value');
    t.end();
});

test('getting valid keys on enum', function (t) {
    t.plan(2);
    var testEnum = Enum(objFixture);
    t.deepEqual(testEnum.keys(), Object.keys(objFixture), 'returns keys of the enumerated object');
    testEnum = Enum(arrayFixture);
    t.deepEqual(testEnum.keys(), ['0', '1', 'A', 'B', 'C', 'D'], 'returns keys of the enumerated array');
});

test('enum options', function (t) {

    t.test('default options', function (t) {
        var testEnum = Enum(crazyFixture),
            key = crazyFixture[1];
        t.ok(Object.isFrozen(testEnum), 'enum object is frozen by default');
        t.equal(testEnum[key], 1, 'preserve key casing by default');
        t.notok(testEnum.get(key.toLowerCase()), 'keys are case-sensitive');
        t.end();
    });

    t.test('freezing enum', function (t) {
        t.plan(1);
        var testEnum = Enum(objFixture, {freeze: false});
        t.notok(Object.isFrozen(testEnum), 'does not freeze the object when freeze is false');
    });

    t.test('case-insensitive keys', function (t) {
        t.plan(2);
        var testEnum = Enum(objFixture, {ignoreCase: true});
        t.equal(testEnum.has('a'), 'A', 'can get the key if case does not match');
        t.equal(testEnum.get('a'), testEnum.A, 'can get value using non case matching key');
    });

    t.test('preserving case of keys', function (t) {
        var testEnum = Enum(crazyFixture, {preserveCase: false}),
            value = 1,
            key = crazyFixture[value];
        t.equal(testEnum[key.toUpperCase()], value, 'converts keys to uppercase if preserveCase is false');
        t.notok(testEnum.get(key), 'keys are still case-sensitive');

        testEnum = Enum(crazyFixture, {preserveCase: 'lower', ignoreCase: true});
        t.equal(testEnum[key.toLowerCase()], value, 'converts keys to the case specified');
        t.ok(testEnum.get(key), 'can still use original casing if ignoreCase is also true');

        testEnum = Enum(crazyFixture, {preserveCase: true});
        t.equal(testEnum[key], value, 'can explicitly preserve case');

        t.end();
    });

});
