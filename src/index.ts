const defaultTimeout = 15000;
const defaultTimeoutMessage = 'The FM script call timed out';
const callbackName = 'fmGoferD7738642C91848E08720EAC24EDDA483';

/**
 * generates a uuid without hyphens. It uses Math.random, so it's not *that* unique.
 * from https://stackoverflow.com/a/2117523
 *
 */
function fmGoferUUID() {
  const template = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx';
  return template.replace(/[xy]/g, (c) => {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function fmGoferExists() {
  return (
    typeof window.fmGofer === 'object' &&
    window.fmGofer !== null &&
    !Array.isArray(window.fmGofer)
  );
}

function initializeGofer() {
  if (fmGoferExists()) return;
  window.fmGofer = {
    promises: {},
    callbackName: callbackName,
  };
  window[callbackName] = runCallback;
}

/**
 * stores a callback promise and returns a promise id.
 * You can resolve or reject the promise using runCallback()
 *
 * @param {function} resolve
 * @param {function} reject
 * @param {number} timeout time in ms. 0 will wait indefinitely.
 * @param {string} timeoutMessage custom timeout message
 * @returns {number} the promise id
 * @private
 */
function createPromise(
  resolve: Function,
  reject: Function,
  timeout: number,
  timeoutMessage: string
) {
  const promise: GoferPromise = { resolve, reject };
  const id = fmGoferUUID();
  if (timeout !== 0) {
    promise.timeoutID = setTimeout(() => {
      if (window.fmGofer.promises[id].clearIntervalFn)
        window.fmGofer.promises[id].clearIntervalFn();
      reject(timeoutMessage);
    }, timeout);
  }
  window.fmGofer.promises[id] = promise;
  return id;
}

function getPromise(id: string) {
  return window.fmGofer.promises[id];
}
function deletePromise(id: string) {
  return delete window.fmGofer.promises[id];
}

/**
 * Resolve or reject a saved callback promise.
 *
 * @param {string} id promise id
 * @param {string} [parameter=undefined] any parameter you wish to return to the webapp. NOTE, FM passes all function params as text, so if you return JSON, be sure to JSON.parse() it.
 * @param {string} [failed=undefined] A truthy or falsey string. '0' string is treated as falsey. Pass in a truthy string to reject the promise.
 * @private
 */
function runCallback(id: string, parameter?: string, failed?: string) {
  try {
    // FM passes params as strings. JS treats '0' as truthy, but we want it to be falsey
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
  }
}

function fmOnReady_PerformScriptWithOption(
  script: string,
  param?: any,
  option?: ScriptOption
) {
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
  // return a function to allow the caller to stop trying to call FM
  return function () {
    clearTimeout(timeoutID);
    clearInterval(intervalID);
  };
}

/**
 * Perform a FileMaker Script with option. FM can return a result by resolving or rejecting
 * @function
 *
 * @param {string} script name of script
 * @param {any} [parameter=undefined] parameter you wish to send to fm. It will be nested in the `parameter` property of the script parameter
 * @param {ScriptOption} option script option between 0 and 5
 * @param {number} [timeout=15000] timeout in ms. 0 will wait indefinitely.
 * @param {string} [timeoutMessage='The FM script call timed out'] custom message if the call times out.
 * @returns {Promise<string>} a promise that FileMaker can resolve or reject
 */
export function PerformScriptWithOption(
  script: string,
  parameter?: any,
  option?: ScriptOption,
  timeout: number = defaultTimeout,
  timeoutMessage: string = defaultTimeoutMessage
): Promise<string> {
  if (typeof script !== 'string' || !script)
    throw new Error('script must be a string');
  if (typeof timeout !== 'number') throw new Error('timeout must be a number');
  if (typeof timeoutMessage !== 'string')
    throw new Error('timeoutMessage must be a string');
  return new Promise((resolve, reject) => {
    initializeGofer();
    const promiseID = createPromise(resolve, reject, timeout, timeoutMessage);
    const param = JSON.stringify({ promiseID, callbackName, parameter });
    const clearIntervalFn = fmOnReady_PerformScriptWithOption(
      script,
      param,
      option
    );
    if (window.fmGofer.promises?.[promiseID])
      window.fmGofer.promises[promiseID].clearIntervalFn = clearIntervalFn;
  });
}

/**
 * Perform a FileMaker Script. FM can return a result by resolving or rejecting
 * @function
 *
 * @param {string} script name of script
 * @param {any} [parameter=undefined] parameter you wish to send to fm. It will be nested in the `parameter` property of the script parameter
 * @param {number} [timeout=15000] timeout in ms. 0 will wait indefinitely.
 * @param {string} [timeoutMessage='The FM script call timed out'] custom message if the call times out.
 * @returns {Promise<string>} a promise that FileMaker can resolve or reject
 */
export function PerformScript(
  script: string,
  parameter: any = undefined,
  timeout: number = defaultTimeout,
  timeoutMessage: string = defaultTimeoutMessage
): Promise<string> {
  const option = undefined;
  return PerformScriptWithOption(
    script,
    parameter,
    option,
    timeout,
    timeoutMessage
  );
}

type ScriptOption = 0 | 1 | 2 | 3 | 4 | 5 | '0' | '1' | '2' | '3' | '4' | '5';
interface GoferPromise {
  resolve: Function;
  reject: Function;
  timeoutID?: ReturnType<typeof setTimeout>;
  // private function to tell FMGofer to stop attempting to call the FM script
  clearIntervalFn?: Function;
}

declare global {
  interface Window {
    FileMaker: {
      PerformScript: Function;
      PerformScriptWithOption: Function;
    };
    // https://flutterq.com/no-index-signature-with-a-parameter-of-type-string-was-found-on-type/
    fmGofer: {
      promises: {
        [key: string]: GoferPromise;
      };
      callbackName: string;
    };
  }
}

const FMGofer = { PerformScript, PerformScriptWithOption };
export { FMGofer as default };
