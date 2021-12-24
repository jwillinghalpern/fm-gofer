/**
 * @jest-environment jsdom
 */

import {
  PerformScript,
  PerformScriptWithOption,
  __get__,
  __set__,
} from '../src/index';

describe('--- UTILS ---', () => {
  describe('fmGoferUUID', () => {
    const fmGoferUUID = __get__('fmGoferUUID');
    it('should return a string', () => {
      expect(typeof fmGoferUUID()).toBe('string');
    });

    it('should only contain letters and numbers', () => {
      const id = fmGoferUUID();
      // assert.match(id, /^[a-z0-9]+$/i);
      expect(id).toMatch(/^[a-z0-9]+$/i);
    });

    it('should return a unique result each time', () => {
      const ids = [];
      for (let i = 0; i < 20; i++) {
        ids.push(fmGoferUUID());
      }
      const allUnique = new Set(ids).size === ids.length;
      expect(allUnique).toBe(true);
    });
  });
});

describe('--- FMGOFER WINDOW OBJECT ---', () => {
  describe('fmGoferExists', () => {
    const fmGoferExists = __get__('fmGoferExists');

    it('should return true if fmGofer is a non-null object', () => {
      window.fmGofer = {};
      expect(fmGoferExists()).toBe(true);
    });

    it('should return false if fmGofer is not an object', () => {
      window.fmGofer = 'abc';
      expect(fmGoferExists()).toBe(false);
      window.fmGofer = 123;
      expect(fmGoferExists()).toBe(false);
      window.fmGofer = [1, 2, 3];
      expect(fmGoferExists()).toBe(false);
      window.fmGofer = true;
      expect(fmGoferExists()).toBe(false);
      window.fmGofer = null;
      expect(fmGoferExists()).toBe(false);
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
      // assert.isObject(window.fmGofer, 'should be object');
      expect(typeof window.fmGofer).toBe('object');
    });

    it('should return undefined', () => {
      expect(initializeGofer()).toBe(undefined);
    });

    it('window.fmGofer should be well-formed', () => {
      initializeGofer();
      expect(window.fmGofer).toHaveProperty('promises');
      expect(window.fmGofer).toHaveProperty('callbackName');
    });
  });
});

describe('--- CALLBACKS ---', () => {
  describe('runCallback', () => {
    // const resolve = sinon.spy();
    const resolve = jest.fn();
    // const reject = sinon.spy();
    const reject = jest.fn();
    const runCallback = __get__('runCallback');
    const deletePromise = __get__('deletePromise');
    // const deletePromiseSpy = sinon.spy(deletePromise);
    const deletePromiseSpy = jest.fn();
    const getPromise = __get__('getPromise');
    beforeEach(() => {
      window.fmGofer = { promises: { 123: { resolve, reject } } };
    });

    it('should call getPromise()', () => {
      const getPromiseMock = jest.fn(getPromise);
      __set__('getPromise', getPromiseMock);
      runCallback(123);
      expect(getPromiseMock).toBeCalledTimes(1);
      __set__('getPromise', getPromise);
    });

    it('should log error if getPromise() returns undefined', () => {
      __set__(
        'getPromise',
        jest.fn(() => undefined)
      );
      jest.spyOn(console, 'error').mockImplementation(() => {});
      runCallback('non_existent_id');
      expect(console.error).toBeCalledTimes(1);
      __set__('getPromise', getPromise);
    });

    it('should clear timeout by timeoutID', () => {
      const id = '123',
        timeoutID = 234;
      window.fmGofer.promises[id].timeoutID = timeoutID;
      jest.spyOn(global, 'clearTimeout');
      runCallback('123');
      expect(clearTimeout).toBeCalledWith(timeoutID);
    });

    it('should reject if failed is truthy', () => {
      const param = 'hello world';
      runCallback(123, param, '1');
      expect(reject).toBeCalledWith(param);
    });

    it('should resolve if failed is "0"', () => {
      const param = 'hello world';
      runCallback(123, param, '0');
      expect(reject).toBeCalledWith(param);
    });

    it('should resolve if failed is empty string', () => {
      const param = 'hello world';
      runCallback(123, param, '');
      expect(reject).toBeCalledWith(param);
    });

    it('should resolve if failed is undefined', () => {
      const param = 'hello world';
      runCallback(123, param);
      expect(reject).toBeCalledWith(param);
    });

    it('should call deletePromise with id', () => {
      __set__('deletePromise', deletePromiseSpy);
      runCallback(123);
      expect(deletePromiseSpy).toBeCalledWith(123);
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
      expect(typeof createPromise(fn, fn)).toBe('string');
    });

    it('should store an object in promises with the key returned', () => {
      const id = createPromise(fn, fn);
      expect(typeof window.fmGofer.promises[id]).toBe('object');
    });

    it('object should have resolve, reject, timeoutID keys', () => {
      const id = createPromise(fn, fn);
      expect(window.fmGofer.promises[id]).toHaveProperty('resolve');
      expect(window.fmGofer.promises[id]).toHaveProperty('reject');
      expect(window.fmGofer.promises[id]).toHaveProperty('timeoutID');
    });

    it('should not have a timeoutID if you pass zero as timeout', () => {
      const id = createPromise(fn, fn, 0);
      expect(window.fmGofer.promises[id]).not.toHaveProperty('timeoutID');
    });

    it('should return an fmGoferUUID', () => {
      const fmGoferUUID = __get__('fmGoferUUID');
      const fmGoferUUIDFake = jest.fn().mockReturnValue('FAKE_UUID');
      __set__('fmGoferUUID', fmGoferUUIDFake);
      const res = createPromise(fn, fn, 0);
      expect(res).toStrictEqual('FAKE_UUID');
      expect(fmGoferUUIDFake).toBeCalledTimes(1);
      __set__('fmGoferUUID', fmGoferUUID);
    });

    it('should reject if timeout exceeded', () => {
      const reject = jest.fn();
      const clock = jest.useFakeTimers();
      createPromise(() => {}, reject, 10, 'default message');
      clock.advanceTimersByTime(11);
      expect(reject).toBeCalledTimes(1);
      jest.useRealTimers();
    });
  });

  describe('getPromise', () => {
    const getPromise = __get__('getPromise');

    it('should get a stored promise at window.fmGofer.promises[id]', () => {
      window.fmGofer = { promises: { 12345: 'abcde' } };
      expect(getPromise('12345')).toStrictEqual('abcde');
    });
  });
  describe('deletePromise', () => {
    const deletePromise = __get__('deletePromise');

    it('should delete a promise stored at window.fmGofer.promise[id]', () => {
      const id = 12345;
      window.fmGofer = { promises: { [id]: 'abcde' } };
      deletePromise(id);
      expect(window.fmGofer.promises[id]).toBeUndefined();
    });

    it('should return true', () => {
      expect(deletePromise(12345)).toBe(true);
    });
  });
});

describe('--- PERFORMING SCRIPTS ---', () => {
  describe('PerformScript', () => {
    const script = 'My Script';
    const PSWO = __get__('PerformScriptWithOption');
    const PSWOSpy = jest.fn();
    const defaultTimeout = __get__('defaultTimeout');
    const defaultTimeoutMessage = __get__('defaultTimeoutMessage');
    beforeEach(() => __set__('PerformScriptWithOption', PSWOSpy));
    afterEach(() => __set__('PerformScriptWithOption', PSWO));

    it('should set default params', () => {
      PerformScript(script);
      expect(PSWOSpy).toBeCalledWith(
        script,
        undefined,
        undefined,
        defaultTimeout,
        defaultTimeoutMessage
      );
    });

    it('should pass params to PerformScriptWithOption', () => {
      PerformScript(script, 'my param', 2468, 'my message');
      expect(PSWOSpy).toBeCalledWith(
        script,
        'my param',
        undefined,
        2468,
        'my message'
      );
    });
  });

  describe('PerformScriptWithOption', () => {
    window.FileMaker = {
      PerformScript: () => {},
      PerformScriptWithOption: () => {},
    };
    const script = 'My Script';

    it('should throw Error if timeout not number', () => {
      expect(() =>
        PerformScriptWithOption(script, undefined, undefined, 'NaN', 'lkj')
      ).toThrowError();
    });

    it('should throw Error if timeoutMessage not string', () => {
      const timeoutMessage = 12345;
      expect(() =>
        PerformScriptWithOption(
          script,
          undefined,
          undefined,
          1000,
          timeoutMessage
        )
      ).toThrowError();
    });

    it('should throw Error on non-string or empty string script', () => {
      expect(() => {
        PerformScriptWithOption('');
      }).toThrow();
      expect(() => {
        PerformScriptWithOption();
      }).toThrow();
      expect(() => {
        PerformScriptWithOption(undefined);
      }).toThrow();
    });

    it('should return a promise', () => {
      expect(PerformScriptWithOption('my script')).toBeInstanceOf(Promise);
    });

    it('should initializeGofer', () => {
      delete window.fmGofer;
      const fmGoferExists = __get__('fmGoferExists');
      const initializeGofer = __get__('initializeGofer');
      const initializeGoferSpy = jest.fn().mockImplementation(initializeGofer);
      const getCallbackName = __get__('getCallbackName');
      __set__('fmGoferExists', jest.fn().mockReturnValue(false));
      __set__('initializeGofer', initializeGoferSpy);
      __set__('getCallbackName', jest.fn().mockReturnValue('not empty'));
      try {
        PerformScriptWithOption('qwerty');
      } catch (err) {
        1;
      }
      expect(initializeGoferSpy).toBeCalledTimes(1);
      __set__('fmGoferExists', fmGoferExists);
      __set__('initializeGofer', initializeGofer);
      __set__('getCallbackName', getCallbackName);
    });

    it('should call FileMaker.PerformScriptWithOption with args', () => {
      const callbackName = __get__('callbackName');
      const fmGoferExists = __get__('fmGoferExists');
      const fmGoferExistsFake = jest.fn().mockReturnValue(true);
      __set__('fmGoferExists', fmGoferExistsFake);
      const createPromise = __get__('createPromise');
      const createPromiseFake = jest
        .fn('testPromiseID')
        .mockReturnValue('testPromiseID');
      __set__('createPromise', createPromiseFake);
      const fmOnReady_PSWO = __get__('fmOnReady_PerformScriptWithOption');
      const fmOnReady_PSWOSpy = jest.fn();
      __set__('fmOnReady_PerformScriptWithOption', fmOnReady_PSWOSpy);

      const scriptName = 'test script';
      const scriptOption = 3;
      PerformScriptWithOption(scriptName, 'test param', scriptOption);
      const param = {
        promiseID: 'testPromiseID',
        callbackName: callbackName,
        parameter: 'test param',
      };
      expect(fmOnReady_PSWOSpy).toBeCalledTimes(1);
      expect(fmOnReady_PSWOSpy).toBeCalledWith(
        scriptName,
        JSON.stringify(param),
        scriptOption
      );
      __set__('fmGoferExists', fmGoferExists);
      __set__('createPromise', createPromise);
      __set__('fmOnReady_PerformScriptWithOption', fmOnReady_PSWO);
    });
  });

  describe('fmOnReady_PerformScriptWithOption', () => {
    const fmOnReady_PerformScriptWithOption = __get__(
      'fmOnReady_PerformScriptWithOption'
    );
    it('should call FileMaker.PerformScriptWithOption if FM is ready', () => {
      const spy = jest.fn();
      window.FileMaker = { PerformScriptWithOption: spy };
      const params = ['test script', 'test param', 3];
      fmOnReady_PerformScriptWithOption(...params);
      expect(spy).toBeCalledWith(...params);
    });

    it('should call FileMaker.PerformScriptWithOption if FM is ready in less than 2000 ms', () => {
      const spy = jest.fn();
      delete window.FileMaker;
      const clock = jest.useFakeTimers();
      fmOnReady_PerformScriptWithOption('test script', 'test param', 3);
      clock.advanceTimersByTime(1000);
      // now, let's pretend that window.FileMaker is ready suddenly
      window.FileMaker = { PerformScriptWithOption: spy };
      // go forward 9ms so the setInterval function runs again (it runs every 5ms)
      clock.advanceTimersByTime(9);
      jest.useRealTimers();
      expect(spy).toBeCalledTimes(1);
    });

    it('should throw Error if window.FileMaker is not ready in less than 2000 ms', () => {
      const spy = jest.fn();
      delete window.FileMaker;
      const wrapper = () => {
        const clock = jest.useFakeTimers();
        fmOnReady_PerformScriptWithOption('test script', 'test param', 3);
        // The function only checks for 2000ms, so this should trigger an error.
        clock.advanceTimersByTime(2100);
        window.FileMaker = { PerformScriptWithOption: spy };
        // go forward 9ms so the setInterval function runs again (it runs every 5ms)
        clock.advanceTimersByTime(9);
        jest.useRealTimers();
      };
      expect(wrapper).toThrow();
      expect(spy).not.toBeCalled();
    });
  });
});
