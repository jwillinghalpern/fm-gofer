/**
 * Run filemaker scripts and get responses from them
 */
declare class FM {
    /**
     * stores a callback promise and returns a callback id.
     * You can resolve or reject the promise using runCallback()
     * @param timeout - time in ms. 0 will wait indefinitely.
     * @param timeoutMessage - custom timeout message
     * @returns the callback id
     */
    static FMGofer#createCallback(resolve: (...params: any[]) => any, reject: (...params: any[]) => any, timeout: integer, timeoutMessage: string): number;
    /**
     * Call to resolve a saved callback promise.
     * @param id - callback id
     * @param [resolveOrReject = 'resolve'] - 'resolve' or 'reject'
     * @param data - any data you wish to return to the webapp. NOTE, FM passes all function params as text, so if you return JSON, be sure to JSON.parse() it.
     */
    static FMGofer#runCallback(id: number, resolveOrReject?: string, data: string): void;
    /**
     * Perform a FileMaker Script with option. FM can return a result by resolving or rejecting
     * @param script - name of script
     * @param [data = null] - data you wish to send to fm. It will be nested in the `data` property of the script parameter
     * @param [option = 0] - FM script option between 0 and 5
     * @param [timeout = 1000] - timeout in ms. 0 will wait indefinitely.
     * @param timeoutMessage - custom message if the call times out.
     * @returns a promise that FileMaker can resolve or reject
     */
    static FMGofer#performScriptWithOption(script: string, data?: any, option?: number, timeout?: number, timeoutMessage: string): any;
    /**
     * Perform a FileMaker Script. FM can return a result by resolving or rejecting
     * @param script - name of script
     * @param data - you wish to send to fm. It will be nested in the `data` property of the script parameter
     * @param [timeout = 1000] - timeout in ms. 0 will wait indefinitely.
     * @param timeoutMessage - custom message if the call times out.
     * @returns a promise that FileMaker can resolve or reject
     */
    static FMGofer#performScript(script: string, data: any, timeout?: number, timeoutMessage: string): any;
}

