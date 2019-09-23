import Task from 'data.task'
import { Identity, IO, Maybe, Either, either } from 'crocks'
import { add, curry, compose, concat, prop, map, head, toUpper, identity } from 'ramda'

const { Just, Nothing } = Maybe
const { Left, Right } = Either

describe('Functors', () => {
  // Exercise 1
  test('Use add(x,y) and map(f,x) to make a function that increments a value inside a functor.', () => {
    // ex1 :: Number -> Number
    const ex1 = identity // TODO:
    expect(ex1(Identity.of(1))).toEqual(Identity.of(2))
  })

  // Exercise 2
  test('Use head to get the first element of the list.', () => {
    const xs = Identity.of(['do', 'ray', 'me', 'fa', 'so', 'la', 'ti', 'do'])
    const ex2 = identity // TODO:
    expect(ex2(xs)).toEqual(Identity.of('do'))
  })

  // Exercise 3
  test('Use safeProp and head to find the first initial of the user.', () => {
    const safeProp = curry((x, o) => Maybe.of(o[x]))
    const user = { id: 2, name: 'Albert' }
    // ex3 :: User -> String
    const ex3 = identity // TODO:
    expect(ex3(user)).toEqual(Maybe.of('A'))
    expect(ex3({})).toEqual(Maybe.of(null))
  })

  // Exercise 4
  test('Use Maybe to rewrite ex4 without an if statement.', () => {
    const ex4 = function(n) {
      if (n) {
        return parseInt(n)
      }
    }

    // ex4 :: Number -> Maybe(Number)
    // TODO: const ex4 = identity
    expect(ex4('4')).toEqual(Maybe.of(4))
  })

  // Exercise 5
  test("Write a function that will getPost then toUpperCase the post's title.", () => {
    // getPost :: Int -> Future({id: Int, title: String})
    const getPost = i =>
      new Task((_, res) =>
        setTimeout(
          () =>
            res({
              id: i,
              title: 'Love them futures',
            }),
          300
        )
      )
    const _upperTitle = compose(
      toUpper,
      prop('title')
    )
    const ex5 = identity // TODO:
    ex5(1).fork(console.log, title => expect(title).toBe('LOVE THEM FUTURES'))
  })

  // Exercise 6
  test('Write a function that uses checkActive() and showWelcome() to grant access or return the error.', () => {
    const showWelcome = compose(
      concat('Welcome '),
      prop('name')
    )
    const checkActive = user => (user.active ? Right(user) : Left('Your account is not active'))
    // ex6 :: User -> Either String String
    const ex6 = identity // TODO:
    expect(ex6({ name: 'Flavio', active: true })).toEqual(Right('Welcome Flavio'))
    expect(ex6({ name: 'Yannick', active: false })).toEqual(Left('Your account is not active'))
  })

  // Exercise 7
  test('Write a validation function that checks for a length > 3.', () => {
    //  It should return Right(x) if it is greater than 3 and Left("You need > 3") otherwise.
    // ex7 :: String -> Either String String
    const ex7 = identity // TODO:
    expect(ex7('hello')).toEqual(Right('hello'))
    expect(ex7('fla')).toEqual(Left('You need > 3'))
  })

  // Exercise 8
  test('Use ex7 above and Either as a functor to save the user if they are valid or return the error message string.', () => {
    // Remember either's two arguments must return the same type.
    const save = x =>
      IO.of(() => {
        console.log('SAVED USER!')
        return x + '-saved'
      })
    const ex7 = x => (x.length > 3 ? Right(x) : Left('You need > 3'))
    const ex8 = identity // TODO:
    expect(ex8('flavio').run()).toBe('flavio-saved')
    expect(ex8('fla').run()).toBe('You need > 3')
  })
})
