import { assert } from 'chai';
import { PerformScript, PerformScriptWithOption } from '../src/index';
import { __get__, __set__ } from '../src/index';

// I'm using babel-plugin-rewire, which automatically adds a default export
// to FMGofer. The default export contains the rewire methods like __get__

// Mock the window. jsdom-global works great but is slow. This is sufficient:
global.window = {};

const reset = () => delete window.fmGofer;

describe('fmGoferExists', () => {
  const fmGoferExists = __get__('fmGoferExists');
  it('should return true if fmGofer is a non-null object', () => {
    window.fmGofer = {};
    assert.isTrue(fmGoferExists());
  });
  it('should return false if fmGofer is not an object', () => {
    window.fmGofer = 'abc';
    assert.isFalse(fmGoferExists(), 'string');
    window.fmGofer = 123;
    assert.isFalse(fmGoferExists(), 'number');
    window.fmGofer = [1, 2, 3];
    assert.isFalse(fmGoferExists(), 'array');
    window.fmGofer = true;
    assert.isFalse(fmGoferExists(), 'boolean');
    window.fmGofer = null;
    assert.isFalse(fmGoferExists());
  });
});

describe('fmGoferUUID', () => {
  const fmGoferUUID = __get__('fmGoferUUID');
  it('should return a string', () => {
    assert.isString(fmGoferUUID(), 'error getting fmGoferUUID');
  });
  it('should only contain letters and numbers', () => {
    const id = fmGoferUUID();
    assert.match(id, /^[a-z0-9]+$/i);
  });
  it('Check if it returns something unique-ish each time?');
});

describe('getCallbackName', () => {
  const getCallbackName = __get__('getCallbackName');
  const fmGoferExists_original = __get__('fmGoferExists');
  it('should return null if fmGofer does not exist', () => {
    __set__('fmGoferExists', () => false);
    assert.isNull(getCallbackName(), 'getCallbackName() should be null');
    __set__('fmGoferExists', fmGoferExists_original);
  });

  it('should return name if fmGofer exists', () => {
    window.fmGofer = { callbackName: 'abcdefghijklmnop' };
    __set__('fmGoferExists', () => true);
    assert.strictEqual(getCallbackName(), window.fmGofer.callbackName);
    __set__('fmGoferExists', fmGoferExists_original);
  });
  it('should return undefined if window.fmGofer exists but not callbackName', () => {
    window.fmGofer = {};
    assert.isUndefined(getCallbackName(), 'should be undefined');
  });
});

describe('initializeGofer', () => {
  const initializeGofer = __get__('initializeGofer');
  reset();
  if (window.fmGofer) throw new Error('window.fmGofer should not exist');
  it('should create fmGofer on the window', () => {
    initializeGofer();
    assert.isObject(window.fmGofer, 'should be object');
  });
  it('should return undefined', () => {
    reset();
    assert.isUndefined(initializeGofer(), 'Error checking undefined');
  });
  it('window.fmGofer should be well-formed', () => {
    reset();
    initializeGofer();
    const requiredKeys = ['promises', 'callbackName'];
    assert.hasAllKeys(window.fmGofer, requiredKeys);
  });
});

describe('createPromise', () => {
  const createPromise = __get__('createPromise');
  window.fmGofer = { promises: {}, callbackName: null };
  const fn = () => {};
  it('should return a string id', () => {
    assert.isString(createPromise(fn, fn), 'createPromise error');
  });
  it('should store an object in promises with the key returned', () => {
    const id = createPromise(fn, fn);
    assert.isObject(window.fmGofer.promises[id], 'get promise by id');
  });
  it('object should have resolve, reject, timeoutID keys', () => {
    const id = createPromise(fn, fn);
    const keys = ['resolve', 'reject', 'timeoutID'];
    assert.hasAllKeys(window.fmGofer.promises[id], keys, 'get keys');
  });
  it('should not have a timeoutID if you pass zero as timeout', () => {
    const id = createPromise(fn, fn, 0);
    assert.doesNotHaveAllKeys(window.fmGofer.promises[id], ['timeoutID']);
  });
  it('should return an fmGoferUUID', () => {
    const fmGoferUUID_new = () => 'this is a mock uuid';
    // save the original function so we can un-mock it later
    const fmGoferUUID_original = __get__('fmGoferUUID');
    __set__('fmGoferUUID', fmGoferUUID_new);
    assert.strictEqual(createPromise(fn, fn), fmGoferUUID_new());
    __set__('fmGoferUUID', fmGoferUUID_original);
  }); // mock fmGoferUUID to return a string and see if it calls that and returns it.
  it('should call reject if timeout is surpassed');
  // it('should return an integer callback id', () => {
  //   const prom = new Promise((resolve, reject) => {
  //     const promiseID = FMGofer.createPromise(resolve, reject, 0);
  //     assert.isNumber(promiseID, 'should be number');
  //     assert.strictEqual(promiseID, parseInt(promiseID), 'should be integer');
  //     resolve();
  //   });
  // });
});

describe('getPromise', () => {
  const getPromise = __get__('getPromise');
  it('should get a stored promise at window.fmGofer.promises[id]', () => {
    window.fmGofer = { promises: { 12345: 'abcde' } };
    assert.strictEqual(getPromise('12345'), 'abcde');
  });
});
describe('deletePromise', () => {
  const deletePromise = __get__('deletePromise');
  it('should delete a promise stored at window.fmGofer.promise[id]', () => {
    window.fmGofer = { promises: { 12345: 'abcde' } };
    deletePromise(12345);
    assert.isUndefined(window.fmGofer.promises[12345]);
  });
  it('should return true', () => {
    assert.isTrue(deletePromise(12345));
  });
});

describe('setCallbackName', () => {
  const setCallbackName = __get__('setCallbackName');
  it('should change the name of the stored callback', () => {
    const originalCallbackName = 'originalCallbackName';
    window.fmGofer = { callbackName: 'originalCallbackName' };
    setCallbackName('newCallbackname');
    assert.notStrictEqual(window.fmGofer.callbackName, originalCallbackName);
  });
  it('should set a default callbackName', () => {
    window.fmGofer = {};
    setCallbackName();
    assert.isString(window.fmGofer.callbackName);
    assert.isNotNull(window.fmGofer.callbackName);
    assert.notStrictEqual(window.fmGofer.callbackName, '');
  });
  it('should throw error if param not string', () => {
    assert.throws(() => setCallbackName(123), Error);
    assert.throws(() => setCallbackName({}), Error);
    assert.throws(() => setCallbackName([]), Error);
    assert.throws(() => setCallbackName(true), Error);
    assert.throws(() => setCallbackName(null), Error);
  });
  it('should throw error for empty callbackName string', () => {
    assert.throws(() => setCallbackName(''), Error);
  });
  it('should initialize fmGofer if !fmGoferExists()', () => {
    const fmGoferExists_original = __get__('fmGoferExists');
    const initializeGofer_original = __get__('initializeGofer');
    __set__('fmGoferExists', () => false);
    __set__('initializeGofer', () => (window.fmGofer = {}));
    delete window.fmGofer;
    setCallbackName();
    assert.isObject(window.fmGofer);
    __set__('fmGoferExists', fmGoferExists_original);
    __set__('initializeGofer', initializeGofer_original);
  });
});

describe('runCallback', () => {
  const runCallback = __get__('runCallback');
  it('should transform failed from "0" to false');
  it('shoud call getPromise()');
  it(
    'should throw if getPromise() throws. TODO: currently it shows an alert (should we mock alert?)'
  );
  it('should clear any timeoutID');
  it('should call promise.reject if failed is truthy');
  it('should call promise.resolve if failed is falsey');
  it('should call deletePromise');
});

// I disabled these because the setInterval never resolves because FileMaker
// never appears on the window. I'm not sure how to test this yet.
describe('PerformScript', () => {
  const scriptName = 'My Script';
  const PerformScriptWithOption_original = __get__('PerformScriptWithOption');
  const mockPSWO = () =>
    __set__(
      'PerformScriptWithOption',
      (script, parameter, option, timeout, timeoutMessage) => ({
        script,
        parameter,
        option,
        timeout,
        timeoutMessage,
      })
    );
  const unmockPSWO = () =>
    __set__('PerformScriptWithOption', PerformScriptWithOption_original);

  it('should set default params', () => {
    mockPSWO();
    const res = PerformScript(scriptName);
    const keys = ['script', 'parameter', 'option', 'timeout', 'timeoutMessage'];
    assert.hasAllKeys(res, keys);
    assert.strictEqual(res.script, scriptName);
    assert.isNull(res.parameter);
    assert.isUndefined(res.option);
    assert.strictEqual(res.timeout, 3000);
    assert.isString(res.timeoutMessage);
    unmockPSWO();
  });
  it('should pass params to PerformScriptWithOption', () => {
    mockPSWO();
    const res = PerformScript(scriptName, 'my param', 2468, 'my message');
    const keys = ['script', 'parameter', 'option', 'timeout', 'timeoutMessage'];
    assert.hasAllKeys(res, keys);
    assert.strictEqual(res.script, scriptName);
    assert.strictEqual(res.parameter, 'my param');
    assert.isUndefined(res.option);
    assert.strictEqual(res.timeout, 2468);
    assert.strictEqual(res.timeoutMessage, 'my message');
    unmockPSWO();
  });
  it('TODO: Empty script name. Throw error?');
});

describe('PerformScriptWithOption', () => {});
