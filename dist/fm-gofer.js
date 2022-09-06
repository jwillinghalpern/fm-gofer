const w = "The FM script call timed out", l = "fmGoferCallbackD7738642C91848E08720EAC24EDDA483";
function x() {
  return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, (r) => {
    var o = Math.random() * 16 | 0, e = r == "x" ? o : o & 3 | 8;
    return e.toString(16);
  });
}
function I() {
  return typeof window.fmGofer == "object" && window.fmGofer !== null && !Array.isArray(window.fmGofer);
}
function y() {
  I() || (window.fmGofer = {
    promises: {},
    callbackName: l
  }, window[l] = G);
}
function v(t, r, o, e) {
  const n = x(), i = { resolve: t, reject: r };
  return o !== 0 && (i.timeoutID = setTimeout(() => {
    i.fmOnReadyIntervalID && clearInterval(i.fmOnReadyIntervalID), u(n), r(e);
  }, o)), window.fmGofer.promises[n] = i, n;
}
function D(t) {
  return window.fmGofer.promises[t];
}
function u(t) {
  var o, e;
  const r = (e = (o = window.fmGofer) == null ? void 0 : o.promises) == null ? void 0 : e[t];
  return r && (r.timeoutID && clearTimeout(r.timeoutID), r.fmOnReadyIntervalID && clearInterval(r.fmOnReadyIntervalID)), delete window.fmGofer.promises[t];
}
function G(t, r, o) {
  try {
    o === "0" && (o = "");
    const e = D(t);
    if (typeof e > "u")
      throw new Error(`No promise found for promiseID ${t}.`);
    e.timeoutID && clearTimeout(e.timeoutID), o ? e.reject(r) : e.resolve(r), u(t);
  } catch (e) {
    console.error(e);
  }
}
function h(t, r, o) {
  let e;
  return {
    promise: new Promise((i, a) => {
      if (typeof window.FileMaker == "object") {
        window.FileMaker.PerformScriptWithOption(t, r, o);
        return;
      }
      const f = 5, m = 2e3;
      let s = 0;
      e = setInterval(() => {
        s += f, s > m && (clearInterval(e), a(`window.FileMaker not found within ${m} ms`)), typeof window.FileMaker == "object" && (clearInterval(e), window.FileMaker.PerformScriptWithOption(t, r, o), i());
      }, f);
    }),
    intervalID: e
  };
}
function d(t, r, o, e = 15e3, n = w) {
  if (typeof t != "string" || !t)
    throw new Error("script must be a string");
  if (typeof e != "number")
    throw new Error("timeout must be a number");
  if (typeof n != "string")
    throw new Error("timeoutMessage must be a string");
  return new Promise(async (i, a) => {
    y();
    const f = v(i, a, e, n), m = {
      promiseID: f,
      callbackName: l,
      parameter: r
    }, s = JSON.stringify(m);
    try {
      const { promise: c, intervalID: p } = h(
        t,
        s,
        o
      );
      window.fmGofer.promises[f].fmOnReadyIntervalID = p, await c;
    } catch (c) {
      u(f), a(c);
    }
  });
}
function b(t, r = void 0, o = 15e3, e = w) {
  return d(
    t,
    r,
    void 0,
    o,
    e
  );
}
const O = { PerformScript: b, PerformScriptWithOption: d };
export {
  b as PerformScript,
  d as PerformScriptWithOption,
  O as default
};
