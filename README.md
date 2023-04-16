# Try Browserless

> Playground for [Puppeteer](https://pptr.dev/). Run scripts, preview live, share with others.

This project is inspired by the [browserless/debugger](https://github.com/browserless/debugger) project. If your only use is debugging, [browserless/debugger](https://github.com/browserless/debugger) might be a better option.

The project works through [Browserless.io](https://www.browserless.io).

The main components of the project are:

/frontend - Client side app, made with react and bundled using Vite.
/backend - Express server that stores data and files using Deta Base / Deta Drive.
Spacefile - configuration for deploying this app to [Deta Space](https://deta.space)

## Development

1. Install and setup [Space CLI](https://deta.space/docs/en/basics/cli)
2. Create a new Space project:

```bash
space new
```

2. Install frontend and backend dependencies together:

```bash
npm run install
```

3. Start app in development mode:

```bash
space dev
```

This will start both the frontend and backend Micros, connect them to your projects development data and emulate the Space routing.

## License

[LICENSE](./LICENSE)
