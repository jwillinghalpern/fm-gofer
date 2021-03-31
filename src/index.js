/**
 * Run filemaker scripts and get responses from them
 *
 * @export
 * @class FM
 */
class FMGofer {
  /**
   * Creates an instance of FMGofer.
   * @memberof FMGofer
   */
  constructor() {
    this.promises = {};
    this.nextID = 0;
    this.callbackName = null;
  }

  /**
   * set the function name that FM will call to resolve/reject the promise
   *
   * @param {string} [callbackName='fmCallback']
   * @memberof FMGofer
   */
  setCallbackName(callbackName = 'fmCallback') {
    if (typeof callbackName !== 'string' || !callbackName)
      throw new Error('callbackName must be a non-empty string');
    window[callbackName] = (promiseID, resolveOrReject, parameter) => {
      this.runCallback(promiseID, resolveOrReject, parameter);
    };
    this.callbackName = callbackName;
  }

  /**
   * stores a callback promise and returns a promise id.
   * You can resolve or reject the promise using runCallback()
   *
   * @param {function} resolve
   * @param {function} reject
   * @param {integer} timeout time in ms. 0 will wait indefinitely.
   * @param {string} timeoutMessage custom timeout message
   * @returns {number} the promise id
   * @private
   * @memberof FM
   */
  createPromise(resolve, reject, timeout, timeoutMessage) {
    const prom = { resolve, reject };
    if (timeout !== 0) {
      prom.timeoutID = setTimeout(() => {
        reject(timeoutMessage);
      }, timeout);
    }
    const id = this.nextID;
    this.promises[id] = prom;
    this.nextID++;
    return id;
  }

  deletePromise(id) {
    delete this.promises[id];
  }

  getPromise(id) {
    return this.promises[id];
  }

  /**
   * Resolve or reject a saved callback promise.
   *
   * @param {number} id promise id
   * @param {string} [resolveOrReject='resolve'] 'resolve' or 'reject'
   * @param {string} [parameter=null] any parameter you wish to return to the webapp. NOTE, FM passes all function params as text, so if you return JSON, be sure to JSON.parse() it.
   * @memberof FM
   */
  runCallback(id, resolveOrReject = 'resolve', parameter = null) {
    try {
      const promise = this.getPromise(id);
      if (promise.timeoutID) clearTimeout(promise.timeoutID);
      if (resolveOrReject.toLowerCase() === 'reject') promise.reject(parameter);
      else promise.resolve(parameter);
      this.deletePromise(id);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  /**
   * Perform a FileMaker Script with option. FM can return a result by resolving or rejecting
   *
   * @param {string} script name of script
   * @param {any} [parameter=null] parameter you wish to send to fm. It will be nested in the `parameter` property of the script parameter
   * @param {number} [option=0] FM script option between 0 and 5
   * @param {number} [timeout=3000] timeout in ms. 0 will wait indefinitely.
   * @param {string} [timeoutMessage='The FM script call timed out'] custom message if the call times out.
   * @returns a promise that FileMaker can resolve or reject
   * @memberof FM
   */
  PerformScriptWithOption(
    script,
    parameter = null,
    option = 0,
    timeout = 3000,
    timeoutMessage = 'The FM script call timed out'
  ) {
    return new Promise((resolve, reject) => {
      const promiseID = this.createPromise(
        resolve,
        reject,
        timeout,
        timeoutMessage
      );
      const param = JSON.stringify({
        promiseID,
        callbackName: this.callbackName,
        parameter,
      });

      let intervalID;
      let timeoutID;
      try {
        intervalID = setInterval(() => {
          if (typeof window.FileMaker === 'object') {
            clearTimeout(timeoutID);
            clearInterval(intervalID);
            window.FileMaker.PerformScriptWithOption(script, param, option);
          }
        }, 5);
        timeoutID = setTimeout(() => {
          clearInterval(intervalID);
          throw new Error('window.FileMaker not found');
        }, 2000);
      } catch (error) {
        clearInterval(intervalID);
        clearTimeout(timeoutID);
        throw error;
      }
    });
  }

  /**
   * Perform a FileMaker Script. FM can return a result by resolving or rejecting
   *
   * @param {string} script name of script
   * @param {any} parameter you wish to send to fm. It will be nested in the `parameter` property of the script parameter
   * @param {number} [timeout=3000] timeout in ms. 0 will wait indefinitely.
   * @param {string} [timeoutMessage='The FM script call timed out'] custom message if the call times out.
   * @returns a promise that FileMaker can resolve or reject
   * @memberof FM
   */
  PerformScript(
    script,
    parameter = null,
    timeout = 3000,
    timeoutMessage = 'The FM script call timed out'
  ) {
    const option = null;
    return this.PerformScriptWithOption(
      script,
      parameter,
      option,
      timeout,
      timeoutMessage
    );
  }
}

export default FMGofer;
