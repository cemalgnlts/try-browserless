# Try Browserless

> Playground for [Puppeteer](https://pptr.dev/). Run scripts, preview live, share with others.

This project is inspired by the [browserless/debugger](https://github.com/browserless/debugger) project. If your only use is debugging, [browserless/debugger](https://github.com/browserless/debugger) might be a better option.

This project works with [browserless.io](https://www.browserless.io).

## Coding Environment

Your code runs inside a Worker. Using the latest version `14.3.0` of `puppeteer-core` which supports the web version.

To make it easier for you, the browser is opened first, then the page is created and the `page` class is given to you, and the browser is automatically closed when your code is complete.

The following example occurs when you first open the page:
```js
await page.goto("https://browserless.io")

const title = await page.title()

console.log(title)
```

When you press the Run button, it turns into this:
```diff
+ const browser = await puppeteer.launch();
+ const page = await browser.newPage();

await page.goto("https://browserless.io");
const title = await page.title();
console.log(title);

+ await browser.close();
```

It uses monaco editor as editor. This way it includes autocomplete support for puppeteer.

There are a few snippets in the editor. Type the abbreviation and select it with `tab`, `enter` or `mouse`.

`log` ➜ `console.log`

`go` ➜ `page.goto`

`ev` ➜ `page.evaluate`

`ss` ➜ `page.screenshot`

From the options menu you can simulate a device and preview your operation live.

## Contributing

[Contributing](CONTRIBUTING.md)

## License

[License](LICENSE)