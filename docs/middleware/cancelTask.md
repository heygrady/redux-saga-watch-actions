# Middleware : cancelTask

### `cancelTask(key)`

Used internally by `injectSaga` to cancel a previously running saga. You could also use it to cancel a saga when leaving a route. You usually don't need to cancel sagas yourself.

- `key` &mdash; any value that can be used as an [object key](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects#Objects_and_properties)

```js
import { injectSaga, cancelTask } from './store/sagas' // <-- you need to create your own

const key = 'anything' // <-- used to avoid duplicated sagas
const saga = function*() {} // <-- any generator will do

const task = injectSaga({ key, saga })

cancelTask(key) // <-- cancels the task

// or do it manually
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
import { injectSaga, cancelTask } from './store/sagas'

export default () => ({
  path: 'counter',
  getComponent(nextState, cb) {
    require.ensure(
      [],
      (require) => {
        const CounterContainer = require('./containers/CounterContainer')
          .default
        const saga = require('./modules/counter').rootSaga

        injectSaga({ key: 'counter', saga })

        cb(null, CounterContainer)
      },
      'counter'
    )
  },
  onLeave(prevState) {
    cancelTask('counter') // <-- on leave, cancel task
  },
})
```
