(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.FMGofer = {}));
}(this, (function (exports) { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  var fmGoferUUID = function fmGoferUUID() {
    var template = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx';
    return template.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0,
          v = c == 'x' ? r : r & 0x3 | 0x8;
      return v.toString(16);
    });
  };
  var fmGoferExists = function fmGoferExists() {
    return _typeof(window.fmGofer) === 'object' && window.fmGofer !== null && !Array.isArray(window.fmGofer);
  };
  var getCallbackName = function getCallbackName() {
    return fmGoferExists() ? window.fmGofer.callbackName : null;
  };
  var initializeGofer = function initializeGofer() {
    window.fmGofer = {
      promises: {},
      callbackName: null
    };
  };
  var createPromise = function createPromise(resolve, reject, timeout, timeoutMessage) {
    var promise = {
      resolve: resolve,
      reject: reject
    };
    if (timeout !== 0) {
      promise.timeoutID = setTimeout(function () {
        reject(timeoutMessage);
      }, timeout);
    }
    var id = fmGoferUUID();
    window.fmGofer.promises[id] = promise;
    return id;
  };
  var getPromise = function getPromise(id) {
    return window.fmGofer.promises[id];
  };
  var deletePromise = function deletePromise(id) {
    return delete window.fmGofer.promises[id];
  };
  var runCallback = function runCallback(id) {
    var parameter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var failed = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    try {
      if (failed === '0') failed = false;
      var promise = getPromise(id);
      if (typeof promise === 'undefined') throw new Error("No promise found for promiseID ".concat(id, "."));
      if (promise.timeoutID) clearTimeout(promise.timeoutID);
      if (failed) promise.reject(parameter);else promise.resolve(parameter);
      deletePromise(id);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  };
  var setCallbackName = function setCallbackName() {
    var callbackName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'fmGoferD7738642C91848E08720EAC24EDDA483';
    if (typeof callbackName !== 'string' || !callbackName) throw new Error('callbackName must be a non-empty string');
    if (!fmGoferExists()) initializeGofer();
    window[callbackName] = runCallback;
    window.fmGofer.callbackName = callbackName;
  };
  var fmOnReady_PerformScriptWithOption = function fmOnReady_PerformScriptWithOption(script, param, option) {
    if (_typeof(window.FileMaker) === 'object') {
      window.FileMaker.PerformScriptWithOption(script, param, option);
      return;
    }
    var intervalID;
    var timeoutID;
    intervalID = setInterval(function () {
      if (_typeof(window.FileMaker) === 'object') {
        clearTimeout(timeoutID);
        clearInterval(intervalID);
        window.FileMaker.PerformScriptWithOption(script, param, option);
      }
    }, 5);
    timeoutID = setTimeout(function () {
      clearInterval(intervalID);
      throw new Error('window.FileMaker not found');
    }, 2000);
  };
  var defaultTimeout = 3000;
  var defaultTimeoutMessage = 'The FM script call timed out';
  var PerformScriptWithOption = function PerformScriptWithOption(script) {
    var parameter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var option = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var timeout = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : defaultTimeout;
    var timeoutMessage = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : defaultTimeoutMessage;
    if (typeof script !== 'string' || !script) throw new Error('script must be a string');
    if (typeof timeout !== 'number') throw new Error('timeout must be a number');
    if (typeof timeoutMessage !== 'string') throw new Error('timeoutMessage must be a string');
    return new Promise(function (resolve, reject) {
      if (!fmGoferExists()) initializeGofer();
      if (!getCallbackName()) setCallbackName();
      var promiseID = createPromise(resolve, reject, timeout, timeoutMessage);
      var callbackName = getCallbackName();
      var param = JSON.stringify({
        promiseID: promiseID,
        callbackName: callbackName,
        parameter: parameter
      });
      fmOnReady_PerformScriptWithOption(script, param, option);
    });
  };
  var PerformScript = function PerformScript(script) {
    var parameter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var timeout = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultTimeout;
    var timeoutMessage = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : defaultTimeoutMessage;
    var option = undefined;
    return PerformScriptWithOption(script, parameter, option, timeout, timeoutMessage);
  };
  var FMGofer = {
    PerformScript: PerformScript,
    PerformScriptWithOption: PerformScriptWithOption
  };

  exports.PerformScript = PerformScript;
  exports.PerformScriptWithOption = PerformScriptWithOption;
  exports.default = FMGofer;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
