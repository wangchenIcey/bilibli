//
const create = (t) => {
    var e,
        i = [];
    for (i[0] = 1, e = 1; e < t; e++) {
        i[e] = i[e - 1] * e;
    }
    return i;
};
export function encode(t, e) {
    var i,
        a,
        n = t.length,
        o = this.create(e),
        r = [];
    for (i = 0; i < n; i++)
        for (r[i] = 0, a = 0; a < i; a++) t[a] > t[i] && r[a]++;
    var s = 0;
    for (i = 0; i < n; i++) s += r[i] * o[n - i - 1];
    return s.toString(32);
};
export function decode(t, e) {
    var i, a;
    t = parseInt(t, 32);
    var n = [],
        o = [],
        r = [],
        s = create(e);
    for (i = e - 1, a = 0; i >= 0; i--, a++)
        (n[a] = t / s[i]), 0 !== t && (t %= s[i]), (o[i] = 1);
    for (i = 0; i < e; i++) {
        var l = 0;
        for (a = 0; a < e; a++)
            if ((l += o[a]) > n[i]) {
                (r[i] = a), (o[a] = 0);
                break;
            }
    }
    return r;
};
export function defaultSort(len) {
    for (var t = [], e = 0; e < len; e++) t[e] = e;
    return t;
};