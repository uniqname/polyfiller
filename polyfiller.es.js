const resolve = (fn) => (typeof fn === 'function') ? fn() : fn,
    fetchecute = (src) => new Promise((res, rej) => {
        let scrpt = document.createElement('script'),
            remove = (s) => s.parentElement.removeChild(s);
        scrpt.onerror = () => { remove(scrpt); rej(); };
        scrpt.onload = () => { remove(scrpt); res(); };
        scrpt.src = src;
        document.documentElement.appendChild(scrpt);
    }),
    promisify = fn => new Promise(res => res(fn())),
    noop = () => true;

export default function polyfiller(...tests) {
    return Promise.all(tests.map(testObj => new Promise(res => {
        let passes = resolve(testObj.test),
            filler = () => (typeof testObj.fill === 'string') ? fetchecute(testObj.fill) : promisify(testObj.fill || noop);
        res(passes || filler().then(testObj.after || noop));
    })));
}
