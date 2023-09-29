import { Async, Maybe, IO, liftA2 } from 'crocks'
import { add, curry, reduce, identity } from 'ramda'

const { Just, Nothing } = Maybe

// TEST HELPERS
// =====================

const getPost = (id) =>
  Async((_, res) => setTimeout(() => res({ id, title: 'Love them futures' }), 300))

const getComments = (i) =>
  Async((_, res) =>
    setTimeout(() => res(['This book should be illegal', 'Monads are like space burritos']), 300)
  )

describe('Applicative Functors', () => {
  // Exercise 1 ✅
  test('Write a function that adds two possibly null numbers together using Maybe and ap().', () => {
    // safeAdd :: Maybe Number -> Maybe Number -> Maybe Number
    const safeAdd = (x, y) => Maybe(add).ap(Maybe(x)).ap(Maybe(y))
    expect(safeAdd(2, 3).equals(Maybe(5))).toBeTruthy()
    expect(safeAdd(null, 3).equals(Maybe(3))).toBeTruthy()
  })

  // Exercise 2 ✅
  test("Now write a function that takes 2 Maybe's and adds them. Use liftA2 instead of ap().", () => {
    // safeAdd :: Maybe Number -> Maybe Number -> Maybe Number
    const safeAdd = liftA2(add)
    expect(safeAdd(Maybe(2), Maybe(3)).equals(Maybe(5))).toBeTruthy()
    expect(safeAdd(Nothing(), Maybe(3)).equals(Nothing())).toBeTruthy()
  })

  // Exercise 3 ✅
  test('Run both getPost(n) and getComments(n) then render the page with both. (The n arg is arbitrary.)', () => {
    const makeComments = reduce((acc, c) => `${acc}<li>${c}</li>`, '')
    const render = curry(({ title }, cs) => `<div>${title}</div>${makeComments(cs)}`)
    // renderDOM :: Async Error HTML
    const renderDOM = liftA2(render, getPost(2), getComments(2))
    renderDOM.fork(console.error, (html) =>
      expect(html).toBe(
        '<div>Love them futures</div><li>This book should be illegal</li><li>Monads are like space burritos</li>'
      )
    )
  })

  // Exercise 4 ✅
  test('Write an IO that gets both player1 and player2 from the cache and starts the game.', () => {
    const localStorage = {
      player1: 'toby',
      player2: 'sally',
    }
    // getFromCache :: String -> IO User
    const getFromCache = (x) => IO.of(() => localStorage[x])
    // game :: User -> User -> String
    const game = curry((p1, p2) => `${p1} vs ${p2}`)
    // startGame :: IO String
    const startGame = liftA2(game, getFromCache('player1'), getFromCache('player2'))
    startGame.run((res) => expect(res).toBe('toby vs sally'))
  })
})
