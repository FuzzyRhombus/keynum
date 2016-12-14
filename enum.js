'use strict';

var Enum = module.exports = function Enum (value, options) {
    var obj;
    if (this instanceof Enum) {
        options = options || {};
        var useCase = options.preserveCase === false || options.preserveCase && options.preserveCase.toLowerCase;
        if (useCase) useCase = (options.preserveCase.toLowerCase && options.preserveCase.toLowerCase() === 'lower' ? 'toLowerCase' : 'toUpperCase');
        Object.defineProperty(this, '_ignoreCase', {value: !!options.ignoreCase, enumerable: false});
        // TODO: add ability to .add key/values to unfrozen enums
        var count = 0,
            props = null;
        if (typeof value === 'object') props = value instanceof Array ? value : Object.getOwnPropertyNames(value);
        else if (typeof value === 'string') props = [value];
        if (!props || !props.length) throw new Error('Invalid enum');
        var isArray = props === value;
        props.forEach(function (key) {
            var val;
            if (isArray && typeof key === 'object') count = key[(key = Object.getOwnPropertyNames(key)[0])];
            else if (!isArray || isNaN(key)) val = value[key];
            if (useCase) key = key[useCase]();
            this[key] = val || count++;
        }, this);
        if (options.freeze != false) Object.freeze(this); // jshint ignore:line
    } else {
        obj = Object.create(Enum.prototype);
        return Enum.call(obj, value, options) || obj;
    }
};

function findValue (value) {
    for (var key in this)
        if (this.hasOwnProperty(key) && this[key] === value) return key;
    return false;
}

function findKey (key) {
    if (typeof key !== 'string') return false;
    if (!this._ignoreCase) return this.hasOwnProperty(key) && key;
    var keys = this.keys();
    key = key.toLowerCase();
    for (var i=0;i<keys.length;++i)
        if (keys[i].toLowerCase() === key) return keys[i];
    return false;
}

Enum.prototype = {
    constructor: Enum,
    get: function (item) {
        var key = this.has(item);
        return key ? this[key] : undefined;
    },
    has: function (item) {
        return findKey.call(this, item) || findValue.call(this, item);
    },
    keys: function () {
        return Object.keys(this).filter(function (key) {
            return key !== 'get' && key !== 'has' && key !== 'keys';
        });
    }
};
