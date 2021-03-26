'use strict';

/**
 * Run filemaker scripts and get responses from them
 *
 * @export
 * @class FM
 */
class FMPromise {
  constructor() {
    this.callbacks = {};
    this.nextID = 0;
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
  createCallback(resolve, reject, timeout, timeoutMessage) {
    const callback = { resolve, reject };
    if (timeout !== 0) {
      callback.timeoutID = setTimeout(() => {
        reject(timeoutMessage || 'The FM script call timed out');
      }, timeout);
    }
    const id = this.nextID;
    this.callbacks[id] = callback;
    this.nextID++;
    return id;
  }

  deleteCallback(id) {
    delete this.callbacks[id];
  }

  getCallback(id) {
    return this.callbacks[id];
  }

  /**
   * Call to resolve a saved callback promise.
   *
   * @param {number} id callback id
   * @param {string} [resolveOrReject='resolve'] 'resolve' or 'reject'
   * @param {string} data any data you wish to return to the webapp. NOTE, FM passes all function params as text, so if you return JSON, be sure to JSON.parse() it.
   * @memberof FM
   */
  runCallback(id, resolveOrReject = 'resolve', data) {
    try {
      const callback = this.getCallback(id);
      if (callback.timeoutID) clearTimeout(callback.timeoutID);
      if (resolveOrReject.toLowerCase() === 'reject') callback.reject(data);
      else callback.resolve(data);
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
   * @param {any} [data=null] data you wish to send to fm. It will be nested in the `data` property of the script parameter
   * @param {number} [option=0] FM script option between 0 and 5
   * @param {number} [timeout=1000] timeout in ms. 0 will wait indefinitely.
   * @param {string} timeoutMessage custom message if the call times out.
   * @returns a promise that FileMaker can resolve or reject
   * @memberof FM
   */
  performScriptWithOption(
    script,
    data = null,
    option = 0,
    timeout = 1000,
    timeoutMessage
  ) {
    return new Promise((resolve, reject) => {
      const callbackID = this.createCallback(
        resolve,
        reject,
        timeout,
        timeoutMessage
      );
      const scriptParam = JSON.stringify({ callbackID, data });
      // I stole this little chunk of code from https://github.com/stephancasas/onfmready.js/blob/b2cfeca40553b407a8c07f6eedf5dabcc1c48148/onfmready.js#L9
      // It waits for the FileMaker object to appear on the window before attempting to use it.
      const interval = setInterval(() => {
        if (typeof FileMaker === 'object') {
          clearInterval(interval);
          window.FileMaker.PerformScriptWithOption(script, scriptParam, option);
        }
      }, 5);
    });
  }

  /**
   * Perform a FileMaker Script. FM can return a result by resolving or rejecting
   *
   * @param {string} script name of script
   * @param {any} data you wish to send to fm. It will be nested in the `data` property of the script parameter
   * @param {number} [timeout=1000] timeout in ms. 0 will wait indefinitely.
   * @param {string} timeoutMessage custom message if the call times out.
   * @returns a promise that FileMaker can resolve or reject
   * @memberof FM
   */
  performScript(script, data, timeout, timeoutMessage) {
    return this.performScriptWithOption(
      script,
      data,
      null,
      timeout,
      timeoutMessage
    );
  }
}

module.exports.FMPromise = FMPromise;
