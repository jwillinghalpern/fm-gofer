'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * run filemaker scripts and get responses from them
 *
 * @export
 * @class FM
 */
var FMPromise = function () {
  function FMPromise() {
    _classCallCheck(this, FMPromise);

    this.callbacks = [];
  }

  /**
   * stores a callback promise and returns a callback id.
   * You can resolve or reject the promise using runCallback()
   *
   * @param {function} resolve
   * @param {function} reject
   * @param {integer} timeout time in ms. 0 will wait indefinitely.
   * @param {string} timeoutMessage custom timeout message
   * @returns {number} the callback id
   * @memberof FM
   */


  _createClass(FMPromise, [{
    key: 'createCallback',
    value: function createCallback(resolve, reject, timeout, timeoutMessage) {
      var callback = { resolve: resolve, reject: reject };
      if (timeout !== 0) {
        callback.timeoutID = setTimeout(function () {
          reject(timeoutMessage || 'The FM script call timed out');
        }, timeout);
      }
      this.callbacks.push(callback);
      return this.callbacks.length - 1;
    }
  }, {
    key: 'deleteCallback',
    value: function deleteCallback(id) {
      this.callbacks[parseInt(id)] = null;
    }
  }, {
    key: 'getCallback',
    value: function getCallback(id) {
      return this.callbacks[parseInt(id)];
    }

    /**
     * Call to resolve a saved callback promise.
     *
     * @param {number} id callback id
     * @param {string} [resolveOrReject='resolve'] 'resolve' or 'reject'
     * @param {string} data any data you wish to return to the webapp. NOTE, FM passes all function params as text, so if you return JSON, be sure to JSON.parse() it.
     * @memberof FM
     */

  }, {
    key: 'runCallback',
    value: function runCallback(id) {
      var resolveOrReject = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'resolve';
      var data = arguments[2];

      try {
        var callback = this.getCallback(id);
        if (callback.timeoutID) clearTimeout(callback.timeoutID);
        if (resolveOrReject.toLowerCase() === 'reject') callback.reject(data);else callback.resolve(data);
        this.deleteCallback(id);
      } catch (error) {
        console.error(error);
        alert(error);
      }
    }

    /**
     * Perform a FileMaker Script with option. FM can return a result by resolving or rejecting
     *
     * @param {string} script name of script
     * @param {object} [param={}] object to pass to FileMaker
     * @param {number} [option=0] FM script option between 0 and 5
     * @param {number} [timeout=1000] timeout in ms. 0 will wait indefinitely.
     * @param {string} timeoutMessage custom message if the call times out.
     * @returns a promise that FileMaker can resolve or reject
     * @memberof FM
     */

  }, {
    key: 'performScriptWithOption',
    value: function performScriptWithOption(script) {
      var param = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var option = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

      var _this = this;

      var timeout = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1000;
      var timeoutMessage = arguments[4];

      return new Promise(function (resolve, reject) {
        param.callbackID = _this.createCallback(resolve, reject, timeout, timeoutMessage);
        // I stole this little chunk of code from https://github.com/stephancasas/onfmready.js/blob/b2cfeca40553b407a8c07f6eedf5dabcc1c48148/onfmready.js#L9
        // It waits for the FileMaker object to appear on the window before attempting to use it.
        var interval = setInterval(function () {
          if ((typeof FileMaker === 'undefined' ? 'undefined' : _typeof(FileMaker)) === 'object') {
            clearInterval(interval);
            window.FileMaker.PerformScriptWithOption(script, JSON.stringify(param), option);
          }
        }, 5);
      });
    }

    /**
     * Perform a FileMaker Script. FM can return a result by resolving or rejecting
     *
     * @param {string} script name of script
     * @param {object} [param={}] object to pass to FileMaker
     * @param {number} [timeout=1000] timeout in ms. 0 will wait indefinitely.
     * @param {string} timeoutMessage custom message if the call times out.
     * @returns a promise that FileMaker can resolve or reject
     * @memberof FM
     */

  }, {
    key: 'performScript',
    value: function performScript(script, param, timeout, timeoutMessage) {
      return this.performScriptWithOption(script, param, null, timeout, timeoutMessage);
    }
  }]);

  return FMPromise;
}();

exports.default = FMPromise;