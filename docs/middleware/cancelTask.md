# Middleware: cancelTask

### `cancelTask(key)`

Used internally by injectSaga to cancel a previously running saga. You could also use it to cancel a saga when leaving a route. You usually don't need to cancel sagas yourself.

#### Importing

```js
import { cancelTask } from 'redux-saga-watch-actions/lib/middleware'
```

#### Example

```js
import { injectSaga, cancelTask } from 'redux-saga-watch-actions/lib/middleware'

export default (store) => ({
  path : 'counter',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const Counter = require('./containers/CounterContainer').default
      const saga = require('./modules/counter').rootSaga

      injectSaga({ key: 'counter', saga })

      cb(null, Counter)
    }, 'counter')
  },
  onLeave (prevState) {
    cancelTask('counter')
  }
})

```
