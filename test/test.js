const { FMGofer } = require('../src/index');
const assert = require('chai').assert;
const fm = new FMGofer();

describe('createCallback', () => {
  it('should return an integer callback id', () => {
    const prom = new Promise((resolve, reject) => {
      const callbackID = fm.createCallback(resolve, reject, 0);
      assert.isNumber(callbackID, 'should be number');
      assert.strictEqual(callbackID, parseInt(callbackID), 'should be integer');
      resolve();
    });
  });
});

// // I disabled these because the setInterval never resolves because FileMaker
// // never appears on the window. I'm not sure how to test this yet.
// describe('performScript', () => {
//   it('should return a promise', () => {
//     const res = fm.performScript();
//     assert.strictEqual(res.then ? true : false, true, 'missing `then` method');
//   });
// });

// describe('performScriptWithOption', () => {
//   it('should return a promise', () => {
//     const res = fm.performScript();
//     assert.strictEqual(res.then ? true : false, true, 'missing `then` method');
//   });
// });

describe('getCallback', () => {
  const callbackID = fm.createCallback(
    () => console.log('resolve'),
    () => console.log('rejecting'),
    0
  );
  it('should find a callback that has been created', () => {
    const callback = fm.getCallback(callbackID);
    assert.exists(callback, 'callback should exist');
  });
  it('should return undefined for a callback id does not exist', () => {
    assert.notExists(fm.getCallback(123), 'this callback id should not exist');
  });
});

describe('runCallback', () => {
  // TODO: this test is written wrong
  let result = '';
  const resolve = () => (result = 'resolved');
  const reject = () => (result = 'rejected');
  const timeout = 0;
  const timeoutMessage = 'custom message';
  it('should resolve a callback', () => {
    const id = fm.createCallback(resolve, reject, timeout, timeoutMessage);
    fm.runCallback(id, 'resolve');
    assert.strictEqual(result, 'resolved');
  });

  result = '';
  it('should reject a callback', () => {
    const id = fm.createCallback(resolve, reject, timeout, timeoutMessage);
    fm.runCallback(id, 'reject');
    assert.strictEqual(result, 'rejected');
  });

  // TODO: test to make sure that if the callback is called after the timeout, an error is not thrown.
  // I think Promises are supposed to ignore additional calls to resolve/reject, but that's not the behavior
  // that I'm getting
  result = '';
  it('should timeout if callback never called', () => {
    const timeout = 10;
    const id = fm.createCallback(resolve, reject, timeout);
    setTimeout(() => {
      // fm.runCallback(id, 'resolve');
      assert.strictEqual(result, 'rejected');
    }, 30);
  });

  result = '';
  it('should not timeout if callback called quick enough', () => {
    const timeout = 10;
    const id = fm.createCallback(resolve, reject, timeout, timeoutMessage);
    setTimeout(() => {
      fm.runCallback(id, 'resolve');
      assert.strictEqual(result, 'resolved');
    }, 5);
  });
});
