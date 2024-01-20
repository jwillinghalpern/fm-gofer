const defaultTimeout = 15000;
const defaultTimeoutMessage = 'The FM script call timed out';
const callbackName = 'fmGoferCallbackD7738642C91848E08720EAC24EDDA483';

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
 * the promise will be rejected automatically if timeout exceeded
 *
 * @param {function} resolve
 * @param {function} reject
 * @param {number} timeout time in ms. 0 will wait indefinitely.
 * @param {string} timeoutMessage custom timeout message
 * @returns {number} the promise id
 * @private
 */
function storePromise(
  resolve: Function,
  reject: Function,
  timeout: number,
  timeoutMessage: string
) {
  const promiseID = fmGoferUUID();
  const promise: GoferPromise = { resolve, reject };
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

function getPromise(id: string) {
  return window.fmGofer.promises[id];
}
function deletePromise(id: string) {
  const promise = window.fmGofer?.promises?.[id];
  if (promise) {
    if (promise.timeoutID) clearTimeout(promise.timeoutID);
    if (promise.fmOnReadyIntervalID) clearInterval(promise.fmOnReadyIntervalID);
  }
  // const { timeoutID, fmOnReadyIntervalID } = window.fmGofer?.promises?.[id];
  return delete window.fmGofer.promises[id];
}

/**
 * Resolve or reject a saved callback promise.
 *
 * @param {string} promiseID promise id
 * @param {string} [result=undefined] any parameter you wish to return to the webapp. NOTE, FM passes all function params as text, so if you return JSON, be sure to JSON.parse() it.
 * @param {string} [isError=undefined] A truthy or falsey string. '0' string is treated as falsey. Pass in a truthy string to reject the promise.
 * @private
 */
function runCallback(promiseID: string, result?: string, isError?: IsError) {
  try {
    // FM passes params as strings. JS treats '0' as truthy, but we want it to be falsey
    if (isError === '0') isError = '';
    const promise = getPromise(promiseID);
    if (typeof promise === 'undefined')
      throw new Error(`No promise found for promiseID ${promiseID}.`);
    if (promise.timeoutID) clearTimeout(promise.timeoutID);
    if (!!isError) promise.reject(result);
    else promise.resolve(result);
    deletePromise(promiseID);
  } catch (error) {
    console.error(error);
  }
}

function fmOnReady_PerformScriptWithOption(
  script: string,
  param?: any,
  option?: ScriptOption
) {
  let intervalID: ReturnType<typeof setInterval>;
  const promise = new Promise<void>((resolve, reject) => {
    // check if window.FileMaker already exists
    if (typeof window.FileMaker === 'object') {
      window.FileMaker.PerformScriptWithOption(script, param, option);
      return;
    }
    // else, wait for FileMaker to appear
    const intervalMs = 5;
    const maxWaitMs = 2000;
    let totalWaited = 0;
    intervalID = setInterval(() => {
      totalWaited += intervalMs;
      if (totalWaited > maxWaitMs) {
        clearInterval(intervalID);
        reject(`window.FileMaker not found within ${maxWaitMs} ms`);
      }
      if (typeof window.FileMaker === 'object') {
        clearInterval(intervalID);
        window.FileMaker.PerformScriptWithOption(script, param, option);
        resolve();
      }
    }, intervalMs);
  });
  return {
    promise: promise,
    intervalID: intervalID,
  };
}

/**
 * Extend Promise to add a json() method
 *
 * @class MyPromise
 * @extends {Promise<string>}
 */
class FMGPromise extends Promise<string> {
  async json(): Promise<any> {
    const text = await this;
    return JSON.parse(text);
  }
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
): FMGPromise {
  if (typeof script !== 'string' || !script)
    throw new Error('script must be a string');
  if (typeof timeout !== 'number') throw new Error('timeout must be a number');
  if (typeof timeoutMessage !== 'string')
    throw new Error('timeoutMessage must be a string');

  return new FMGPromise(async (resolve, reject) => {
    initializeGofer();
    // store resolve and reject for calling outside this scope
    const promiseID = storePromise(resolve, reject, timeout, timeoutMessage);
    const paramObj: GoferParam = {
      promiseID,
      callbackName,
      parameter,
    };
    const param = JSON.stringify(paramObj);
    // try performing FM script.
    try {
      const { promise, intervalID } = fmOnReady_PerformScriptWithOption(
        script,
        param,
        option
      );
      // store the interval id in the gofer promise so it can clear the interval
      // if the custom timeout is exceeded
      window.fmGofer.promises[promiseID].fmOnReadyIntervalID = intervalID;
      await promise;
    } catch (error) {
      deletePromise(promiseID);
      reject(error);
    }
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
): FMGPromise {
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
  fmOnReadyIntervalID?: ReturnType<typeof setTimeout>;
}

export interface GoferParam {
  callbackName: typeof callbackName;
  promiseID: string;
  parameter: any;
}

type IsError = '1' | '0' | '' | boolean;
export type GoferCallback = (
  promiseID: string,
  result?: string, // enforce string to emulate FM's behavior this will ensure that you remember to use JSON.parse() in any code that uses FMGofer.PerformScript*
  isError?: IsError // even though fm can only return a string or undefined, I'm allowing boolean for convenience when using this library with fm-mock. It's much easier to pass true or false to simulate errors than '1' or '0'
) => void;

declare global {
  interface Window {
    [callbackName]: GoferCallback;
    FileMaker: {
      PerformScript: (scriptName: string, parameter?: string) => void;
      PerformScriptWithOption: (
        scriptName: string,
        parameter?: string,
        option?: ScriptOption
      ) => void;
    };
    // https://flutterq.com/no-index-signature-with-a-parameter-of-type-string-was-found-on-type/
    fmGofer: {
      promises: {
        [promiseID: string]: GoferPromise;
      };
      callbackName: string;
    };
  }
}

const FMGofer = { PerformScript, PerformScriptWithOption };
export { FMGofer as default };
