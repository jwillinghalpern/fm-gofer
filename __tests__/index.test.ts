import {
  vi,
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  Mock,
  afterAll,
} from 'vitest';

import FMGofer, { GoferParam, Option } from '../src/index';

vi.stubGlobal('FileMaker', {});

describe('PerformScript', () => {
  let pswo: Mock;
  beforeEach(() => {
    window.FileMaker.PerformScriptWithOption = vi.fn(); //, 'PerformScriptWithOption');
    pswo = window.FileMaker.PerformScriptWithOption as Mock;
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should parse json response if you call .json()', async () => {
    const message = '{"hello": "world"}';
    const expected = JSON.parse(message);
    window.FileMaker.PerformScriptWithOption = vi.fn(
      (script, param, option) => {
        // setTimeout emulates FM's asynchronous response
        setTimeout(() => {
          const { callbackName, promiseID }: GoferParam = JSON.parse(
            param as string
          );
          window[callbackName](promiseID, message);
        }, 10);
      }
    );
    await expect(FMGofer.PerformScript('My Script').json()).resolves.toEqual(
      expected
    );
  });

  it('should set default params', () => {
    const script = 'My Script';
    FMGofer.PerformScript(script);
    // const pswoMock = window.FileMaker.PerformScriptWithOption;
    expect(pswo).toBeCalled();

    // first arg is script
    expect(pswo.mock.calls[0][0]).toBe(script);
    // second arg is stringified object contining specific keys
    const arg2 = pswo.mock.calls[0][1];
    const parsed = JSON.parse(arg2);
    // expect(parsed.callbackName).toBe(expect.stringContaining('fmgofer'))
    expect(parsed).toEqual({
      promiseID: expect.stringMatching(/[a-z]/),
      callbackName: expect.stringContaining('fmGofer'),
    });
    // third arg is undefined (no option)
    expect(pswo.mock.calls[0][2]).toBe(undefined);
  });

  it('should allow custom parameter and fm script option', () => {
    const script = 'My Script';
    const parameter = 'my param';
    const option = Option.SuspendAndResume;
    FMGofer.PerformScriptWithOption(script, parameter, option);

    expect(pswo).toBeCalled();
    // first arg is script
    expect(pswo.mock.calls[0][0]).toBe(script);
    // second arg is stringified object contining specific keys
    const arg2 = pswo.mock.calls[0][1];
    const arg2Parsed = JSON.parse(arg2);
    expect(arg2Parsed.promiseID).toEqual(expect.stringMatching(/[a-z]/));
    expect(arg2Parsed.callbackName).toEqual(
      expect.stringContaining('fmGoferCallback')
    );
    expect(arg2Parsed.parameter).toBe(parameter);
    // first arg is custom fm script option
    expect(pswo.mock.calls[0][2]).toBe(option);
  });

  it('should set `callbackName` on the window so FM can call it', () => {
    FMGofer.PerformScript('My Script');
    const param = pswo.mock.calls[0][1];
    const paramParsed = JSON.parse(param);
    const { callbackName } = paramParsed;
    expect(window).toHaveProperty(callbackName);
  });

  it('should set `fmGofer` on the window with a matching promiseID', () => {
    // this is a bit of an implementation detail, but I want to document
    // the behavior in tests because polluting the window scope is noteworthy
    FMGofer.PerformScript('My Script');
    const param = pswo.mock.calls[0][1];
    const paramParsed = JSON.parse(param);
    const { promiseID } = paramParsed;
    expect(window).toHaveProperty('fmGofer');
    expect(window.fmGofer.promises).toHaveProperty(promiseID);
  });

  describe('PerformScriptWithOption', () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });
    it('should parse json response if you call .json()', async () => {
      const message = '{"hello": "world"}';
      const expected = JSON.parse(message);
      window.FileMaker.PerformScriptWithOption = vi.fn(
        (script, param, option) => {
          // setTimeout emulates FM's asynchronous response
          setTimeout(() => {
            const { callbackName, promiseID }: GoferParam = JSON.parse(
              param as string
            );
            window[callbackName](promiseID, message);
          }, 10);
        }
      );
      await expect(
        FMGofer.PerformScriptWithOption('My Script').json()
      ).resolves.toEqual(expected);
    });

    it('should resolve with message if FM calls back without error', async () => {
      const message = 'Thanks from FM';
      window.FileMaker.PerformScriptWithOption = vi.fn(
        (script, param, option) => {
          // setTimeout emulates FM's asynchronous response
          setTimeout(() => {
            const { callbackName, promiseID }: GoferParam = JSON.parse(
              param as string
            );
            window[callbackName](promiseID, message);
          }, 10);
        }
      );
      await expect(FMGofer.PerformScript('My Script')).resolves.toEqual(
        message
      );
    });

    it('should reject with message if FM calls back with error', async () => {
      const message = 'FM rejected the call!';
      window.FileMaker.PerformScriptWithOption = vi.fn(
        (script, param, option) => {
          setTimeout(() => {
            const { callbackName, promiseID }: GoferParam = JSON.parse(
              param as string
            );
            const isError = true;
            window[callbackName](promiseID, message, isError);
          }, 10);
        }
      );
      await expect(FMGofer.PerformScript('My Script')).rejects.toEqual(message);
    });

  describe('timeouts', () => {
		const successMessage = 'Slow but successful response from FM';
    beforeEach(() => {
      vi.useFakeTimers();
      // mock console to suppress the error that fm-gofer logs
      window.console.error = vi.fn(() => { });
      // simulate a very slow response from FileMaker
      const timeoutMs = 1000 * 60 * 5 // 5 minutes. This should be longer than the default timeout.
      window.FileMaker.PerformScriptWithOption = vi.fn((script, param, option) => {
        setTimeout(() => {
          const { callbackName, promiseID }: GoferParam = JSON.parse(param as string);
          window[callbackName](promiseID, successMessage)
        }, timeoutMs);
      });
      afterEach(() => {
        vi.restoreAllMocks();
      });

    it("should reject automatically with a default timeout and message", async () => {
      const prom = FMGofer.PerformScript('My Script');
      vi.runAllTimers();
      await expect(prom).resolves.toBe(successMessage);
    })

    it("should support custom messages and timeouts", async () => {
      const customTimeout = 500 // only allow 500 ms for response
      const customTimeoutMessage = 'custom message!'
      const prom = FMGofer.PerformScript('My Script', '', customTimeout, customTimeoutMessage);
      // overtake the short custom timeout, but fm still hasn't responded
      // (remember we set it it to take 5 minutes)
      vi.advanceTimersByTime(502);
      await expect(prom).rejects.toThrow(customTimeoutMessage);
    })
  })

    describe('inputs and outputs', () => {
      const script = 'My Script';

      it('should throw Error if timeout not number', () => {
        expect(() =>
          FMGofer.PerformScriptWithOption(
            script,
            undefined,
            undefined,
            // @ts-expect-error
            'NaN',
            'lkj'
          )
        ).toThrowError();
      });

      it('should throw Error if timeoutMessage not string', () => {
        const timeoutMessage = 12345;
        expect(() =>
          FMGofer.PerformScriptWithOption(
            script,
            undefined,
            undefined,
            1000,
            // @ts-expect-error
            timeoutMessage
          )
        ).toThrowError();
      });

      it('should throw Error on non-string or empty string script', () => {
        expect(() => {
          FMGofer.PerformScriptWithOption('');
        }).toThrow();
        expect(() => {
          // @ts-expect-error
          FMGofer.PerformScriptWithOption();
        }).toThrow();
        expect(() => {
          // @ts-expect-error
          FMGofer.PerformScriptWithOption(undefined);
        }).toThrow();
      });

      it('should return a promise', () => {
        expect(FMGofer.PerformScriptWithOption('my script')).toBeInstanceOf(
          Promise
        );
      });
    });
  });

  describe('Wait for FM to be ready before calling', () => {
    beforeEach(() => {
      window.console.error = vi.fn(() => {});
      vi.stubGlobal('FileMaker', undefined);
    });
    afterEach(() => {
      vi.resetAllMocks();
    });
    afterAll(() => {
      vi.stubGlobal('FileMaker', {});
    });

    it('should call FileMaker.PerformScriptWithOption if FM is ready', () => {
      const spy = vi.fn();
      // simulate FileMaker becoming available on the window:
      window.FileMaker = {
        PerformScriptWithOption: spy,
        PerformScript: () => {},
      };
      // then FMGofer has instant access to it
      FMGofer.PerformScriptWithOption('test script', 'test param', 3);
      expect(spy).toBeCalled();
    });

    it('should call FileMaker.PerformScriptWithOption if FM becomes ready in less than 2000 ms', () => {
      // the max wait time is 2000ms
      const spy = vi.fn();
      vi.useFakeTimers();
      FMGofer.PerformScriptWithOption(
        'test script',
        'test param',
        3,
        2000,
        'lkjf'
      );
      vi.advanceTimersByTime(1000);
      // script should be queued but not called yet
      expect(spy).not.toBeCalled();
      // now FileMaker appears
      window.FileMaker = {
        PerformScriptWithOption: spy,
        PerformScript: () => {},
      };
      // go forward 9ms so the setInterval function runs again (it runs every 5ms)
      vi.advanceTimersByTime(9);
      expect(spy).toBeCalled();
      vi.useRealTimers();
    });

    it('should reject and log error if window.FileMaker doesn\t appear in time', async () => {
      // the max wait time is 2000ms
      const spy = vi.fn();
      vi.useFakeTimers();
      const prom = FMGofer.PerformScriptWithOption(
        'test script',
        'test param',
        3
      );
      // window.FileMaker is not found within 2000ms
      vi.advanceTimersByTime(2100);
      await expect(prom).rejects.toThrowError();
      expect(spy).not.toBeCalled();
    });
  });
})});
