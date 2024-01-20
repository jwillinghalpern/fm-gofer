const w = "The FM script call timed out", l = "fmGoferCallbackD7738642C91848E08720EAC24EDDA483";
function p() {
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
    callbackName: l
  }, window[l] = G);
}
function v(r, t, o, e) {
  const n = p(), i = { resolve: r, reject: t };
  return o !== 0 && (i.timeoutID = setTimeout(() => {
    i.fmOnReadyIntervalID && clearInterval(i.fmOnReadyIntervalID), u(n), t(e);
  }, o)), window.fmGofer.promises[n] = i, n;
}
function D(r) {
  return window.fmGofer.promises[r];
}
function u(r) {
  var o, e;
  const t = (e = (o = window.fmGofer) == null ? void 0 : o.promises) == null ? void 0 : e[r];
  return t && (t.timeoutID && clearTimeout(t.timeoutID), t.fmOnReadyIntervalID && clearInterval(t.fmOnReadyIntervalID)), delete window.fmGofer.promises[r];
}
function G(r, t, o) {
  try {
    o === "0" && (o = "");
    const e = D(r);
    if (typeof e > "u")
      throw new Error(`No promise found for promiseID ${r}.`);
    e.timeoutID && clearTimeout(e.timeoutID), o ? e.reject(t) : e.resolve(t), u(r);
  } catch (e) {
    console.error(e);
  }
}
function h(r, t, o) {
  let e;
  return {
    promise: new Promise((i, a) => {
      if (typeof window.FileMaker == "object") {
        window.FileMaker.PerformScriptWithOption(r, t, o);
        return;
      }
      const f = 5, s = 2e3;
      let m = 0;
      e = setInterval(() => {
        m += f, m > s && (clearInterval(e), a(`window.FileMaker not found within ${s} ms`)), typeof window.FileMaker == "object" && (clearInterval(e), window.FileMaker.PerformScriptWithOption(r, t, o), i());
      }, f);
    }),
    intervalID: e
  };
}
class O extends Promise {
  async json() {
    const t = await this;
    return JSON.parse(t);
  }
}
function d(r, t, o, e = 15e3, n = w) {
  if (typeof r != "string" || !r)
    throw new Error("script must be a string");
  if (typeof e != "number")
    throw new Error("timeout must be a number");
  if (typeof n != "string")
    throw new Error("timeoutMessage must be a string");
  return new O(async (i, a) => {
    y();
    const f = v(i, a, e, n), s = {
      promiseID: f,
      callbackName: l,
      parameter: t
    }, m = JSON.stringify(s);
    try {
      const { promise: c, intervalID: x } = h(
        r,
        m,
        o
      );
      window.fmGofer.promises[f].fmOnReadyIntervalID = x, await c;
    } catch (c) {
      u(f), a(c);
    }
  });
}
function b(r, t = void 0, o = 15e3, e = w) {
  return d(
    r,
    t,
    void 0,
    o,
    e
  );
}
const M = { PerformScript: b, PerformScriptWithOption: d };
export {
  b as PerformScript,
  d as PerformScriptWithOption,
  M as default
};
