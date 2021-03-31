# fm-gofer

A framework for calling FileMaker scripts from JavaScript in web viewers and getting a response back via callbacks. Gofer... as in gofer this, gofer that.

## Gofer it

Check out `./example/FMGofer.fmp12`. You can find the html code in `./example/example.html. This example demostrates the callback, resolve, reject, and timeout capabilities of the library.

## Usage

1. Reference ./dist/fm-gofer.js in an html script tag or copy into your inline javascript in your webviewer html:

    ```html
    <script> THE UMD JS CODE HERE </script>
    ```

    ```javascript
    // or use require() in javascript:
    const FMGofer = require('fm-gofer');
    ```

2. Create an instance of FMGofer in your code and attach the `runCallback` method to the window so FileMaker can call it using `Perform JavaScript in WebViewer`:

    ```javascript
    var fm = new FMGofer();
    fm.setCallbackName();
    // The above uses the default callback name 'fmCallback'. For a custom name:
    // fm.setCallbackName('myCustomCallback');
    ```

3. Run FileMaker scripts from the JS like this:

    ```javascript
    fm.PerformScript('Your FM Script', param, timeout, timeoutMessage);
    fm.PerformScriptWithOption('Your FM Script', param, option, timeout, timeoutMessage);
    ```

4. To send data back to JS, extract the callbackName and promiseID from the fm script param, and use it to call the correct JS callback and promise. Remember to tell JS whether to "resolve" or "reject":

    ```filemaker
    Set Variable [ $promiseID ; JSONGetElement ( Get ( ScriptParameter ) ; "promiseID" ) ]
    Set Variable [ $callbackName ; JSONGetElement ( Get ( ScriptParameter ) ; "callbackName" ) ]
    Perform JavaScript in WebViewer [ Object Name: "myWebviewer" ; Function Name: $callbackName ; Parameters: $promiseID, "resolve", <YOUR RETURN DATA> ]
    ```

## Build

to build run `npm run build`

## Contribute

This code is young. If you see anything that should be improved please feel free to send pull requests or create issues.
