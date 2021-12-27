/**
 * @jest-environment jsdom
 */

import 'regenerator-runtime/runtime';

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
    const resolve = jest.fn();
    const reject = jest.fn();
    const runCallback = __get__('runCallback');
    const deletePromise = __get__('deletePromise');
    const deletePromiseSpy = jest.fn();
    const getPromise = __get__('getPromise');
    beforeEach(() => {
      window.fmGofer = { promises: { 123: { resolve, reject } } };
    });

    it('should call getPromise()', () => {
      const getPromiseMock = jest.fn(getPromise);
      __set__('getPromise', getPromiseMock);
      runCallback(123);
      expect(getPromiseMock).toBeCalled();
      __set__('getPromise', getPromise);
    });

    it('should log error if getPromise() returns undefined', () => {
      __set__(
        'getPromise',
        jest.fn(() => undefined)
      );
      jest.spyOn(console, 'error').mockImplementation(() => {});
      runCallback('non_existent_id');
      expect(console.error).toBeCalled();
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
  describe('storePromise', () => {
    const storePromise = __get__('storePromise');
    beforeEach(() => {
      window.fmGofer = { promises: {}, callbackName: null };
    });
    const fn = () => {};

    it('should return a string id', () => {
      expect(typeof storePromise(fn, fn)).toBe('string');
    });

    it('should store an object in promises with the key returned', () => {
      const id = storePromise(fn, fn);
      expect(typeof window.fmGofer.promises[id]).toBe('object');
    });

    it('object should have resolve, reject, timeoutID keys', () => {
      const id = storePromise(fn, fn);
      expect(window.fmGofer.promises[id]).toHaveProperty('resolve');
      expect(window.fmGofer.promises[id]).toHaveProperty('reject');
      expect(window.fmGofer.promises[id]).toHaveProperty('timeoutID');
    });

    it('should not have a timeoutID if you pass zero as timeout', () => {
      const id = storePromise(fn, fn, 0);
      expect(window.fmGofer.promises[id]).not.toHaveProperty('timeoutID');
    });

    it('should return an fmGoferUUID', () => {
      const fmGoferUUID = __get__('fmGoferUUID');
      const fmGoferUUIDFake = jest.fn().mockReturnValue('FAKE_UUID');
      __set__('fmGoferUUID', fmGoferUUIDFake);
      const res = storePromise(fn, fn, 0);
      expect(res).toStrictEqual('FAKE_UUID');
      expect(fmGoferUUIDFake).toBeCalled();
      __set__('fmGoferUUID', fmGoferUUID);
    });

    it('should reject if timeout exceeded', () => {
      const reject = jest.fn();
      const clock = jest.useFakeTimers();
      storePromise(() => {}, reject, 10, 'default message');
      clock.advanceTimersByTime(11);
      expect(reject).toBeCalled();
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

    it('should call clearTimeout and clearInterval if ids exist', () => {
      const clearIntervalSpy = jest.spyOn(window, 'clearInterval');
      const clearTimeoutSpy = jest.spyOn(window, 'clearTimeout');
      const promiseID = 12345;
      const fmOnReadyIntervalID = 123;
      const timeoutID = 234;
      window.fmGofer = {
        promises: {
          [promiseID]: {
            fmOnReadyIntervalID,
            timeoutID,
          },
        },
      };
      deletePromise(promiseID);
      expect(clearIntervalSpy).toBeCalledWith(fmOnReadyIntervalID);
      expect(clearTimeoutSpy).toBeCalledWith(timeoutID);
      clearIntervalSpy.mockClear();
      clearTimeoutSpy.mockClear();
      jest.time;
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
      expect(initializeGoferSpy).toBeCalled();
      __set__('fmGoferExists', fmGoferExists);
      __set__('initializeGofer', initializeGofer);
      __set__('getCallbackName', getCallbackName);
    });

    it('should call FileMaker.PerformScriptWithOption with args', async () => {
      const script = 'script';
      const param = 'param';
      const option = 5;
      const timeout = 500;
      const timeoutMessage = 'custom';
      const callbackName = __get__('callbackName');
      const promiseID = 'testPromiseID';
      const fmGoferUUID = __get__('fmGoferUUID');
      const fmGoferUUIDFake = jest.fn().mockReturnValue(promiseID);
      __set__('fmGoferUUID', fmGoferUUIDFake);
      jest.useFakeTimers();
      const goferParam = {
        script,
        callbackName,
        promiseID,
      };
      const mock = jest.fn();
      window.Filemaker = {
        PerformScriptWithOption: mock,
        PerformScript: mock,
      };
      try {
        PerformScriptWithOption(script, param, option, timeout, timeoutMessage);
        jest.advanceTimersByTime(1);
      } catch (err) {
        expect(mock).toBeCalledWith(script, goferParam, option);
      }
      jest.useRealTimers();
      __set__('fmGoferUUID', fmGoferUUID);
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
    it('should call FileMaker.PerformScriptWithOption if FM becomes ready in less than 2000 ms', () => {
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
      expect(spy).toBeCalled();
    });

    it('should return {intervalID, promise}', () => {
      delete window.FileMaker;
      const res = fmOnReady_PerformScriptWithOption('script', 'param', 0);
      expect(typeof res?.promise?.then).toBe('function');
      expect(res).toHaveProperty('intervalID');
      expect(typeof res?.intervalID).toBe('number');
    });
    it('the promise should reject if FileMaker not ready in <2s', () => {
      jest.useFakeTimers();
      const { promise } = fmOnReady_PerformScriptWithOption('s', 'p', 0);
      jest.advanceTimersByTime(2010);
      expect.assertions(1);
      return expect(promise).rejects.toContain('window.FileMaker not found');
    });
    it('the promise should resolve with undefined if FileMaker is ready in <2s', () => {
      jest.useFakeTimers();
      // this timeout mimics FileMaker appearing on the window after 500ms
      setTimeout(() => {
        window.FileMaker = {
          PerformScript: () => {},
          PerformScriptWithOption: () => {},
        };
      }, 500);
      const { promise } = fmOnReady_PerformScriptWithOption('s', 'p', 0);
      jest.runAllTimers();
      expect.assertions(1);
      // returns void promise
      return expect(promise).resolves.toBeUndefined();
    });
  });

  describe('Timeouts', () => {
    beforeAll(() => {});
    beforeEach(() => {
      jest.useFakeTimers();
      delete window.FileMaker;
    });
    afterAll(() => {
      jest.useRealTimers();
    });
    it('should call deletePromise if custom timeout elapses', async () => {
      const deletePromise = __get__('deletePromise');
      const deletePromiseSpy = jest.fn();
      __set__('deletePromise', deletePromiseSpy);
      const defaultTimeoutMessage = __get__('defaultTimeoutMessage');
      // custom timeout of 1000 ms, which is less than the 2000ms that FMGofer
      // will wait for FileMaker.PerformScript to appear. Therefore we can
      // check if a quick custom timeout causes clearInterval() to be called.
      // we can also confirm that it does not throw?
      // const x = PerformScript('script', 'param', 1000);
      try {
        const promise = PerformScript('script', 'param', 1000);
        jest.advanceTimersByTime(1001);
        await promise;
      } catch (error) {
        expect(error).toMatch(defaultTimeoutMessage);
        expect(deletePromiseSpy).toBeCalled();
      }
      __set__('deletePromise', deletePromise);
    });
    it('should timeout in < 2s if custom timeout is < 2s', async () => {
      const timeStart = Date.now();
      try {
        const promise = PerformScript('script', 'param', 1000);
        jest.advanceTimersByTime(1000);
        await promise;
        // the promise should be rejected already and this next piece won't run
      } catch (error) {
        const runtime = Date.now() - timeStart;
        expect(runtime).toBeLessThan(2000);
      }
    });
    it('should reject before the custom timeout if FileMaker is not found in 2s', async () => {
      const timeStart = Date.now();
      try {
        // custom timeout > 2s
        const promise = PerformScript('script', 'param', 3000);
        // wait just over 2 seconds and it should reject
        jest.advanceTimersByTime(2010);
        await promise;
        // the promise should be rejected already and this next piece won't run
      } catch (error) {
        const runtime = Date.now() - timeStart;
        expect(runtime).toBeLessThan(3000);
      }
    });
    it('should reject after the custom timeout if FM is found but does not callback to JS in time', async () => {
      const timeStart = Date.now();
      const customTimeout = 2400;
      const customTimeoutMessage = Math.random().toString();
      try {
        // this timeout mimics FileMaker appearing on the window after 500ms
        setTimeout(() => {
          window.FileMaker = {
            PerformScript: () => {},
            PerformScriptWithOption: () => {},
          };
        }, 500);
        const promise = PerformScript(
          'script',
          'param',
          customTimeout,
          customTimeoutMessage
        );
        jest.runAllTimers();
        await promise;
      } catch (error) {
        const runtime = Date.now() - timeStart;
        expect(runtime).toBeGreaterThanOrEqual(customTimeout);
        expect(error).toBe(customTimeoutMessage);
      }
    });

    it('should return a clearIntervalFn function', () => {
      const clearIntervalFn = fmOnReady_PerformScriptWithOption(
        'script',
        'param',
        '3'
      );
      expect(typeof clearIntervalFn).toBe('function');
    });

    it('should call the clearIntervalFn function if promise is rejected due to timeout', () => {
      const clearIntervalFnMock = jest.fn();
      const mock = jest.fn().mockReturnValue(clearIntervalFnMock);
      __set__('fmOnReady_PerformScriptWithOption', mock);
      const clock = jest.useFakeTimers();
      // custom timeout of 1000 ms. This is less than the 2000ms that FMGofer
      // will wait for FileMaker.PerformScript to appear, and therefore we can
      // check if a quick custom timeout trigger clearIntervalFn() to be called.
      PerformScript('script', 'param', 1000).catch((err) => {});
      clock.advanceTimersByTime(1020);
      expect(clearIntervalFnMock).toBeCalled();
      jest.useRealTimers();
      __set__(
        'fmOnReady_PerformScriptWithOption',
        fmOnReady_PerformScriptWithOption
      );
    });
  });
});
