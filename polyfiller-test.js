require('babel/register');
var test = require('tape'),
    polyfiller = require('./polyfiller.es'),

    //mock relevant document props
    createElement = function (elType) {
        var onerror,
            onload,
            el = {
                parentElement: elType === 'parent' ? {} : createElement('parent'),
                removeChild: function () {},
                appendChild: function () {},
                nodeName: elType
            };
        Object.defineProperty(el, 'onload', {
            get: function () { return onload; },
            set: function (fn) {
                onload = typeof fn === 'function' ? fn : onload;
            }
        });
        Object.defineProperty(el, 'onerror', {
            get: function () { return onerror; },
            set: function (fn) {
                onerror = typeof fn === 'function' ? fn : onerror;
            }
        });
        Object.defineProperty(el, 'src', {
            set: function (src) {
                if (elType === 'script') {
                    if (!src && typeof el.onerror === 'function') {
                        el.onerror();
                    } else if (typeof el.onload === 'function') {
                        el.onload();
                    }
                }
            }
        });
        return el;
    },
    tests = [{
        test: true,
        fill: function () {}
    }, {
        test: false,
        fill: function () {}
    }, {
        test: true,
        fill: function () {}
    }];

global.document = {
        createElement: createElement,
        documentElement: createElement('html')
    };

test('accepts 0 to N test objects', function (t) {
    polyfiller()
        .then(function () {
            t.pass('passes with no tests');
        })
        .catch(function () {
            t.fail('failed when no tests');
        });

    polyfiller({
        test: true,
        fill: function () {}
    }).then(function () {
        t.pass('passes with one test');
    }).catch(function () {
        t.fail('failed when one test');
    });

    polyfiller.apply(polyfiller, tests)
        .then(function () {
            t.pass('passes with multiple tests');
            t.end();
        }).catch(function () {
            t.fail('failes when multiple tests');
            t.end();
        });
});

test('calls polyfill function if test fails', function (t) {
    polyfiller({
        test: true,
        fill: function () { t.fail('fill called when test passes'); t.end(); }
    }, {
        test: false,
        fill: function () { t.pass('fill called when test fails'); t.end(); }
    });
});

test('loads polyfill script if test fails', function (t) {
    polyfiller({
        test: true,
        fill: function () { t.fail('fill called when test passes'); t.end(); }
    }, {
        test: false,
        fill: 'true'
    }).then(function () {
        t.pass('polyfill loaded');
        t.end();
    }).catch(function () {
        t.fail('polyfill failed');
    });
});

test('polyfiller rejects if polyfill script fails to load', function (t) {
    polyfiller({
        test: true,
        fill: function () { t.fail('polyfiller incorrectly called fill when test passes'); }
    }, {
        test: false,
        fill: ''
    }).then(function () {
        t.fail('polyfiller failed to reject when script fails to load');
    })
    .catch(function () {
        t.pass('polyfiller properly rejects when script fails to load');
        t.end();
    });
});

test('`after` called when polyfill executed', function (t) {
    polyfiller({
        test: true,
        fill: function () { t.fail('polyfiller incorrectly called fill when test passes'); }
    }, {
        test: false,
        fill: 'true',
        after: function () { t.pass('`after` function called when polyfill executed'); t.end(); }
    }).catch(function () {
        t.fail('something when horribly wrong');
        t.end();
    });
});
