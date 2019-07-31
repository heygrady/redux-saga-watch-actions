import { createCancelAllTasks, createCancelTask } from '../../src/middleware'

describe('Redux Saga Watch Actions', () => {
  describe('createCancelAllTasks', () => {
    it('should return a function', () => {
      const result = createCancelAllTasks()
      expect(typeof result).toBe('function')
    })
  })

  describe('cancelAllTasks', () => {
    let tasks
    let task
    let cancelTask
    let cancelAllTasks
    const key = 'test'
    const prevSaga = () => {}

    beforeEach(() => {
      tasks = {
        [key]: { task, prevSaga },
      }
      cancelTask = jest.fn()
      cancelAllTasks = createCancelAllTasks(tasks, cancelTask)
    })

    it('should return an array of results', () => {
      const result = cancelAllTasks()
      expect(Array.isArray(result)).toBe(true)
    })

    it('should return an results for each task', () => {
      const result = cancelAllTasks()
      const num = Object.keys(tasks).length
      expect(result).toHaveLength(num)
    })

    it('should call cancelTask', () => {
      cancelAllTasks()
      expect(cancelTask).toHaveBeenCalled()
    })

    it('should call cancelTask once for each task', () => {
      cancelAllTasks()
      const num = Object.keys(tasks).length
      expect(cancelTask).toHaveBeenCalledTimes(num)
    })

    it('should call cancelTask with key', () => {
      cancelAllTasks()
      expect(cancelTask).toHaveBeenCalledWith(key)
    })
  })

  describe('createCancelTask', () => {
    it('should return a function', () => {
      const result = createCancelTask()
      expect(typeof result).toBe('function')
    })
  })

  describe('cancelTask', () => {
    let tasks
    let task
    let cancelTask
    const key = 'test'
    const prevSaga = () => {}

    beforeEach(() => {
      tasks = {}
      task = {
        cancel: jest.fn(),
      }
      cancelTask = createCancelTask(tasks)
    })

    it('should return undefined (no key)', () => {
      const result = cancelTask()
      expect(result).toBeUndefined()
    })

    it('should return undefined (missing key)', () => {
      const result = cancelTask(key)
      expect(result).toBeUndefined()
    })

    it('should not call task.cancel', () => {
      tasks[key] = { task: undefined, prevSaga }
      cancelTask(key)
      expect(task.cancel).not.toBeCalled()
    })

    it('should call task.cancel', () => {
      tasks[key] = { task, prevSaga }
      cancelTask(key)
      expect(task.cancel).toBeCalled()
    })

    it('should delete task', () => {
      tasks[key] = { task, prevSaga }
      cancelTask(key)
      expect(tasks[key]).toBeUndefined()
    })
  })
})
