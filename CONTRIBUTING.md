# Contributing

The main components of the project are:

/frontend - Client side app, made with react and bundled using Vite.

/backend - Express server that stores data and files using Deta Base / Deta Drive.

Spacefile - configuration for deploying this app to [Deta Space](https://deta.space)

## Front End

1. Install frontend dependencies:

```bash
npm run install:frontend
```
2. Start app in development mode:

```bash
npm run dev:frontend
```


## Frontend and Backend

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
npm run dev
```

This will start both the frontend and backend Micros, connect them to your projects development data and emulate the Space routing.
