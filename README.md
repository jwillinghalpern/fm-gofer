# fm-gofer

Promises in FM Web Viewers!

![FM Gofer](./readme-files/fm-gofer.png)

It's like fetch() for FileMaker! Go'fer some data. Call FileMaker scripts from JavaScript in a web viewer and get the response back using async/await.

## Try it

Check out `./example/FMGofer.fmp12`. This example demostrates the callback, resolve, reject, and timeout capabilities of the library. You can rebuild the example code used in the fm file by running `npm run build && npm run build:example`. This will output an html file in example/dist/index.html, which can be used in a FM webviewer.

## Install fm-gofer in your JS project

```bash
npm install --save fm-gofer
```

## Usage

### Import fm-gofer

#### `import` syntax

```javascript
import FMGofer, { Option } from 'fm-gofer';
```

#### `require` syntax

```javascript
const FMGofer = require('fm-gofer');
const { Option } = FMGofer;
```

#### Via CDN for convenience

```html
<!-- This will set a global window property FMGofer -->
<script src="https://unpkg.com/fm-gofer/dist/fm-gofer.umd.cjs"></script>
```

#### Or copy into yout HTML if you really want

```html
<script>
  // This will set a global window property FMGofer
  (copy of ./dist/fm-gofer.umd.cjs)
</script>
```

### Use fm-gofer

#### In your JS

```javascript
import FMGofer, { Option } from 'fm-gofer';

const a = await FMGofer.PerformScript('FM Script', param);
// use the Option enum to specify the script option in human-readable form:
const b = await FMGofer.PerformScriptWithOption(
  'FM Script',
  param,
  Option.SuspendAndResume
);

// Set a custom timeout/timeout message if the default to wait indefinitely is too long
import FMGofer, { Option } from 'fm-gofer';

const c = await FMGofer.PerformScript('FM Script', param, 5000, 'timed out!');
const d = await FMGofer.PerformScriptWithOption(
  'FM Script',
  param,
  Option.SuspendAndResume,
  5000,
  'timed out!'
);

// Or if you file returns JSON, you can use the json() method to parse the result
const parsedData = await FMGofer.PerformScript('FM Script').json();
```

#### In your FileMaker script

To return data to JS, extract `callbackName` and `promiseID` from `Get ( ScriptParameter )`, and use it to call back to JS and resolve/reject the promise. Pass `True` as the last param ("failed") to reject the promise.

```bash
// NOTE: you can extract these as variables here or just use the provided custom functions to extract them
// Set Variable [ $callbackName ; JSONGetElement ( Get(ScriptParameter) ; "callbackName" ) ]
// Set Variable [ $callbackName ; FMGoferCallbackName ]
// Set Variable [ $promiseID ; JSONGetElement ( Get(ScriptParameter) ; "promiseID" ) ]
// Set Variable [ $promiseID ; FMGoferPromiseID ]
# this contains param data sent from JS
Set Variable [ $parameter ; JSONGetElement ( Get(ScriptParameter) ; "parameter" ) ]
// Set Variable [ $parameter ; FMGoferParameter ]

# callback to JS like this:
# (leave the third parameter slot empty or False to indicate a success. Or set to True to indicate an error)
# Notice how you can use the handy custom functions for the Callback name and Promise ID
Perform JavaScript in Web Viewer [ Object Name: "myWebview" ; Function Name: FMGoferCallback ; Parameters: FMGoferPromiseID , 'Success! Hello from FM!' ]
```

#### TypeScript support

```typescript
// You can assert the shape of the result returned from FM using typescript!
interface MyResult {
  name: string;
  age: number;
}
const j = await FMGofer.PerformScript('FM Script', param).json<MyResult>();
// Nested properties auto-complete in VSCode now!
const name = j.name;
const age = j.age;
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
