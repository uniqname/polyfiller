# polyfiller
A promise based mechanism for dynamically polyfilling features.

## `polyfiller` object
polyfiller takes 0 to N `testObjects` and returns a promise that resolves when all tests have passed or all polyfills have been executed for failed tests.

```js
import polyfiller from 'polyfiller';
import app from 'app';

const tests = [{
    test: Object.assign,
    fill: './polyfills/object-assign.js',
    after: function () { Object.assign = assign; }
},{
    test: Object.observe,
    fill: './polyfills/object-observe.js'
},{
    test: [].find,
    fill: function () {
        Array.prototype.find = function (predicate) {
            return this.filter(predicate)[0];
        }
    }
}];

polyfiller(...tests).then(app);
```

## Test objects

Each test object has two required properties, `test` and `fill`, with an optional thrid, `after`.

The `test` property may be a function or a value. If a value it is understood as either "truthy" or "falsey". If a function, it's return value is used. "Truthy" values indicate the platform supports the feature you are testing and therefore needs no polyfill. "Falsey" values require a polyfill.

The `fill` property may be either a function or a string. If a function, it is invoked when a test fails. If a string, it is assumed to be a URL to an external polyfill script. The script is loaded via a `<script>` tag attached to the document which is removed from the document after the script's `onload` event fires. Despite the `<script>` being removed, the code that was executed is still part of the environment, so the results are still available.

The optional `after` test object method gives one the ability to turn a `ponyfill` -- an implementation of a standard feature that does not modify global objects, but will use the native implementation if available -- into a proper polyfill, or vice-versa. Ponyfills and polyfills each have advantages and disadvantages and polyfiller will work for both cases. The `after` method allows you to reconcile a polyfill/ponyfill mismatch.

_NOTE: Since polyfiller is Promise based, it requires global.Promises to exist. This library is not useful for polyfilling Promise._
