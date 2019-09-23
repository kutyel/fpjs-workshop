import path from 'path'
import { either, IO, Maybe, Either, Task } from 'crocks'
import { chain, curry, compose, identity, prop, split, last, map } from 'ramda'

const { Just, Nothing } = Maybe
const { Left, Right } = Either

describe('Monads', () => {
  // Exercise 1
  test('Use safeProp and map/join or chain to safely get the street name when given a user.', () => {
    const safeProp = curry((x, o) => Maybe.of(o[x]))
    const user = {
      id: 2,
      name: 'albert',
      address: {
        street: {
          number: 22,
          name: 'Walnut St',
        },
      },
    }
    const ex1 = identity // TODO:
    expect(ex1({})).toEqual(Maybe.of(null))
    expect(ex1(user)).toEqual(Maybe.of('Walnut St'))
  })

  // Exercise 2
  test("Use getFile to get the filename, remove the directory so it's just the file, then purely log it.", () => {
    const getFile = () => IO.of(() => __filename)
    const pureLog = x =>
      IO.of(() => {
        console.log(x)
        return `logged ${x}`
      })
    const ex2 = identity // TODO:
    expect(ex2().run()).toBe('logged monads.js')
  })

  // Exercise 3
  test("Use getPost() then pass the post's id to getComments().", () => {
    const getPost = i =>
      new Task((rej, res) => setTimeout(() => res({ id: i, title: 'Love them tasks' }), 300))
    const getComments = i =>
      new Task((rej, res) =>
        setTimeout(
          () =>
            res([
              { post_id: i, body: 'This book should be illegal' },
              { post_id: i, body: 'Monads are like smelly shallots' },
            ]),
          300
        )
      )
    const ex3 = identity // TODO:
    ex3(13).fork(console.log, res => {
      expect(res.map(prop('post_id'))).toEqual([13, 13])
      expect(res.map(prop('body'))).toEqual([
        'This book should be illegal',
        'Monads are like smelly shallots',
      ])
    })
  })

  // Exercise 4
  test("Use validateEmail, addToMailingList, and emailBlast to implement ex4's type signature.", () => {
    //  addToMailingList :: Email -> IO([Email])
    const addToMailingList = (list => email => IO.of(() => [...list, email]))([])
    const emailBlast = list => IO.of(() => `emailed: ${list.join(',')}`)
    const validateEmail = x => (x.match(/\S+@\S+\.\S+/) ? new Right(x) : new Left('invalid email'))
    //  ex4 :: Email -> Either String (IO String)
    const ex4 = identity // TODO:
    const getResult = identity // TODO:
    expect(getResult(ex4('notanemail'))).toBe('invalid email')
    expect(getResult(ex4('flaviocorpa@gmail.com'))).toBe('emailed: flaviocorpa@gmail.com')
  })
})
