# fm-gofer

Promises in FM Web Viewers!

It's like fetch() for FileMaker! Go'fer some data. Call FileMaker scripts from JavaScript in a web viewer and get the response back using async/await.

## Try it

Check out `./example/FMGofer.fmp12`. This example demostrates the callback, resolve, reject, and timeout capabilities of the library. You can rebuild the example code used in the fm file by running `npm run build && npm run build:example`. This will output an html file in example/dist/index.html, which can be used in a FM webviewer.

## Install fm-gofer in your JS project

```bash
npm install --save fm-gofer
```

## Usage

### Import fm-gofer

`import` syntax:

```javascript
import FMGofer from 'fm-gofer';
```

`require` syntax:

```javascript
const FMGofer = require('fm-gofer');
```

Or import from a CDN for convenience:

```html
<!-- This will set a global window property FMGofer -->
<script src="https://unpkg.com/fm-gofer/dist/fm-gofer.min.js"></script>
```

Or copy into yout HTML for offline apps:

```html
<script>
  // This will set a global window property FMGofer
  (copy of ./dist/fm-gofer.umd.cjs)
</script>
```

### Use fm-gofer

In your JS:

```javascript
var a = await FMGofer.PerformScript('FM Script', param);
var b = await FMGofer.PerformScriptWithOption('FM Script', param, 5);

// Set a custom timeout/timeout message if the default 15000 ms is too long
var c = await FMGofer.PerformScript('FM Script', param, 5000, 'timed out!');
var d = await FMGofer.PerformScriptWithOption(
  'FM Script',
  param,
  5,
  5000,
  'timed out!'
);
```

In your FileMaker script:

To return data to JS, extract `callbackName` and `promiseID` from `Get ( ScriptParameter )`, and use it to call back to JS and resolve/reject the promise. Pass `True` as the last param ("failed") to reject the promise.

```bash
Set Variable [ $callbackName ; JSONGetElement ( Get(ScriptParameter) ; "callbackName" ) ]
Set Variable [ $promiseID ; JSONGetElement ( Get(ScriptParameter) ; "promiseID" ) ]
# this contains param data sent from JS
Set Variable [ $parameter ; JSONGetElement ( Get(ScriptParameter) ; "parameter" ) ]

# callback to JS like: $callbackName($promiseID, <dataToReturn>, <trueToReject>)
# (leave the third argument empty or False to indicate a success. Or set to True to indicate an error)
Perform JavaScript in Web Viewer [ Object Name: "myWebview" ; Function Name: $callbackName ; Parameters: $promiseID, 'Success! Hello from FM!' ]
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

If you see anything that should be improved please feel free to let me know or send pull requests.
