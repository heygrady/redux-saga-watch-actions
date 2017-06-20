# react-redux-starter-kit

This example showcases using the included [middleware](../../middleware/README.md) with the [react-redux-starter-kit](https://github.com/davezuko/react-redux-starter-kit).

This example presumes you're trying to manage sagas similarly to [the way reducers are managed for routes](https://github.com/davezuko/react-redux-starter-kit/blob/master/src/routes/Counter/index.js). At a high level, we're going to cover injecting a saga when a route is loaded. In the starter-kit, routes are lazy-loaded using Webpack's code-splitting features.

### Create a `src/store/sagas.js` file
The react-redux-starter-kit already includes a [`src/store/reducers.js`](https://github.com/davezuko/react-redux-starter-kit/blob/master/src/store/reducers.js) file for injecting reducers into your application. Behind the scenes, `injectReducer` will add a reducer to the store when a route has loaded. The idea here is to mimic that functionality for injecting sagas. To do this we'll expose an `injectSaga` method that would be using within a route to manage lazy-loaded sagas. Again, this is similar to the way that reducers are managed for routes in the starter-kit.

```js
// src/store/sagas.js
import createSagaMiddleware from 'redux-saga'
import { createInjectSaga, cancelTask } from 'redux-saga-watch-actions/lib/middleware'
import { all } from 'redux-saga/effects'

// you might want to import sagas that run outside of a route
import { rootSaga as somethingSaga } from '../modules/something'

const sagaMiddleware = createSagaMiddleware()
export const runSaga = saga => sagaMiddleware.run(saga)
export const injectSaga = createInjectSaga(runSaga, cancelTask)
export const killSaga = cancelTask

export const rootSaga = function * () {
  yield all([
    somethingSaga()
  ])
}

export default sagaMiddleware

```

### Configure middleware, run saga in `src/store/createStore.js`
The react-redux-starter-kit already includes a [`src/store/createStore.js`](https://github.com/davezuko/react-redux-starter-kit/blob/master/src/store/createStore.js) file for initializing the main redux store for the application. Out of the box it includes redux-thunk. We need to make some minor changes to that file to add our `sagaMiddleware` and run our `rootSaga`.

```js
// src/store/createStore.js
// truncated for brevity
// NOTE: createStore.js may change frequently in the starter-kit, these instructions will drift out of date.
// @see https://github.com/davezuko/react-redux-starter-kit/blob/master/src/store/createStore.js

// grab the middleware and rootSaga
import saga, { runSaga, rootSaga } from './sagas'

export default (initialState = {}) => {
  // ...

  // add saga middleware to the list
  const middleware = [thunk, saga]

  //...

  // make sure to run our rootSaga
  store.runSaga = rootSaga
  runSaga(rootSaga)

  return store
}
```

### Inject a saga from a route
The react-redux-starter-kit already makes it easy to "inject a reducer" in "async routes." Under the hood, the starter-kit is using Webpack's [`require.ensure`](https://webpack.github.io/docs/code-splitting.html) to code-split based on routes. Because the route may not be loaded right away, they provided a mechanism for adding a reducer on-demand, when the route loads. They call this `injectReducer`.

We're providing the same functionality and calling it `injectSaga`. Sagas actually work a little differently from reducers, which makes this much easier to manage. By providing a similar interface this should make it easy to manage sagas as easily as we manage reducers.

Let's extend [the default Counter route](https://github.com/davezuko/react-redux-starter-kit/blob/master/src/routes/Counter/index.js) included in the starter-kit.

```js
// src/routes/Counter/index.js
// @see https://github.com/davezuko/react-redux-starter-kit/blob/master/src/routes/Counter/index.js
import { injectReducer } from '../../store/reducers'
import { injectSaga } from '../../store/sagas'

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

### Add a saga to our module
To help make this more clear, we'll add a saga to [the example counter module](https://github.com/davezuko/react-redux-starter-kit/blob/master/src/routes/Counter/modules/counter.js) included in the starter-kit.

The example below is a little awkward because it's a contrived example. In a real application I would recommend using [`redux-actions`](https://github.com/acdlite/redux-actions) to create action creators and reducers that handle those actions. For the sake of clarity, we're trying to leave the example from the starter-kit in place.

```js
// src/routes/Counter/modules/counter.js
// truncated for brevity
// @see https://github.com/davezuko/react-redux-starter-kit/blob/master/src/routes/Counter/modules/counter.js
import { watchActions } from 'redux-saga-watch-actions'
import { put } from 'redux-saga/effects'

// ...

// let's make a new action type
// this is a contrived example, we're creating an ASYNC action just to show the saga working
export const COUNTER_SQUARE_ASYNC = 'COUNTER_SQUARE_ASYNC'
const COUNTER_SQUARE = 'COUNTER_SQUARE' // <-- not exported, because we're just fooling around here

// we need an action
// dispatching this action will trigger the saga
export const square = () => ({ type: COUNTER_SQUARE_ASYNC })

// and we need a saga
export const squareSaga = function * (action) {
  // our saga doesn't do much beyond dispatching another action
  // it's a good idea use different actions for our sagas and reducers
  // hopefully your saga is more useful than this
  yield put({ type: COUNTER_SQUARE })
}

// we can export our root saga as a watcher
export const rootSaga = watchActions({
  [COUNTER_SQUARE_ASYNC]: squareSaga
})

// to complete the example we'll extend the exiting reducer
// NOTE: consider using handleActions instead
// @see https://github.com/acdlite/redux-actions#handleactionsreducermap-defaultstate
const ACTION_HANDLERS = {
  [COUNTER_INCREMENT]    : (state, action) => state + action.payload,
  [COUNTER_DOUBLE_ASYNC] : (state, action) => state * 2,

  // we're listening to a *different* action in the reducer vs the saga
  // sagas and reducers both receive dispatched actions
  // if you replaced this with COUNTER_SQUARE_ASYNC the saga would be useless
  [COUNTER_SQUARE]: (state, action) => state * state
}

const initialState = 0
export default function counterReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
```
