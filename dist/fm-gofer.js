const w = "The FM script call timed out", c = "fmGoferCallbackD7738642C91848E08720EAC24EDDA483";
function x() {
  return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, (t) => {
    var o = Math.random() * 16 | 0, e = t == "x" ? o : o & 3 | 8;
    return e.toString(16);
  });
}
function I() {
  return typeof window.fmGofer == "object" && window.fmGofer !== null && !Array.isArray(window.fmGofer);
}
function y() {
  I() || (window.fmGofer = {
    promises: {},
    callbackName: c
  }, window[c] = h);
}
function v(r, t, o, e) {
  const n = x(), i = { resolve: r, reject: t };
  return o !== 0 && (i.timeoutID = setTimeout(() => {
    i.fmOnReadyIntervalID && clearInterval(i.fmOnReadyIntervalID), l(n), t(e);
  }, o)), window.fmGofer.promises[n] = i, n;
}
function D(r) {
  return window.fmGofer.promises[r];
}
function l(r) {
  var o, e;
  const t = (e = (o = window.fmGofer) == null ? void 0 : o.promises) == null ? void 0 : e[r];
  return t && (t.timeoutID && clearTimeout(t.timeoutID), t.fmOnReadyIntervalID && clearInterval(t.fmOnReadyIntervalID)), delete window.fmGofer.promises[r];
}
function h(r, t, o) {
  try {
    o === "0" && (o = "");
    const e = D(r);
    if (typeof e > "u")
      throw new Error(`No promise found for promiseID ${r}.`);
    e.timeoutID && clearTimeout(e.timeoutID), o ? e.reject(t) : e.resolve(t), l(r);
  } catch (e) {
    console.error(e);
  }
}
function G(r, t, o) {
  let e;
  return {
    promise: new Promise((i, s) => {
      if (typeof window.FileMaker == "object") {
        window.FileMaker.PerformScriptWithOption(r, t, o);
        return;
      }
      const f = 5, a = 2e3;
      let m = 0;
      e = setInterval(() => {
        m += f, m > a && (clearInterval(e), s(`window.FileMaker not found within ${a} ms`)), typeof window.FileMaker == "object" && (clearInterval(e), window.FileMaker.PerformScriptWithOption(r, t, o), i());
      }, f);
    }),
    intervalID: e
  };
}
class O extends Promise {
  json() {
    return this.then((t) => JSON.parse(t));
  }
}
function d(r, t, o, e = 0, n = w) {
  if (typeof r != "string" || !r)
    throw new Error("script must be a string");
  if (typeof e != "number")
    throw new Error("timeout must be a number");
  if (typeof n != "string")
    throw new Error("timeoutMessage must be a string");
  return new O(async (i, s) => {
    y();
    const f = v(i, s, e, n), a = {
      promiseID: f,
      callbackName: c,
      parameter: t
    }, m = JSON.stringify(a);
    try {
      const { promise: u, intervalID: p } = G(
        r,
        m,
        o
      );
      window.fmGofer.promises[f].fmOnReadyIntervalID = p, await u;
    } catch (u) {
      l(f), s(u);
    }
  });
}
function b(r, t = void 0, o = 0, e = w) {
  return d(
    r,
    t,
    void 0,
    o,
    e
  );
}
const M = {
  Default: 0,
  Continue: 0,
  Halt: 1,
  Exit: 2,
  Resume: 3,
  Pause: 4,
  SuspendAndResume: 5
}, P = { PerformScript: b, PerformScriptWithOption: d };
export {
  O as FMGPromise,
  M as Option,
  b as PerformScript,
  d as PerformScriptWithOption,
  P as default
};
