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
export declare function PerformScriptWithOption(script: string, parameter?: any, option?: ScriptOption, timeout?: number, timeoutMessage?: string): Promise<string>;
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
export declare function PerformScript(script: string, parameter?: any, timeout?: number, timeoutMessage?: string): Promise<string>;
declare type ScriptOption = 0 | 1 | 2 | 3 | 4 | 5 | '0' | '1' | '2' | '3' | '4' | '5';
interface GoferPromise {
    resolve: Function;
    reject: Function;
    timeoutID?: ReturnType<typeof setTimeout>;
    fmOnReadyIntervalID?: ReturnType<typeof setTimeout>;
}
export interface GoferParam {
    callbackName: string;
    promiseID: string;
    parameter: any;
}
declare global {
    interface Window {
        FileMaker: {
            PerformScript: Function;
            PerformScriptWithOption: Function;
        };
        fmGofer: {
            promises: {
                [key: string]: GoferPromise;
            };
            callbackName: string;
        };
    }
}
declare const FMGofer: {
    PerformScript: typeof PerformScript;
    PerformScriptWithOption: typeof PerformScriptWithOption;
};
export { FMGofer as default };
