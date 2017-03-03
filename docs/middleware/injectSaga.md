# Middleware : injectSaga

### `injectSaga({ key, saga })`

Used for injecting a saga in a lazy-loaded route.

#### Importing

```js
import { injectSaga } from 'redux-saga-watch-actions/lib/middleware'
```

#### Example

```js
import { injectSaga } from 'redux-saga-watch-actions/lib/middleware'

export default (store) => ({
  path : 'counter',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const Counter = require('./containers/CounterContainer').default
      const saga = require('./modules/counter').rootSaga

      injectSaga({ key: 'counter', saga })

      cb(null, Counter)
    }, 'counter')
  }
})

```
