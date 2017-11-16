import { createWatcher, createWatchers, watchActions } from '../src/index'

describe('Redux Saga Watch Actions', () => {
  describe('createWatcher', () => {
    it('should return a generator function (empty args', () => {
      const result = createWatcher()
      expect(typeof result).toBe('function')
    })

    it('should return a generator function', () => {
      const actionType = 'ACTION'
      const saga = 'func'
      const watcher = createWatcher(actionType, saga)
      const gen = watcher()
      const result = gen.next().value
      const args = result.FORK.args
      expect(args).toEqual([actionType, saga])
    })
  })

  describe('createWatchers', () => {
    it('should return an empty array', () => {
      const result = createWatchers()
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(0)
    })

    it('should return an array of generator instances', () => {
      const actionType = 'ACTION'
      const saga = 'func'
      const result = createWatchers({
        [actionType]: saga
      })
      expect(typeof result[0].next).toBe('function')
    })
  })

  describe('watchActions', () => {
    it('should return an empty rootSaga', () => {
      const result = watchActions()
      expect(typeof result).toBe('function')
    })

    it('should return a rootSaga', () => {
      const actionType = 'ACTION'
      const saga = 'func'
      const result = watchActions({
        [actionType]: saga
      })
      expect(typeof result).toBe('function')
    })

    it('should return a rootSaga', () => {
      const actionType = 'ACTION'
      const saga = 'func'
      const rootSaga = watchActions({
        [actionType]: saga
      })
      const result = rootSaga()
      expect(typeof result.next).toBe('function')
    })

    it('should yield an all', () => {
      const actionType = 'ACTION'
      const saga = 'func'
      const rootSaga = watchActions({
        [actionType]: saga
      })
      const result = rootSaga().next().value
      expect(Array.isArray(result.ALL)).toBe(true)
    })
  })
})
