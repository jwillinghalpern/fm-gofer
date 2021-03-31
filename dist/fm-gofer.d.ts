/**
 * Run filemaker scripts and get responses from them
 */
declare class FM {
    /**
     * Perform a FileMaker Script with option. FM can return a result by resolving or rejecting
     * @param script - name of script
     * @param [data = null] - data you wish to send to fm. It will be nested in the `data` property of the script parameter
     * @param [option = 0] - FM script option between 0 and 5
     * @param [timeout = 1000] - timeout in ms. 0 will wait indefinitely.
     * @param [timeoutMessage = 'The FM script call timed out'] - custom message if the call times out.
     * @returns a promise that FileMaker can resolve or reject
     */
    static FMGofer#performScriptWithOption(script: string, data?: any, option?: number, timeout?: number, timeoutMessage?: string): any;
    /**
     * Perform a FileMaker Script. FM can return a result by resolving or rejecting
     * @param script - name of script
     * @param data - you wish to send to fm. It will be nested in the `data` property of the script parameter
     * @param [timeout = 1000] - timeout in ms. 0 will wait indefinitely.
     * @param [timeoutMessage = 'The FM script call timed out'] - custom message if the call times out.
     * @returns a promise that FileMaker can resolve or reject
     */
    static FMGofer#performScript(script: string, data: any, timeout?: number, timeoutMessage?: string): any;
}

