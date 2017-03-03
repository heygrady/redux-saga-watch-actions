# Middleware

This package also includes some boilerplate functions that's helpful for initializing `sagaMiddleware` in an application. It is modeled after the way [`src/store/reducers.js`][src-store-reducers] works in the [react-redux-starter-kit][react-redux-starter-kit].

[src-store-reducers]: https://github.com/davezuko/react-redux-starter-kit/blob/master/src/store/reducers.js
[react-redux-starter-kit]: https://github.com/davezuko/react-redux-starter-kit

*NOTE:* If you need to pass advanced options to [`createSagaMiddleware`](https://redux-saga.github.io/redux-saga/docs/api/index.html#createsagamiddlewareoptions) this may not be for you.

If you're trying to integrate redux-saga with `react-redux-starter-kit`, keep reading.

## Example

You might enjoy reading an example implementation.

- [`react-redux-starter-kit`](../examples/middleware/react-redux-starter-kit.md)
- *NOTE:* This could probably be adapted to other starter kits. I would happily accept pull requests of docs for any other starter kit.

## Usage

- [`injectSaga({ key, saga })`](./injectSaga.md)
- [`cancelTask(key)`](./cancelTask.md)
- [`runSaga(saga)`](./runSaga.md)
- [`sagaMiddleware`](./sagaMiddleware.md)
