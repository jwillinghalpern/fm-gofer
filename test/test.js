import { assert } from 'chai';
import * as FMGofer from '../src/index';

// I'm using babel-plugin-rewire, which automatically adds a default export
// to FMGofer. The default export contains the rewire methods like __get__

require('jsdom-global')();
// console.log(FMGofer.default.__get__);
const fmGoferExists = FMGofer.default.__get__('fmGoferExists');

const getPromise = FMGofer.default.__get__('getPromise');
const deletePromise = FMGofer.default.__get__('deletePromise');
const runCallback = FMGofer.default.__get__('runCallback');
const setCallbackName = FMGofer.default.__get__('setCallbackName');

const reset = () => delete window.fmGofer;

describe('fmGoferUUID', () => {
  const fmGoferUUID = FMGofer.default.__get__('fmGoferUUID');
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
  const getCallbackName = FMGofer.default.__get__('getCallbackName');
  it('should return null if not initialized', () => {
    reset();
    assert.isNull(getCallbackName());
  });
  it('should return undefined if window.fmGofer exists but not callbackName', () => {
    window.fmGofer = {};
    assert.isUndefined(getCallbackName(), 'should be undefined');
  });
  it('should return the name if set', () => {
    const expected = 'customCallback123';
    window.fmGofer = { callbackName: expected };
    assert.strictEqual(getCallbackName(), expected, '[should be defined]');
  });
});

describe('initializeGofer', () => {
  const initializeGofer = FMGofer.default.__get__('initializeGofer');
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
  const createPromise = FMGofer.default.__get__('createPromise');
  window.fmGofer = { promises: {}, callbackName: null };
  const fn = () => console.log;
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

// // // I disabled these because the setInterval never resolves because FileMaker
// // // never appears on the window. I'm not sure how to test this yet.
// // describe('PerformScript', () => {
// //   it('should return a promise', () => {
// //     const res = FMGofer.PerformScript();
// //     assert.strictEqual(res.then ? true : false, true, 'missing `then` method');
// //   });
// // });

// // describe('PerformScriptWithOption', () => {
// //   it('should return a promise', () => {
// //     const res = FMGofer.PerformScript();
// //     assert.strictEqual(res.then ? true : false, true, 'missing `then` method');
// //   });
// // });

// describe('getPromise', () => {
//   const promiseID = FMGofer.createPromise(
//     () => console.log('resolve'),
//     () => console.log('rejecting'),
//     0
//   );
//   it('should find a callback that has been created', () => {
//     const promise = FMGofer.getPromise(promiseID);
//     assert.exists(promise, 'promise should exist');
//   });
//   it('should return undefined for a promise id does not exist', () => {
//     assert.notExists(
//       FMGofer.getPromise(123),
//       'this callback id should not exist'
//     );
//   });
// });

// describe('runCallback', () => {
//   // TODO: this test is written wrong
//   let result = '';
//   const resolve = () => (result = 'resolved');
//   const reject = () => (result = 'rejected');
//   const timeout = 0;
//   const timeoutMessage = 'custom message';
//   it('should resolve a callback', () => {
//     const id = FMGofer.createPromise(resolve, reject, timeout, timeoutMessage);
//     FMGofer.runCallback(id, 'resolve');
//     assert.strictEqual(result, 'resolved');
//   });

//   result = '';
//   it('should reject a callback', () => {
//     const id = FMGofer.createPromise(resolve, reject, timeout, timeoutMessage);
//     FMGofer.runCallback(id, 'reject');
//     assert.strictEqual(result, 'rejected');
//   });

//   // TODO: test to make sure that if the callback is called after the timeout, an error is not thrown.
//   // I think Promises are supposed to ignore additional calls to resolve/reject, but that's not the behavior
//   // that I'm getting
//   result = '';
//   it('should timeout if callback never called', () => {
//     const timeout = 10;
//     const id = FMGofer.createPromise(resolve, reject, timeout);
//     setTimeout(() => {
//       // FMGofer.runCallback(id, 'resolve');
//       assert.strictEqual(result, 'rejected');
//     }, 30);
//   });

//   result = '';
//   it('should not timeout if callback called quick enough', () => {
//     const timeout = 10;
//     const id = FMGofer.createPromise(resolve, reject, timeout, timeoutMessage);
//     setTimeout(() => {
//       FMGofer.runCallback(id, 'resolve');
//       assert.strictEqual(result, 'resolved');
//     }, 5);
//   });
// });
