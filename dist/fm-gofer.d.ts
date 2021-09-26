/**
 * Perform a FileMaker Script with option. FM can return a result by resolving or rejecting
 * @param script - name of script
 * @param [parameter = null] - parameter param you wish to send to fm. It will be nested in the `parameter` property of the script parameter
 * @param [option = 0] - FM script option between 0 and 5
 * @param [timeout = 3000] - timeout in ms. 0 will wait indefinitely.
 * @param [timeoutMessage = 'The FM script call timed out'] - custom message if the call times out.
 * @returns a promise that FileMaker can resolve or reject
 */
export declare function PerformScriptWithOption(script: string, parameter?: any, option?: number, timeout?: number, timeoutMessage?: string): Promise<string>;

/**
 * Perform a FileMaker Script. FM can return a result by resolving or rejecting
 * @param script - name of script
 * @param [parameter = null] - you wish to send to fm. It will be nested in the `parameter` property of the script parameter
 * @param [timeout = 3000] - timeout in ms. 0 will wait indefinitely.
 * @param [timeoutMessage = 'The FM script call timed out'] - custom message if the call times out.
 * @returns a promise that FileMaker can resolve or reject
 */
export declare function PerformScript(script: string, parameter?: any, timeout?: number, timeoutMessage?: string): Promise<string>;

