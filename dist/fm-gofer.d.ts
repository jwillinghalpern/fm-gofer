declare const callbackName = "fmGoferCallbackD7738642C91848E08720EAC24EDDA483";
declare type JSONValue = string | number | boolean | null | JSONObject | JSONArray;
interface JSONObject {
    [key: string]: JSONValue;
}
interface JSONArray extends Array<JSONValue> {
}
/**
 * Perform a FileMaker Script with option. FM can return a result by resolving or rejecting
 * @function
 *
 * @param {string} script name of script
 * @param {JSONValue} [parameter=undefined] parameter you wish to send to fm. It will be nested in the `parameter` property of the script parameter
 * @param {ScriptOption} option script option between 0 and 5
 * @param {number} [timeout=15000] timeout in ms. 0 will wait indefinitely.
 * @param {string} [timeoutMessage='The FM script call timed out'] custom message if the call times out.
 * @returns {Promise<string>} a promise that FileMaker can resolve or reject
 */
export declare function PerformScriptWithOption(script: string, parameter?: JSONValue, option?: ScriptOption, timeout?: number, timeoutMessage?: string): Promise<string>;
/**
 * Perform a FileMaker Script. FM can return a result by resolving or rejecting
 * @function
 *
 * @param {string} script name of script
 * @param {JSONValue} [parameter=undefined] parameter you wish to send to fm. It will be nested in the `parameter` property of the script parameter
 * @param {number} [timeout=15000] timeout in ms. 0 will wait indefinitely.
 * @param {string} [timeoutMessage='The FM script call timed out'] custom message if the call times out.
 * @returns {Promise<string>} a promise that FileMaker can resolve or reject
 */
export declare function PerformScript(script: string, parameter?: JSONValue, timeout?: number, timeoutMessage?: string): Promise<string>;
export declare const Option: {
    readonly Default: 0;
    readonly Continue: 0;
    readonly Halt: 1;
    readonly Exit: 2;
    readonly Resume: 3;
    readonly Pause: 4;
    readonly SuspendAndResume: 5;
};
declare type Option = typeof Option[keyof typeof Option];
declare type ScriptOption = Option | '0' | '1' | '2' | '3' | '4' | '5';
interface GoferPromise {
    resolve: Function;
    reject: Function;
    timeoutID?: ReturnType<typeof setTimeout>;
    fmOnReadyIntervalID?: ReturnType<typeof setTimeout>;
}
export interface GoferParam {
    callbackName: typeof callbackName;
    promiseID: string;
    parameter: JSONValue;
}
declare type IsError = '1' | '0' | '' | boolean;
export declare type GoferCallback = (promiseID: string, result?: string, // enforce string to emulate FM's behavior this will ensure that you remember to use JSON.parse() in any code that uses FMGofer.PerformScript*
isError?: IsError) => void;
declare global {
    interface Window {
        [callbackName]: GoferCallback;
        FileMaker: {
            PerformScript: (scriptName: string, parameter?: string) => void;
            PerformScriptWithOption: (scriptName: string, parameter?: string, option?: ScriptOption) => void;
        };
        fmGofer: {
            promises: {
                [promiseID: string]: GoferPromise;
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
