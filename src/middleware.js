import createSagaMiddleware from 'redux-saga'

const sagaMiddleware = createSagaMiddleware()
export const runSaga = saga => sagaMiddleware.run(saga)

const tasks = {}
export const injectSaga = ({ key, saga }) => {
  let { task, prevSaga } = tasks[key] || {}

  if (task && prevSaga !== saga) {
    cancelTask(key)
    task = undefined
  }

  if (!task || !task.isRunning()) {
    tasks[key] = {
      task: sagaMiddleware.run(saga),
      prevSaga: saga
    }
  }
}

export const cancelTask = (key) => {
  const { task } = tasks[key]
  if (task) { task.cancel() }
  delete tasks[key]
}

export default sagaMiddleware
