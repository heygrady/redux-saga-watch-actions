# Middleware : injectSaga

### `injectSaga({ key, saga })`

Used for injecting a saga in a lazy-loaded route. Below you can see an example where we run a saga by "injecting" it. The terminology is borrowed from the [`injectReducer`][src-store-reducers] function found in the [react-redux-starter-kit][react-redux-starter-kit]. The benefit of injecting a saga this way is that you can avoid issues that arise when you attempt to run a saga in a callback. While [`runSaga`][run-saga] will faithfully run your saga over and over, `injectSaga` attempts to keep only one version of your saga running at a time.

[src-store-reducers]: https://github.com/davezuko/react-redux-starter-kit/blob/master/src/store/reducers.js
[react-redux-starter-kit]: https://github.com/davezuko/react-redux-starter-kit
[run-saga]: https://github.com/redux-saga/redux-saga/tree/master/docs/api#middlewarerunsaga-args

- `key` &mdash; any value that can be used as an [object key](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects#Objects_and_properties)
- `saga` &mdash; any value that can be passed to `runSaga`
- `args` &mdash; optional, used like `runSaga(saga, ...args)`

```js
import { injectSaga } from './store/sagas' // <-- you need to create your own

const key = 'anything' // <-- used to avoid duplicated sagas
const saga = function*() {} // <-- any generator will do

const task = injectSaga({ key, saga }) // <-- returns a task, like runSaga

task.cancel() // <-- just like cancelTask(key)
```

## Setup

We need to initialize the helpers using `createSagaMiddlewareHelpers`, which expects to receive a `runSaga` function and returns an object containing an `injectSaga` and `cancelTask` function.

```js
// in store/sagas.js

import createSagaMiddleware from 'redux-saga'
import createSagaMiddlewareHelpers from 'redux-saga-watch-actions/lib/middleware'

const sagaMiddleware = createSagaMiddleware()
const runSaga = (saga) => sagaMiddleware.run(saga)
const { injectSaga, cancelTask } = createSagaMiddlewareHelpers(runSaga) // <-- bind to sagaMiddleware.run

export { cancelTask, injectSaga, runSaga }
export default sagaMiddleware
```

## Example

Below you can see a classic react-router 3 route. The route below uses webpack's code-splitting features.

**NOTE:** Example of code-splitting with react-router 4 is forthcoming.

```js
import { injectSaga } from './store/sagas' // <-- grab our inject function

export default () => ({
  path: 'counter',
  getComponent(nextState, cb) {
    require.ensure(
      [],
      (require) => {
        const CounterContainer = require('./containers/CounterContainer')
          .default
        const saga = require('./modules/counter').rootSaga // <-- grab our lazy-loaded saga

        injectSaga({ key: 'counter', saga }) // <-- run the saga

        cb(null, CounterContainer)
      },
      'counter'
    )
  },
})
```
