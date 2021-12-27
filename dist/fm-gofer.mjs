/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var defaultTimeout = 15000;
var defaultTimeoutMessage = 'The FM script call timed out';
var callbackName = 'fmGoferD7738642C91848E08720EAC24EDDA483';
function fmGoferUUID() {
    var template = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx';
    return template.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0, v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
function fmGoferExists() {
    return (typeof window.fmGofer === 'object' &&
        window.fmGofer !== null &&
        !Array.isArray(window.fmGofer));
}
function initializeGofer() {
    if (fmGoferExists())
        return;
    window.fmGofer = {
        promises: {},
        callbackName: callbackName
    };
    window[callbackName] = runCallback;
}
function storePromise(resolve, reject, timeout, timeoutMessage) {
    var promiseID = fmGoferUUID();
    var promise = { resolve: resolve, reject: reject };
    if (timeout !== 0) {
        promise.timeoutID = setTimeout(function () {
            clearInterval(promise.fmOnReadyIntervalID);
            deletePromise(promiseID);
            reject(timeoutMessage);
        }, timeout);
    }
    window.fmGofer.promises[promiseID] = promise;
    return promiseID;
}
function getPromise(id) {
    return window.fmGofer.promises[id];
}
function deletePromise(id) {
    var _a, _b;
    var promise = (_b = (_a = window.fmGofer) === null || _a === void 0 ? void 0 : _a.promises) === null || _b === void 0 ? void 0 : _b[id];
    if (promise) {
        clearTimeout(promise.timeoutID);
        clearInterval(promise.fmOnReadyIntervalID);
    }
    return delete window.fmGofer.promises[id];
}
function runCallback(id, parameter, failed) {
    try {
        if (failed === '0')
            failed = '';
        var promise = getPromise(id);
        if (typeof promise === 'undefined')
            throw new Error("No promise found for promiseID ".concat(id, "."));
        if (promise.timeoutID)
            clearTimeout(promise.timeoutID);
        if (!!failed)
            promise.reject(parameter);
        else
            promise.resolve(parameter);
        deletePromise(id);
    }
    catch (error) {
        console.error(error);
    }
}
function fmOnReady_PerformScriptWithOption(script, param, option) {
    var intervalID;
    var promise = new Promise(function (resolve, reject) {
        if (typeof window.FileMaker === 'object') {
            window.FileMaker.PerformScriptWithOption(script, param, option);
            return;
        }
        var intervalMs = 5;
        var maxWaitMs = 2000;
        var totalWaited = 0;
        intervalID = setInterval(function () {
            totalWaited += intervalMs;
            if (totalWaited > maxWaitMs) {
                clearInterval(intervalID);
                reject("window.FileMaker not found within ".concat(maxWaitMs, " ms"));
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
        intervalID: intervalID
    };
}
function PerformScriptWithOption(script, parameter, option, timeout, timeoutMessage) {
    var _this = this;
    if (timeout === void 0) { timeout = defaultTimeout; }
    if (timeoutMessage === void 0) { timeoutMessage = defaultTimeoutMessage; }
    if (typeof script !== 'string' || !script)
        throw new Error('script must be a string');
    if (typeof timeout !== 'number')
        throw new Error('timeout must be a number');
    if (typeof timeoutMessage !== 'string')
        throw new Error('timeoutMessage must be a string');
    return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
        var promiseID, param, _a, promise, intervalID, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    initializeGofer();
                    promiseID = storePromise(resolve, reject, timeout, timeoutMessage);
                    param = JSON.stringify({ promiseID: promiseID, callbackName: callbackName, parameter: parameter });
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    _a = fmOnReady_PerformScriptWithOption(script, param, option), promise = _a.promise, intervalID = _a.intervalID;
                    window.fmGofer.promises[promiseID].fmOnReadyIntervalID = intervalID;
                    return [4 , promise];
                case 2:
                    _b.sent();
                    return [3 , 4];
                case 3:
                    error_1 = _b.sent();
                    deletePromise(promiseID);
                    reject(error_1);
                    return [3 , 4];
                case 4: return [2 ];
            }
        });
    }); });
}
function PerformScript(script, parameter, timeout, timeoutMessage) {
    if (parameter === void 0) { parameter = undefined; }
    if (timeout === void 0) { timeout = defaultTimeout; }
    if (timeoutMessage === void 0) { timeoutMessage = defaultTimeoutMessage; }
    var option = undefined;
    return PerformScriptWithOption(script, parameter, option, timeout, timeoutMessage);
}
var FMGofer = { PerformScript: PerformScript, PerformScriptWithOption: PerformScriptWithOption };

export { PerformScript, PerformScriptWithOption, FMGofer as default };
