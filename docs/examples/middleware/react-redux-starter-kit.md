# react-redux-starter-kit

This example showcases using the included [middleware](../../middleware/README.md) with the [react-redux-starter-kit](https://github.com/davezuko/react-redux-starter-kit).

**NOTE:** react-redux-starter-kit is no longer maintained but the basics should apply to any redux app.

This example presumes you're trying to manage sagas similarly to [the way reducers are managed](https://github.com/davezuko/react-redux-starter-kit/blob/master/src/routes/Counter/index.js) in the starter-kit. At a high level, we're going to cover injecting a saga when a route is loaded. In the starter-kit, routes are lazy-loaded using Webpack's code-splitting features.

## Initial setup

### Create a `src/store/sagas.js` file
The react-redux-starter-kit already includes a [`src/store/reducers.js`](https://github.com/davezuko/react-redux-starter-kit/blob/master/src/store/reducers.js) file for injecting reducers into your application. Behind the scenes, `injectReducer` will add a reducer to the store when a route has loaded. The idea here is to mimic that functionality for injecting sagas. To do this we'll expose an `injectSaga` method that would be using within a route to manage lazy-loaded sagas. Again, this is similar to the way that reducers are managed for routes in the starter-kit.

```js
// src/store/sagas.js
import { all } from 'redux-saga/effects'
import createSagaMiddleware from 'redux-saga'
import createSagaMiddlewareHelpers from 'redux-saga-watch-actions/lib/middleware'

// root sagas
import { rootSaga as somethingSaga } from './modules/something'

const sagaMiddleware = createSagaMiddleware()
const runSaga = saga => sagaMiddleware.run(saga)
const { injectSaga, cancelTask } = createSagaMiddlewareHelpers(runSaga) // <-- bind to sagaMiddleware.run

export const rootSaga = function * () {
  yield all([
    // remember to execute your sagas
    somethingSaga()
  ])
}

export { cancelTask, injectSaga, runSaga }
export default sagaMiddleware
```

### Configure middleware, run saga in `src/store/createStore.js`
The react-redux-starter-kit already includes a [`src/store/createStore.js`](https://github.com/davezuko/react-redux-starter-kit/blob/master/src/store/createStore.js) file for initializing the main redux store for the application. Out of the box, it includes redux-thunk middleware. We need to make some minor changes to that file to add our `sagaMiddleware` and run our `rootSaga`.

```js
// src/store/createStore.js (truncated for brevity)

// NOTE: createStore.js may change frequently in the starter-kit
// @see https://github.com/davezuko/react-redux-starter-kit/blob/master/src/store/createStore.js

// grab the middleware and rootSaga
import saga, { rootSaga, runSaga } from './sagas'

export default (initialState = {}) => {
  // ...

  const middleware = [thunk, saga] // <-- add saga middleware to the list

  // ...
  const store = createReduxStore(
    // ...
  )

  store.runSaga = runSaga // <-- add runSaga to the store
  runSaga(rootSaga) // <-- run our saga

  return store
}
```

## Using `injectSaga`

### Inject a saga from a route
The react-redux-starter-kit already makes it easy to "inject a reducer" in "async routes." Under the hood, the starter-kit is using Webpack's [`require.ensure`](https://webpack.github.io/docs/code-splitting.html) to code-split based on routes. Because the route may not be loaded right away, they provided a mechanism for adding a reducer when the route loads. They call this `injectReducer`.

We're providing the same functionality and calling it `injectSaga`. Sagas actually work a little differently from reducers, which makes this much easier to manage.

Let's extend [the default Counter route](https://github.com/davezuko/react-redux-starter-kit/blob/master/src/routes/Counter/index.js) included in the starter-kit.

```js
// src/routes/Counter/index.js
// @see https://github.com/davezuko/react-redux-starter-kit/blob/master/src/routes/Counter/index.js

import { injectReducer } from '../../store/reducers'
import { injectSaga } from '../../store/sagas' // <-- we created this above

export default (store) => ({
  path : 'counter',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const Counter = require('./containers/CounterContainer').default

      // we need to grab the reducer and the saga from our module
      const { default: reducer, rootSaga: saga } = require('./modules/counter')

      injectReducer(store, { key: 'counter', reducer })

      // we need to inject our saga
      injectSaga({ key: 'counter', saga })

      cb(null, Counter)
    }, 'counter')
  }
})
```

## Using `watchActions`

### Add a saga to our module
To help make this more clear, we'll add a saga to [the example counter module](https://github.com/davezuko/react-redux-starter-kit/blob/master/src/routes/Counter/modules/counter.js) included in the starter-kit.

The example below is a little awkward because it's a contrived example. In a real application I would recommend using [`redux-actions`](https://github.com/acdlite/redux-actions) to create action creators and reducers that handle those actions. For the sake of clarity, we're trying to leave the example from the starter-kit in place.

```js
// src/routes/Counter/modules/counter.js (truncated for brevity)
// @see https://github.com/davezuko/react-redux-starter-kit/blob/master/src/routes/Counter/modules/counter.js

import { watchActions } from 'redux-saga-watch-actions'
import { delay, put } from 'redux-saga/effects'

// ...

// let's make a new action type
export const COUNTER_SQUARE_ASYNC = 'COUNTER_SQUARE_ASYNC'
export const COUNTER_SQUARE_STARTED = 'COUNTER_SQUARE_STARTED'
export const COUNTER_SQUARE_DONE = 'COUNTER_SQUARE_DONE'

// we need an action
export const square = () => ({ type: COUNTER_SQUARE_ASYNC })
export const squareStarted = () => ({ type: COUNTER_SQUARE_STARTED })
export const squareDone = (payload) => ({ type: COUNTER_SQUARE_DONE, payload })

// and we need a saga
export const squareSaga = function * (action) {
  yield put(squareStarted()) // <-- useful for loading indicators
  const payload = yield delay(200) // <-- fake waiting for server
  yield put(squareDone(payload)) // <-- send your payload to your reducer
}

// we can export our root saga as a watcher
export const rootSaga = watchActions({
  [COUNTER_SQUARE_ASYNC]: squareSaga
})

// to complete the example we'll extend the reducer
const ACTION_HANDLERS = {
  [COUNTER_INCREMENT]    : (state, action) => state + action.payload,
  [COUNTER_DOUBLE_ASYNC] : (state, action) => state * 2,

  // dispatched from the saga
  [COUNTER_SQUARE_DONE]: (state, action) => state * state
}

const initialState = 0
export default function counterReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
```
