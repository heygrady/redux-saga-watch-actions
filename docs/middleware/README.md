# Middleware

Redux saga watch actions also includes some middleware helpers. These functions are modeled after the way [`injectReducer`][src-store-reducers] works in the [react-redux-starter-kit][react-redux-starter-kit]. The idea is that you might want to run/kill a saga based on some logic, like entering and exiting a route. In the context of watch-actions, you might want to start a saga to watch for actions when you enter a route and kill that saga when you leave that route.

[src-store-reducers]: https://github.com/davezuko/react-redux-starter-kit/blob/master/src/store/reducers.js
[react-redux-starter-kit]: https://github.com/davezuko/react-redux-starter-kit

If you're trying to integrate redux-saga with an app that uses code splitting, keep reading.

## Example

You might enjoy reading an example implementation.

- [`react-redux-starter-kit`](../examples/middleware/react-redux-starter-kit.md)
- *NOTE:* This could probably be adapted to other starter kits. I would happily accept pull requests of docs for any other starter kit.

## Setup

```js
import { all } from 'redux-saga/effects'
import createSagaMiddleware from 'redux-saga'
import createSagaMiddlewareHelpers from 'redux-saga-watch-actions/lib/middleware'

// root sagas
// import { rootSaga as authSaga } from './modules/auth'

const sagaMiddleware = createSagaMiddleware()
const runSaga = saga => sagaMiddleware.run(saga)
const { injectSaga, cancelTask } = createSagaMiddlewareHelpers(runSaga) // <-- bind to sagaMiddleware.run

export const rootSaga = function * () {
  yield all([
    // remember to execute your sagas
    // authSaga()
  ])
}

export { cancelTask, injectSaga, runSaga }
export default sagaMiddleware
```

## Usage

- [`injectSaga({ key, saga })`](./injectSaga.md)
- [`cancelTask(key)`](./cancelTask.md)
