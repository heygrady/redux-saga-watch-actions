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
      const saga = combineSagas(a, b, c)
      const gen = saga()
      const result = gen.next().value
      expect(result.ALL.length).toBe(3)
    })

    it('should fork each saga', () => {
      const a = jest.fn()
      const b = jest.fn()
      const saga = combineSagas(a, b)
      const gen = saga()
      const result = gen.next().value
      expect(result.ALL[0].FORK.fn).toBe(a)
      expect(result.ALL[1].FORK.fn).toBe(b)
    })

    it('should fork each saga with same args', () => {
      const a = jest.fn()
      const b = jest.fn()
      const saga = combineSagas(a, b)
      const args = [true, false]
      const gen = saga(...args)
      const result = gen.next().value
      expect(result.ALL[0].FORK.args).toEqual(args)
      expect(result.ALL[1].FORK.args).toEqual(args)
    })
  })
})
