(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.FMGofer = {}));
})(this, (function (exports) { 'use strict';

  var defaultTimeout = 15000;
  var defaultTimeoutMessage = 'The FM script call timed out';
  var callbackName = 'fmGoferD7738642C91848E08720EAC24EDDA483';
  function fmGoferUUID() {
      var template = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx';
      return template.replace(/[xy]/g, function (c) {
          var r = (Math.random() * 16) | 0, v = c == 'x' ? r : (r & 0x3) | 0x8;
          return v.toString(16);
      });
  }
  function fmGoferExists() {
      return (typeof window.fmGofer === 'object' &&
          window.fmGofer !== null &&
          !Array.isArray(window.fmGofer));
  }
  function initializeGofer() {
      if (fmGoferExists())
          return;
      window.fmGofer = {
          promises: {},
          callbackName: callbackName
      };
      window[callbackName] = runCallback;
  }
  function createPromise(resolve, reject, timeout, timeoutMessage) {
      var promise = { resolve: resolve, reject: reject };
      if (timeout !== 0) {
          promise.timeoutID = setTimeout(function () {
              reject(timeoutMessage);
          }, timeout);
      }
      var id = fmGoferUUID();
      window.fmGofer.promises[id] = promise;
      return id;
  }
  function getPromise(id) {
      return window.fmGofer.promises[id];
  }
  function deletePromise(id) {
      return delete window.fmGofer.promises[id];
  }
  function runCallback(id, parameter, failed) {
      try {
          if (failed === '0')
              failed = '';
          var promise = getPromise(id);
          if (typeof promise === 'undefined')
              throw new Error("No promise found for promiseID ".concat(id, "."));
          if (promise.timeoutID)
              clearTimeout(promise.timeoutID);
          if (!!failed)
              promise.reject(parameter);
          else
              promise.resolve(parameter);
          deletePromise(id);
      }
      catch (error) {
          console.error(error);
      }
  }
  function fmOnReady_PerformScriptWithOption(script, param, option) {
      if (typeof window.FileMaker === 'object') {
          window.FileMaker.PerformScriptWithOption(script, param, option);
          return;
      }
      var timeoutID = setTimeout(function () {
          clearInterval(intervalID);
          throw new Error('window.FileMaker not found');
      }, 2000);
      var intervalID = setInterval(function () {
          if (typeof window.FileMaker === 'object') {
              clearTimeout(timeoutID);
              clearInterval(intervalID);
              window.FileMaker.PerformScriptWithOption(script, param, option);
          }
      }, 5);
  }
  function PerformScriptWithOption(script, parameter, option, timeout, timeoutMessage) {
      if (timeout === void 0) { timeout = defaultTimeout; }
      if (timeoutMessage === void 0) { timeoutMessage = defaultTimeoutMessage; }
      if (typeof script !== 'string' || !script)
          throw new Error('script must be a string');
      if (typeof timeout !== 'number')
          throw new Error('timeout must be a number');
      if (typeof timeoutMessage !== 'string')
          throw new Error('timeoutMessage must be a string');
      return new Promise(function (resolve, reject) {
          initializeGofer();
          var promiseID = createPromise(resolve, reject, timeout, timeoutMessage);
          var param = JSON.stringify({ promiseID: promiseID, callbackName: callbackName, parameter: parameter });
          fmOnReady_PerformScriptWithOption(script, param, option);
      });
  }
  function PerformScript(script, parameter, timeout, timeoutMessage) {
      if (parameter === void 0) { parameter = undefined; }
      if (timeout === void 0) { timeout = defaultTimeout; }
      if (timeoutMessage === void 0) { timeoutMessage = defaultTimeoutMessage; }
      var option = undefined;
      return PerformScriptWithOption(script, parameter, option, timeout, timeoutMessage);
  }
  var FMGofer = { PerformScript: PerformScript, PerformScriptWithOption: PerformScriptWithOption };

  exports.PerformScript = PerformScript;
  exports.PerformScriptWithOption = PerformScriptWithOption;
  exports["default"] = FMGofer;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
