'use strict';

var Enum = module.exports = function Enum (value) {
    var obj;
    if (this instanceof Enum) {
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
            this[key] = val || count++;
        }, this);
        Object.freeze(this);
    } else {
        obj = Object.create(Enum.prototype);
        return Enum.call(obj, value) || obj;
    }
};

function findValue (value) {
    for (var key in this)
        if (this.hasOwnProperty(key) && this[key] === value) return key;
    return false;
}

Enum.prototype = {
    constructor: Enum,
    get: function (item) {
        var key = this.has(item);
        return key ? this[key] : undefined;
    },
    has: function (item) {
        return (this.hasOwnProperty(typeof item === 'string' && item) && item) || findValue.call(this, item);
    },
    keys: function () {
        return Object.getOwnPropertyNames(this).filter(function (key) {
            return key !== 'get' && key !== 'has' && key !== 'keys';
        });
    }
};
