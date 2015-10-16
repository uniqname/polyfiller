'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
var resolve = function resolve(fn) {
    return typeof fn === 'function' ? fn() : fn;
};
var fetchecute = function fetchecute(src) {
    return new Promise(function (res, rej) {
        var scrpt = document.createElement('script'),
            remove = function remove(s) {
            return s.parentElement.removeChild(s);
        };
        scrpt.onerror = function () {
            remove(scrpt);rej();
        };
        scrpt.onload = function () {
            remove(scrpt);res();
        };
        scrpt.src = src;
        document.documentElement.appendChild(scrpt);
    });
};
var promisify = function promisify(fn) {
    return new Promise(function (res) {
        return res(fn());
    });
};
var noop = function noop() {
    return true;
};
function polyfiller() {
    for (var _len = arguments.length, tests = Array(_len), _key = 0; _key < _len; _key++) {
        tests[_key] = arguments[_key];
    }

    return Promise.all(tests.map(function (testObj) {
        return new Promise(function (res) {
            var passes = resolve(testObj.test),
                filler = function filler() {
                return typeof testObj.fill === 'string' ? fetchecute(testObj.fill) : promisify(testObj.fill || noop);
            };
            res(passes || filler().then(testObj.after || noop));
        });
    }));
}

exports['default'] = polyfiller;
module.exports = exports['default'];

