/**
 * Run filemaker scripts and get responses from them
 */
declare class FM {
    /**
     * Resolve or reject a saved callback promise.
     * @param id - promise id
     * @param [resolveOrReject = 'resolve'] - 'resolve' or 'reject'
     * @param [parameter = null] - any parameter you wish to return to the webapp. NOTE, FM passes all function params as text, so if you return JSON, be sure to JSON.parse() it.
     */
    static FMGofer#runCallback(id: number, resolveOrReject?: string, parameter?: string): void;
    /**
     * Perform a FileMaker Script with option. FM can return a result by resolving or rejecting
     * @param script - name of script
     * @param [parameter = null] - parameter you wish to send to fm. It will be nested in the `parameter` property of the script parameter
     * @param [option = 0] - FM script option between 0 and 5
     * @param [timeout = 3000] - timeout in ms. 0 will wait indefinitely.
     * @param [timeoutMessage = 'The FM script call timed out'] - custom message if the call times out.
     * @returns a promise that FileMaker can resolve or reject
     */
    static FMGofer#PerformScriptWithOption(script: string, parameter?: any, option?: number, timeout?: number, timeoutMessage?: string): any;
    /**
     * Perform a FileMaker Script. FM can return a result by resolving or rejecting
     * @param script - name of script
     * @param parameter - you wish to send to fm. It will be nested in the `parameter` property of the script parameter
     * @param [timeout = 3000] - timeout in ms. 0 will wait indefinitely.
     * @param [timeoutMessage = 'The FM script call timed out'] - custom message if the call times out.
     * @returns a promise that FileMaker can resolve or reject
     */
    static FMGofer#PerformScript(script: string, parameter: any, timeout?: number, timeoutMessage?: string): any;
}

