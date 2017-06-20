const tasks = {}

export const cancelTask = (key) => {
  const { task } = tasks[key]
  if (task) { task.cancel() }
  delete tasks[key]
}

export const createInjectSaga = (runSaga, killSaga = cancelTask) => ({ key, saga }) => {
  let { task, prevSaga } = tasks[key] || {}

  if (task && prevSaga !== saga) {
    killSaga(key)
    task = undefined
  }

  if (!task || !task.isRunning()) {
    tasks[key] = {
      task: runSaga(saga),
      prevSaga: saga
    }
  }
}
