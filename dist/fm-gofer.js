const w = "The FM script call timed out", c = "fmGoferCallbackD7738642C91848E08720EAC24EDDA483";
function x() {
  return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, (o) => {
    var r = Math.random() * 16 | 0, e = o == "x" ? r : r & 3 | 8;
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
  }, window[c] = G);
}
function v(t, o, r, e) {
  const n = x(), i = { resolve: t, reject: o };
  return r !== 0 && (i.timeoutID = setTimeout(() => {
    i.fmOnReadyIntervalID && clearInterval(i.fmOnReadyIntervalID), l(n), o(e);
  }, r)), window.fmGofer.promises[n] = i, n;
}
function D(t) {
  return window.fmGofer.promises[t];
}
function l(t) {
  var r, e;
  const o = (e = (r = window.fmGofer) == null ? void 0 : r.promises) == null ? void 0 : e[t];
  return o && (o.timeoutID && clearTimeout(o.timeoutID), o.fmOnReadyIntervalID && clearInterval(o.fmOnReadyIntervalID)), delete window.fmGofer.promises[t];
}
function G(t, o, r) {
  try {
    r === "0" && (r = "");
    const e = D(t);
    if (typeof e > "u")
      throw new Error(`No promise found for promiseID ${t}.`);
    e.timeoutID && clearTimeout(e.timeoutID), r ? e.reject(o) : e.resolve(o), l(t);
  } catch (e) {
    console.error(e);
  }
}
function h(t, o, r) {
  let e;
  return {
    promise: new Promise((i, a) => {
      if (typeof window.FileMaker == "object") {
        window.FileMaker.PerformScriptWithOption(t, o, r);
        return;
      }
      const f = 5, m = 2e3;
      let s = 0;
      e = setInterval(() => {
        s += f, s > m && (clearInterval(e), a(`window.FileMaker not found within ${m} ms`)), typeof window.FileMaker == "object" && (clearInterval(e), window.FileMaker.PerformScriptWithOption(t, o, r), i());
      }, f);
    }),
    intervalID: e
  };
}
function d(t, o, r, e = 0, n = w) {
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
      callbackName: c,
      parameter: o
    }, s = JSON.stringify(m);
    try {
      const { promise: u, intervalID: p } = h(
        t,
        s,
        r
      );
      window.fmGofer.promises[f].fmOnReadyIntervalID = p, await u;
    } catch (u) {
      l(f), a(u);
    }
  });
}
function O(t, o = void 0, r = 0, e = w) {
  return d(
    t,
    o,
    void 0,
    r,
    e
  );
}
const b = {
  Default: 0,
  Continue: 0,
  Halt: 1,
  Exit: 2,
  Resume: 3,
  Pause: 4,
  SuspendAndResume: 5
}, M = { PerformScript: O, PerformScriptWithOption: d };
export {
  b as Option,
  O as PerformScript,
  d as PerformScriptWithOption,
  M as default
};
