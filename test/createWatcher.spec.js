import { createWatcher } from '../src/index'

describe('Redux Saga Watch Actions', () => {
  describe('createWatcher', () => {
    it('should return a function (empty args', () => {
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
})
