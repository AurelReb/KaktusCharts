export function randomSeries(e, t) {
    for (var a = [], r = 0, n = 1700000000; n < e + 1700000000; n ++) {
        r += Math.random() * e / 1e3 - e / 1e3 / 2
        a.push([n, r]);
    }
    return a
}
