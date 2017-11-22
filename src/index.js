import { all, fork, take, takeEvery } from 'redux-saga/effects'

export const combineSagas = (...sagas) => function * (...args) {
  yield all(sagas.map(saga => fork(saga, ...args)))
}

export const watchNextAction = (actionType, saga) => function * (...args) {
  const action = yield take(actionType)
  if (typeof saga === 'function') {
    yield fork(saga, ...args.concat(action))
  }
}

export const createWatcher = (actionType, saga) => function * (...args) {
  yield takeEvery(actionType, saga, ...args)
}

export const watchActions = (sagaMap = {}) => function * (...args) {
  yield all(Object.keys(sagaMap).map(actionType =>
    createWatcher(actionType, sagaMap[actionType])(...args)
  ))
}

export default watchActions
