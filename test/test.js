import { assert } from 'chai';
import sinon from 'sinon';
import {
  PerformScript,
  PerformScriptWithOption,
  __get__,
  __set__,
} from '../src/index';
// This uses babel-plugin-rewire, which automatically adds __get__ and __set__

// Mock the window.
global.window = {};

describe('--- UTILS ---', () => {
  describe('fmGoferUUID', () => {
    const fmGoferUUID = __get__('fmGoferUUID');

    it('should return a string', () => {
      assert.isString(fmGoferUUID(), 'error getting fmGoferUUID');
    });

    it('should only contain letters and numbers', () => {
      const id = fmGoferUUID();
      assert.match(id, /^[a-z0-9]+$/i);
    });

    it('should return a unique result each time', () => {
      const ids = [];
      for (let i = 0; i < 20; i++) {
        ids.push(fmGoferUUID());
      }
      const allUnique = new Set(ids).size === ids.length;
      assert.isTrue(allUnique === true);
    });
  });
});

describe('--- FMGOFER WINDOW OBJECT ---', () => {
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

  describe('initializeGofer', () => {
    const initializeGofer = __get__('initializeGofer');
    beforeEach(() => {
      delete window.fmGofer;
      if (window.fmGofer) throw new Error('window.fmGofer should not exist');
    });

    it('should create fmGofer on the window', () => {
      initializeGofer();
      assert.isObject(window.fmGofer, 'should be object');
    });

    it('should return undefined', () => {
      assert.isUndefined(initializeGofer(), 'Error checking undefined');
    });

    it('window.fmGofer should be well-formed', () => {
      const requiredKeys = ['promises', 'callbackName'];
      initializeGofer();
      assert.hasAllKeys(window.fmGofer, requiredKeys);
    });
  });
});

describe('--- CALLBACKS ---', () => {
  describe('getCallbackName', () => {
    const getCallbackName = __get__('getCallbackName');
    const fmGoferExists = __get__('fmGoferExists');

    it('should return null if fmGofer does not exist', () => {
      __set__('fmGoferExists', () => false);
      assert.isNull(getCallbackName(), 'getCallbackName() should be null');
      __set__('fmGoferExists', fmGoferExists);
    });

    it('should return name if fmGofer exists', () => {
      window.fmGofer = { callbackName: 'abcdefghijklmnop' };
      __set__('fmGoferExists', () => true);
      assert.strictEqual(getCallbackName(), window.fmGofer.callbackName);
      __set__('fmGoferExists', fmGoferExists);
    });

    it('should return undefined if window.fmGofer exists but not callbackName', () => {
      window.fmGofer = {};
      assert.isUndefined(getCallbackName(), 'should be undefined');
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
      const fmGoferExists = __get__('fmGoferExists');
      const initializeGofer = __get__('initializeGofer');
      const initializeGoferSpy = sinon.spy();
      __set__('fmGoferExists', sinon.fake.returns(false));
      __set__('initializeGofer', initializeGoferSpy);
      window.fmGofer = {};
      setCallbackName();
      sinon.assert.calledOnce(initializeGoferSpy);
      __set__('fmGoferExists', fmGoferExists);
      __set__('initializeGofer', initializeGofer);
    });
  });

  describe('runCallback', () => {
    const resolve = sinon.spy();
    const reject = sinon.spy();
    const runCallback = __get__('runCallback');
    const deletePromise = __get__('deletePromise');
    const deletePromiseSpy = sinon.spy(deletePromise);
    const getPromise = __get__('getPromise');
    beforeEach(() => {
      window.fmGofer = { promises: { 123: { resolve, reject } } };
    });

    it('should call getPromise()', () => {
      const getPromiseSpy = sinon.spy(getPromise);
      __set__('getPromise', getPromiseSpy);
      runCallback(123);
      sinon.assert.calledWith(getPromiseSpy, 123);
      __set__('getPromise', getPromise);
    });

    it('should log error if getPromise() returns undefined', () => {
      __set__('getPromise', sinon.fake.returns(undefined));
      runCallback('non_existent_id');
      sinon.assert.calledOnce(console.error);
      __set__('getPromise', getPromise);
      console.error.restore();
    });

    it('should clear timeout by timeoutID', () => {
      window.fmGofer.promises[123].timeoutID = 234;
      var clock = sinon.useFakeTimers();
      sinon.spy(clock, 'clearTimeout');
      runCallback(123);
      sinon.assert.calledWith(clock.clearTimeout, 234);
      clock.restore();
    });

    it('should reject if failed is truthy', () => {
      const param = 'hello world';
      runCallback(123, param, '1');
      assert.isTrue(reject.calledOnceWith(param));
    });

    it('should resolve if failed is "0"', () => {
      const param = 'hello world';
      runCallback(123, param, '0');
      assert.isTrue(reject.calledOnceWith(param));
    });

    it('should resolve if failed is empty string', () => {
      const param = 'hello world';
      runCallback(123, param, '');
      assert.isTrue(reject.calledOnceWith(param));
    });

    it('should resolve if failed is undefined', () => {
      const param = 'hello world';
      runCallback(123, param);
      assert.isTrue(reject.calledOnceWith(param));
    });

    it('should call deletePromise with id', () => {
      __set__('deletePromise', deletePromiseSpy);
      runCallback(123);
      sinon.assert.calledWith(deletePromiseSpy, 123);
      __set__('deletePromise', deletePromise);
    });
  });
});

describe('--- PROMISES ---', () => {
  describe('createPromise', () => {
    const createPromise = __get__('createPromise');
    beforeEach(() => {
      window.fmGofer = { promises: {}, callbackName: null };
    });
    const fn = () => {};

    it('should return a string id', () => {
      assert.isString(createPromise(fn, fn));
    });

    it('should store an object in promises with the key returned', () => {
      const id = createPromise(fn, fn);
      assert.isObject(window.fmGofer.promises[id]);
    });

    it('object should have resolve, reject, timeoutID keys', () => {
      const id = createPromise(fn, fn);
      const keys = ['resolve', 'reject', 'timeoutID'];
      assert.hasAllKeys(window.fmGofer.promises[id], keys);
    });

    it('should not have a timeoutID if you pass zero as timeout', () => {
      const id = createPromise(fn, fn, 0);
      assert.doesNotHaveAllKeys(window.fmGofer.promises[id]);
    });

    it('should return an fmGoferUUID', () => {
      const fmGoferUUID = __get__('fmGoferUUID');
      const fmGoferUUIDFake = sinon.fake.returns('FAKE_UUID');
      __set__('fmGoferUUID', fmGoferUUIDFake);
      const res = createPromise(fn, fn, 0);
      assert.strictEqual(res, 'FAKE_UUID');
      sinon.assert.calledOnce(fmGoferUUIDFake);
      __set__('fmGoferUUID', fmGoferUUID);
    });
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
      const id = 12345;
      window.fmGofer = { promises: { [id]: 'abcde' } };
      deletePromise(id);
      assert.isUndefined(window.fmGofer.promises[id]);
    });

    it('should return true', () => {
      assert.isTrue(deletePromise(12345));
    });
  });
});

describe('--- PERFORMING SCRIPTS ---', () => {
  describe('PerformScript', () => {
    const script = 'My Script';
    const PSWO = __get__('PerformScriptWithOption');
    const PSWOSpy = sinon.spy();
    const defaultTimeout = __get__('defaultTimeout');
    const defaultTimeoutMessage = __get__('defaultTimeoutMessage');
    beforeEach(() => __set__('PerformScriptWithOption', PSWOSpy));
    afterEach(() => __set__('PerformScriptWithOption', PSWO));

    it('should set default params', () => {
      PerformScript(script);
      sinon.assert.calledWith(
        PSWOSpy,
        script,
        undefined,
        undefined,
        defaultTimeout,
        defaultTimeoutMessage
      );
    });

    it('should pass params to PerformScriptWithOption', () => {
      PerformScript(script, 'my param', 2468, 'my message');
      sinon.assert.calledWith(
        PSWOSpy,
        script,
        'my param',
        undefined,
        2468,
        'my message'
      );
    });
  });

  describe('PerformScriptWithOption', () => {
    window.FileMaker = {};
    const script = 'My Script';

    it('should throw Error if timeout not number', () => {
      assert.throws(
        () =>
          PerformScriptWithOption(script, undefined, undefined, 'NaN', 'lkj'),
        Error
      );
    });

    it('should throw Error if timeoutMessage not string', () => {
      const timeoutMessage = 12345;
      assert.throws(
        () =>
          PerformScriptWithOption(
            script,
            undefined,
            undefined,
            1000,
            timeoutMessage
          ),
        Error
      );
    });

    it('shoud throw Error on non-string or empty string script', () => {
      assert.throws(() => PerformScriptWithOption(''), Error);
      assert.throws(() => PerformScriptWithOption(), Error);
      assert.throws(() => PerformScriptWithOption(undefined), Error);
    });

    it('should return a promise', () => {
      assert.strictEqual(
        PerformScriptWithOption('my script') instanceof Promise,
        true
      );
    });

    it('should initializeGofer', () => {
      delete window.fmGofer;
      const fmGoferExists = __get__('fmGoferExists');
      const initializeGofer = __get__('initializeGofer');
      const initializeGoferSpy = sinon.spy();
      const getCallbackName = __get__('getCallbackName');
      __set__('fmGoferExists', sinon.fake.returns(false));
      __set__('initializeGofer', initializeGoferSpy);
      __set__('getCallbackName', sinon.fake.returns('not empty'));
      PerformScriptWithOption('qwerty');
      sinon.assert.calledOnce(initializeGoferSpy);
      __set__('fmGoferExists', fmGoferExists);
      __set__('initializeGofer', initializeGofer);
      __set__('getCallbackName', getCallbackName);
    });

    it('should setCallbackName if missing', () => {
      delete window.fmGofer;
      const getCallbackName = __get__('getCallbackName');
      const getCallbackNameFake = sinon.fake.returns(null);
      const setCallbackName = __get__('setCallbackName');
      const setCallbackNameSpy = sinon.spy();
      __set__('getCallbackName', getCallbackNameFake);
      __set__('setCallbackName', setCallbackNameSpy);
      PerformScriptWithOption(script);
      sinon.assert.calledOnce(setCallbackNameSpy);
      __set__('getCallbackName', getCallbackName);
      __set__('setCallbackName', setCallbackName);
    });

    it('should call FileMaker.PerformScriptWithOption with args', () => {
      const fmGoferExists = __get__('fmGoferExists');
      const fmGoferExistsFake = sinon.fake.returns(true);
      __set__('fmGoferExists', fmGoferExistsFake);
      const getCallbackName = __get__('getCallbackName');
      const getCallbackNameFake = sinon.fake.returns('testCallback');
      __set__('getCallbackName', getCallbackNameFake);
      const createPromise = __get__('createPromise');
      const createPromiseFake = sinon.fake.returns('testPromiseID');
      __set__('createPromise', createPromiseFake);
      const fmOnReady_PSWO = __get__('fmOnReady_PerformScriptWithOption');
      const fmOnReady_PSWOSpy = sinon.spy();
      __set__('fmOnReady_PerformScriptWithOption', fmOnReady_PSWOSpy);

      PerformScriptWithOption('test script', 'test param', 3);
      const param = {
        promiseID: 'testPromiseID',
        callbackName: 'testCallback',
        parameter: 'test param',
      };
      sinon.assert.calledOnce(fmOnReady_PSWOSpy);
      assert.strictEqual(fmOnReady_PSWOSpy.args[0][0], 'test script');
      assert.deepEqual(JSON.parse(fmOnReady_PSWOSpy.args[0][1]), param);
      assert.strictEqual(fmOnReady_PSWOSpy.args[0][2], 3);

      __set__('fmGoferExists', fmGoferExists);
      __set__('getCallbackName', getCallbackName);
      __set__('createPromise', createPromise);
      __set__('fmOnReady_PerformScriptWithOption', fmOnReady_PSWO);
    });
  });

  describe('fmOnReady_PerformScriptWithOption', () => {
    const fn = __get__('fmOnReady_PerformScriptWithOption');
    it('should call FileMaker.PerformScriptWithOption if FM is ready', () => {
      const spy = sinon.spy();
      window.FileMaker = { PerformScriptWithOption: spy };
      const params = ['test script', 'test param', 3];
      fn(...params);
      sinon.assert.calledWith(spy, ...params);
    });

    it('should call FileMaker.PerformScriptWithOption if FM is ready in time', () => {
      const spy = sinon.spy();
      delete window.FileMaker;
      const clock = sinon.useFakeTimers();
      fn('test script', 'test param', 3);
      clock.tick(1000);
      window.FileMaker = { PerformScriptWithOption: spy };
      // go forward 9ms so the setInterval function runs again (it runs every 5ms)
      clock.tick(9);
      clock.restore();
      sinon.assert.calledOnce(spy);
    });

    it('should throw Error if FM not ready in time', () => {
      const spy = sinon.spy();
      delete window.FileMaker;
      const wrapper = () => {
        const clock = sinon.useFakeTimers();
        fn('test script', 'test param', 3);
        // The function only checks for 2000ms, so this should trigger an error.
        clock.tick(2100);
        window.FileMaker = { PerformScriptWithOption: spy };
        // go forward 9ms so the setInterval function runs again (it runs every 5ms)
        clock.tick(9);
        clock.restore();
      };
      assert.throws(wrapper, Error);
      sinon.assert.notCalled(spy);
    });
  });
});
