# fm-gofer

Promises in FM Web Viewers!

A framework for calling FileMaker scripts from JavaScript in web viewers and getting responses back via promise callbacks. Gofer... as in gofer this data, gofer that data.

## Try it

Check out `./example/FMGofer.fmp12`. You can find matching html code in `./example/example.html`. This example demostrates the callback, resolve, reject, and timeout capabilities of the library.

## Installation

```bash
npm install --save fm-gofer
```

## Usage

### Import fm-gofer

`require` in JS:

```javascript
// For NodeJS <12.7.0, use this longer version:
// require('./node_modules/fm-gofer/dist/polyfill-ie11.js');
require('fm-gofer/polyfill-ie11');
const FMGofer = require('fm-gofer');
```

Or copy into HTML:

```html
<script> (copy of ./dist/polyfill-ie11.js) </script>
<script> (copy of ./dist/fm-gofer.js) </script>
```

***IMPORTANT:*** `polyfill-ie11.js` is required for webviewers in Windows FM Pro, because Internet Explorer 11 doesn't support promises. But if your app has a build system like Webpack/Rollup that uses Babel, then you can omit `polyfill-ie11` and use your build system to polyfill promises instead. This is great for React/Vue/Svelte.

### Use fm-gofer

In your JS:

```javascript
var a = await FMGofer.PerformScript('FM Script', param);
var b = await FMGofer.PerformScriptWithOption('FM Script', param, 5);

// Set a custom timeout/timeout message if the default 3000ms is too short
var c = await FMGofer.PerformScript('FM Script', param, 5000, 'timed out!');
var d = await FMGofer.PerformScriptWithOption('FM Script', param, 5, 5000, 'timed out!');
```

In your FileMaker script:

To return data to JS, extract `callbackName` and `promiseID` from `Get ( ScriptParameter )`, and use it to call back to JS and resolve/reject the promise. Pass `True` as the last param ("failed") to reject the promise.

```bash
Set Variable [ $callbackName ; JSONGetElement ( Get(ScriptParameter) ; "callbackName" ) ]
Set Variable [ $promiseID ; JSONGetElement ( Get(ScriptParameter) ; "promiseID" ) ]
# this contains param data sent from JS
Set Variable [ $parameter ; JSONGetElement ( Get(ScriptParameter) ; "parameter" ) ]

# callback to JS like: $callbackName($promiseID, <dataToReturn>, <trueToReject>)
Perform JavaScript in Web Viewer [ Object Name: "myWebview" ; Function Name: $callbackName ; Parameters: $promiseID, <dataToReturn>, <trueToReject> ]
```

## MISC

### Test

```bash
npm test
```

### Build

```bash
npm run build
```

## Contribute

This code is young. If you see anything that should be improved please feel free to send pull requests or create issues.
