# fm-gofer

A framework for calling FileMaker scripts from JavaScript in web viewers and getting a response back via callbacks. Gofer... as in gofer this, gofer that.

## Gofer it

Check out `./example/FMGofer.fmp12`. You can find the html code in `./example/example.html`. This example demostrates the callback, resolve, reject, and timeout capabilities of the library.

## Install

```bash
npm install --save https://github.com/jwillinghalpern/fm-gofer
```

## Usage

1. Reference `./dist/fm-gofer.js` in an html script tag or copy into your inline javascript in your webviewer html:

    ```html
    <script> THE UMD JS CODE HERE </script>
    ```

    or use require() in javascript:

    ```javascript
    const FMGofer = require('fm-gofer');
    ```

2. Run FileMaker scripts from the JS like this:

    ```javascript
    var a = await FMGofer.PerformScript('FM Script', param);
    var b = await FMGofer.PerformScriptWithOption('FM Script', param, 5);

    // Set a custom timeout/timeout message if the default 3000ms is too short
    var c = await FMGofer.PerformScript('FM Script', param, 5000, 'timed out!');
    var d = await FMGofer.PerformScriptWithOption('FM Script', param, 5, 5000, 'timed out!');
    ```

3. To send data back to JS, extract the callbackName and promiseID from the fm script param, and use it to call the correct JS callback and promise. Pass True as the last param to reject the promise

    ```filemaker
    Set Variable [ $promiseID ; JSONGetElement ( Get ( ScriptParameter ) ; "promiseID" ) ]
    Set Variable [ $callbackName ; JSONGetElement ( Get ( ScriptParameter ) ; "callbackName" ) ]
    Set Variable [ $parameter ; JSONGetElement ( Get ( ScriptParameter ) ; "parameter" ) ]
    Perform JavaScript in WebViewer [ Object Name: "myWebviewer" ; Function Name: $callbackName ; Parameters: $promiseID, <YOUR RETURN DATA>, <True for reject> ]
    ```

## Test

```bash
npm test
```

## Build

```bash
npm run build
```

## Contribute

This code is young. If you see anything that should be improved please feel free to send pull requests or create issues.
