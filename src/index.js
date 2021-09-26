/**
 * generates a uuid without hyphens. It uses Math.random, so it's not *that* unique.
 * from https://stackoverflow.com/a/2117523
 * @private
 *
 * @returns {string} a uuid without hyphens
 */
const fmGoferUUID = () => {
  const template = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx';
  return template.replace(/[xy]/g, (c) => {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const fmGoferExists = () => {
  return (
    typeof window.fmGofer === 'object' &&
    window.fmGofer !== null &&
    !Array.isArray(window.fmGofer)
  );
};

const getCallbackName = () => {
  return fmGoferExists() ? window.fmGofer.callbackName : null;
};

const initializeGofer = () => {
  window.fmGofer = {
    promises: {},
    callbackName: '',
  };
};

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
 */
const createPromise = (resolve, reject, timeout, timeoutMessage) => {
  const promise = { resolve, reject };
  if (timeout !== 0) {
    promise.timeoutID = setTimeout(() => {
      reject(timeoutMessage);
    }, timeout);
  }
  const id = fmGoferUUID();
  window.fmGofer.promises[id] = promise;
  return id;
};

const getPromise = (id) => window.fmGofer.promises[id];
const deletePromise = (id) => delete window.fmGofer.promises[id];

/**
 * Resolve or reject a saved callback promise.
 *
 * @param {string} id promise id
 * @param {string} [parameter=undefined] any parameter you wish to return to the webapp. NOTE, FM passes all function params as text, so if you return JSON, be sure to JSON.parse() it.
 * @param {string} [failed=''] A truthy or falsey string. '0' string is treated as falsey. Pass in a truthy string to reject the promise.
 * @private
 */
const runCallback = (id, parameter = undefined, failed = '') => {
  try {
    if (failed === '0') failed = '';
    const promise = getPromise(id);
    if (typeof promise === 'undefined')
      throw new Error(`No promise found for promiseID ${id}.`);
    if (promise.timeoutID) clearTimeout(promise.timeoutID);
    if (!!failed) promise.reject(parameter);
    else promise.resolve(parameter);
    deletePromise(id);
  } catch (error) {
    console.error(error);
    alert(error);
  }
};

/**
 * set the function name that FM will call to resolve/reject the promise
 *
 * @param {string} [callbackName='fmGoferD7738642C91848E08720EAC24EDDA483']
 * @private
 */
const setCallbackName = (
  callbackName = 'fmGoferD7738642C91848E08720EAC24EDDA483'
) => {
  if (typeof callbackName !== 'string' || !callbackName)
    throw new Error('callbackName must be a non-empty string');
  if (!fmGoferExists()) initializeGofer();
  window[callbackName] = runCallback;
  window.fmGofer.callbackName = callbackName;
};

const fmOnReady_PerformScriptWithOption = (script, param, option) => {
  // first try calling synchronously
  if (typeof window.FileMaker === 'object') {
    window.FileMaker.PerformScriptWithOption(script, param, option);
    return;
  }
  // then wait for FileMaker to appear before calling
  let timeoutID = setTimeout(() => {
    clearInterval(intervalID);
    throw new Error('window.FileMaker not found');
  }, 2000);
  let intervalID = setInterval(() => {
    if (typeof window.FileMaker === 'object') {
      clearTimeout(timeoutID);
      clearInterval(intervalID);
      window.FileMaker.PerformScriptWithOption(script, param, option);
    }
  }, 5);
};

const defaultTimeout = 3000;
const defaultTimeoutMessage = 'The FM script call timed out';

/**
 * Perform a FileMaker Script with option. FM can return a result by resolving or rejecting
 * @function
 *
 * @param {string} script name of script
 * @param {any} [parameter=undefined] parameter param you wish to send to fm. It will be nested in the `parameter` property of the script parameter
 * @param {number} [option=0] FM script option between 0 and 5
 * @param {number} [timeout=3000] timeout in ms. 0 will wait indefinitely.
 * @param {string} [timeoutMessage='The FM script call timed out'] custom message if the call times out.
 * @returns {Promise<string>} a promise that FileMaker can resolve or reject
 */
export const PerformScriptWithOption = (
  script,
  parameter = undefined,
  option = undefined,
  timeout = defaultTimeout,
  timeoutMessage = defaultTimeoutMessage
) => {
  if (typeof script !== 'string' || !script)
    throw new Error('script must be a string');
  if (typeof timeout !== 'number') throw new Error('timeout must be a number');
  if (typeof timeoutMessage !== 'string')
    throw new Error('timeoutMessage must be a string');
  return new Promise((resolve, reject) => {
    if (!fmGoferExists()) initializeGofer();
    if (!getCallbackName()) setCallbackName();

    const promiseID = createPromise(resolve, reject, timeout, timeoutMessage);
    const callbackName = getCallbackName();
    const param = JSON.stringify({ promiseID, callbackName, parameter });
    fmOnReady_PerformScriptWithOption(script, param, option);
  });
};

/**
 * Perform a FileMaker Script. FM can return a result by resolving or rejecting
 * @function
 *
 * @param {string} script name of script
 * @param {any} [parameter=undefined] you wish to send to fm. It will be nested in the `parameter` property of the script parameter
 * @param {number} [timeout=3000] timeout in ms. 0 will wait indefinitely.
 * @param {string} [timeoutMessage='The FM script call timed out'] custom message if the call times out.
 * @returns {Promise<string>} a promise that FileMaker can resolve or reject
 */
export const PerformScript = (
  script,
  parameter = undefined,
  timeout = defaultTimeout,
  timeoutMessage = defaultTimeoutMessage
) => {
  const option = undefined;
  return PerformScriptWithOption(
    script,
    parameter,
    option,
    timeout,
    timeoutMessage
  );
};

const FMGofer = { PerformScript, PerformScriptWithOption };
export { FMGofer as default };
