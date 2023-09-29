import { curry, split, map, filter, reduce, test } from 'ramda'

describe('Curry 🍛', () => {
  // Exercise 1
  it('Refactor to remove all arguments by partially applying the function.', () => {
    // words :: String -> [String]
    const words = split(' ')
    expect(words('Jingle bells Batman smells')).toEqual(['Jingle', 'bells', 'Batman', 'smells'])

    // Exercise 1a
    // Use map to make a new words fn that works on an array of strings.
    // sentences :: [String] -> [[String]]
    const sentences = map(words)
    expect(sentences(['Jingle bells Batman smells', 'Robin laid an egg'])).toEqual([
      ['Jingle', 'bells', 'Batman', 'smells'],
      ['Robin', 'laid', 'an', 'egg'],
    ])
  })

  // Exercise 2
  it('Refactor to remove all arguments by partially applying the functions.', () => {
    // filterQs :: [String] -> [String]
    const filterQs = filter(test(/q/i))
    expect(filterQs(['quick', 'camels', 'quarry', 'over', 'quails'])).toEqual([
      'quick',
      'quarry',
      'quails',
    ])
  })

  // Exercise 3
  it('Use the helper function _keepHighest to refactor max to not reference any arguments.', () => {
    // LEAVE BE:
    const _keepHighest = (x, y) => (x >= y ? x : y)
    // max :: [Number] -> Number
    const max = reduce((acc, x) => (x >= acc ? x : acc), -Infinity)
    expect(max([323, 523, 554, 123, 5234])).toBe(5234)
  })

  // Bonus 1
  it("Wrap array's slice to be functional and curried.", () => {
    // [1, 2, 3].slice(0, 2)
    const slice = curry((start, end, xs) => xs.slice(start, end))
    expect(slice(1)(3)(['a', 'b', 'c'])).toEqual(['b', 'c'])

    // Bonus 2
    // Use slice to define a function "take" that returns n elements from the beginning of an array.
    // Make it curried. For ['a', 'b', 'c'] with n=2 it should return ['a', 'b'].
    const take = slice(0)
    expect(take(2)(['a', 'b', 'c'])).toEqual(['a', 'b'])
  })
})
