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
      expect(result.payload).toHaveLength(0)
    })

    it('should return a task for each saga', () => {
      const a = jest.fn()
      const b = jest.fn()
      const c = jest.fn()
      const saga = combineSagas(a, b, c)
      const gen = saga()
      const result = gen.next().value
      expect(result.payload).toHaveLength(3)
    })

    it('should fork each saga', () => {
      const a = jest.fn()
      const b = jest.fn()
      const saga = combineSagas(a, b)
      const gen = saga()
      const result = gen.next().value
      expect(result.payload[0].payload.fn).toBe(a)
      expect(result.payload[1].payload.fn).toBe(b)
    })

    it('should fork each saga with same args', () => {
      const a = jest.fn()
      const b = jest.fn()
      const saga = combineSagas(a, b)
      const args = [true, false]
      const gen = saga(...args)
      const result = gen.next().value
      expect(result.payload[0].payload.args).toEqual(args)
      expect(result.payload[1].payload.args).toEqual(args)
    })
  })
})
