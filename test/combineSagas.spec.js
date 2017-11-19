import { combineSagas } from '../src/index'

describe('Redux Saga Watch Actions', () => {
  describe('combineSagas', () => {
    it('should return a function (empty args', () => {
      const result = combineSagas()
      expect(typeof result).toBe('function')
    })

    it('should return a generator function', () => {
      const saga = combineSagas()
      const gen = saga()
      const result = gen.next().value
      expect(result.ALL.length).toBe(0)
    })

    it('should return a task for each saga', () => {
      const a = jest.fn()
      const b = jest.fn()
      const c = jest.fn()
      const saga = combineSagas([a, b, c])
      const gen = saga()
      const result = gen.next().value
      expect(result.ALL.length).toBe(3)
    })

    it('should call each saga', () => {
      const a = jest.fn()
      const b = jest.fn()
      const saga = combineSagas([a, b])
      const gen = saga()
      gen.next()
      expect(a).toHaveBeenCalled()
      expect(b).toHaveBeenCalled()
    })

    it('should call each saga with same args', () => {
      const a = jest.fn()
      const b = jest.fn()
      const saga = combineSagas([a, b])
      const args = [true, false]
      const gen = saga(...args)
      gen.next()
      expect(a).toHaveBeenCalledWith(...args)
      expect(b).toHaveBeenCalledWith(...args)
    })
  })
})
