# CKEditor 5 rich text editor component for Omi

[CKEditor 5](https://ckeditor.com/ckeditor-5/) rich text editor component for [Omi](https://github.com/Tencent/omi).


## Getting started
```bash
> npm i --g omi-cli
> omi init myapp
> npm i --save @ckeditor/ckeditor5-build-classic
> npm i --save ckeditor5-omi
> npm run start
```

``` javascript
import 'babel-polyfill'
import { define, WeElement } from 'omi'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import 'ckeditor5-omi'

define('myapp-element', class extends WeElement {
  render() {
    return (
      <ckeditor-element
        editor={ ClassicEditor }
        data="<p>Hello from CKEditor 5!</p>"
        onInit={ editor => {
            // You can store the "editor" and use when it is needed.
            console.log( 'Editor is ready to use!', editor );
        } }
        onChange={ ( event, editor ) => {
            const data = editor.getData();
            console.log( { event, editor, data } );
        } }
        onBlur={ editor => {
            console.log( 'Blur.', editor );
        } }
        onFocus={ editor => {
            console.log( 'Focus.', editor );
        } }
      />
    )
  }
})
```

## Executing tests
```bash
> npm install
```

```bash
> npm run test -- [additional options]
# or
> npm t -- [additional options]
```

The command accepts the following options:

* `--coverage` (`-c`) &ndash; Whether to generate the code coverage.
* `--source-map` (`-s`) &ndash; Whether to attach the source maps.
* `--watch` (`-w`) &ndash; Whether to watch test files.
* `--reporter` (`-r`) &ndash; Reporter for Karma (default: `mocha`, can be changed to `dots`).
* `--browsers` (`-b`) &ndash; Browsers that will be used to run tests (default: `Chrome`, available: `Firefox`, `BrowserStack_Edge` and `BrowserStack_Safari`).

**Note:** If you would like to use the `BrowserStack_*` browser, you need to specify the `BROWSER_STACK_USERNAME` and `BROWSER_STACK_ACCESS_KEY` as
an environment variable, e.g.:

```bash
> BROWSER_STACK_USERNAME=[...] BROWSER_STACK_ACCESS_KEY=[...] npm t -- -b BrowserStack_Edge,BrowserStack_Safari -c
```

If you are going to change the source (`src/ckeditor.js`) file, remember about rebuilding the package. You can use `npm run develop` in order to do it automatically.

## Building the package

Build a minified version of the package that is ready to publish:

```bash
> npm run build
```

## License

Please check the LICENSE.md file.
