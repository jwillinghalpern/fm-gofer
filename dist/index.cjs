var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  FMGPromise: () => FMGPromise,
  Option: () => Option,
  PerformScript: () => PerformScript,
  PerformScriptWithOption: () => PerformScriptWithOption,
  default: () => FMGofer
});
module.exports = __toCommonJS(index_exports);
var defaultTimeout = 0;
var defaultTimeoutMessage = "The FM script call timed out";
var callbackName = "fmGoferCallbackD7738642C91848E08720EAC24EDDA483";
function fmGoferUUID() {
  const template = "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx";
  return template.replace(/[xy]/g, (c) => {
    var r = Math.random() * 16 | 0, v = c == "x" ? r : r & 3 | 8;
    return v.toString(16);
  });
}
function fmGoferExists() {
  return typeof window.fmGofer === "object" && window.fmGofer !== null && !Array.isArray(window.fmGofer);
}
function initializeGofer() {
  if (fmGoferExists()) return;
  window.fmGofer = {
    promises: {},
    callbackName
  };
  window[callbackName] = runCallback;
}
function storePromise(resolve, reject, timeout, timeoutMessage) {
  const promiseID = fmGoferUUID();
  const promise = { resolve, reject };
  if (timeout !== 0) {
    promise.timeoutID = setTimeout(() => {
      if (promise.fmOnReadyIntervalID)
        clearInterval(promise.fmOnReadyIntervalID);
      deletePromise(promiseID);
      reject(timeoutMessage);
    }, timeout);
  }
  window.fmGofer.promises[promiseID] = promise;
  return promiseID;
}
function getPromise(id) {
  return window.fmGofer.promises[id];
}
function deletePromise(id) {
  const promise = window.fmGofer?.promises?.[id];
  if (promise) {
    if (promise.timeoutID) clearTimeout(promise.timeoutID);
    if (promise.fmOnReadyIntervalID) clearInterval(promise.fmOnReadyIntervalID);
  }
  return delete window.fmGofer.promises[id];
}
function runCallback(promiseID, result, isError) {
  try {
    if (isError === "0") isError = "";
    const promise = getPromise(promiseID);
    if (typeof promise === "undefined")
      throw new Error(`No promise found for promiseID ${promiseID}.`);
    if (promise.timeoutID) clearTimeout(promise.timeoutID);
    if (!!isError) promise.reject(result);
    else promise.resolve(result);
    deletePromise(promiseID);
  } catch (error) {
    console.error(error);
  }
}
function fmOnReady_PerformScriptWithOption(script, param, option) {
  let intervalID;
  const promise = new Promise((resolve, reject) => {
    if (typeof window.FileMaker === "object") {
      window.FileMaker.PerformScriptWithOption(script, param, option);
      return;
    }
    const intervalMs = 5;
    const maxWaitMs = 2e3;
    let totalWaited = 0;
    intervalID = setInterval(() => {
      totalWaited += intervalMs;
      if (totalWaited > maxWaitMs) {
        clearInterval(intervalID);
        reject(`window.FileMaker not found within ${maxWaitMs} ms`);
      }
      if (typeof window.FileMaker === "object") {
        clearInterval(intervalID);
        window.FileMaker.PerformScriptWithOption(script, param, option);
        resolve();
      }
    }, intervalMs);
  });
  return {
    promise,
    intervalID
  };
}
var FMGPromise = class extends Promise {
  json() {
    return this.then((text) => JSON.parse(text));
  }
};
function PerformScriptWithOption(script, parameter, option, timeout = defaultTimeout, timeoutMessage = defaultTimeoutMessage) {
  if (typeof script !== "string" || !script)
    throw new Error("script must be a string");
  if (typeof timeout !== "number") throw new Error("timeout must be a number");
  if (typeof timeoutMessage !== "string")
    throw new Error("timeoutMessage must be a string");
  return new FMGPromise(async (resolve, reject) => {
    initializeGofer();
    const promiseID = storePromise(resolve, reject, timeout, timeoutMessage);
    const paramObj = {
      promiseID,
      callbackName,
      parameter
    };
    const param = JSON.stringify(paramObj);
    try {
      const { promise, intervalID } = fmOnReady_PerformScriptWithOption(
        script,
        param,
        option
      );
      window.fmGofer.promises[promiseID].fmOnReadyIntervalID = intervalID;
      await promise;
    } catch (error) {
      deletePromise(promiseID);
      reject(error);
    }
  });
}
function PerformScript(script, parameter = void 0, timeout = defaultTimeout, timeoutMessage = defaultTimeoutMessage) {
  const option = void 0;
  return PerformScriptWithOption(
    script,
    parameter,
    option,
    timeout,
    timeoutMessage
  );
}
var Option = {
  Default: 0,
  Continue: 0,
  Halt: 1,
  Exit: 2,
  Resume: 3,
  Pause: 4,
  SuspendAndResume: 5
};
var FMGofer = { PerformScript, PerformScriptWithOption };
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  FMGPromise,
  Option,
  PerformScript,
  PerformScriptWithOption
});
//# sourceMappingURL=index.cjs.map