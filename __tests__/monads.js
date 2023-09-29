import { sep } from 'path'
import { Async, IO, Maybe, Either, either, getProp } from 'crocks'
import { always, chain, pipe, identity, prop, split, last, map } from 'ramda'

const { Just, Nothing } = Maybe
const { Left, Right } = Either

describe('Monads', () => {
  // Exercise 1 ✅
  test('Use getProp and map/join or chain to safely get the street name when given a user.', () => {
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
    // getStreetName :: User -> Maybe String
    const getStreetName = pipe(getProp('address'), chain(getProp('street')), chain(getProp('name')))
    expect(getStreetName().equals(Nothing())).toBeTruthy()
    expect(getStreetName({}).equals(Nothing())).toBeTruthy()
    expect(getStreetName(user).equals(Just('Walnut St'))).toBeTruthy()
  })

  // Exercise 2 🤔
  test("Use getFile to get the filename, remove the directory so it's just the file, then purely log it.", () => {
    // getFile :: IO String
    const getFile = always(IO.of(__filename))
    // pureLog :: String -> IO ()
    const pureLog = (str) => IO.of(() => console.log(str))

    // logFilename :: IO ()
    const logFilename = pipe(getFile, chain(pipe(split(sep), last, pureLog)))
    logFilename().run((res) => expect(res).toBe('logged monads.js'))
  })

  // Exercise 3 ✅
  test("Use getPost() then pass the post's id to getComments().", () => {
    const getPost = (id) =>
      Async((_, res) => setTimeout(() => res({ id, title: 'Love them tasks' }), 300))
    const getComments = (post_id) =>
      Async((_, res) =>
        setTimeout(
          () =>
            res([
              { post_id, body: 'This book should be illegal' },
              { post_id, body: 'Monads are like smelly shallots' },
            ]),
          300
        )
      )
    // getCommentsFromPost :: Int -> [Comments]
    const getCommentsFromPost = pipe(getPost, chain(pipe(prop('id'), getComments)))
    getCommentsFromPost(13).fork(console.log, (res) => {
      expect(map(prop('post_id'), res)).toEqual([13, 13])
      expect(map(prop('body'), res)).toEqual([
        'This book should be illegal',
        'Monads are like smelly shallots',
      ])
    })
  })

  // Exercise 4 🤔
  test("Use validateEmail, addToMailingList, and emailBlast to implement ex4's type signature.", () => {
    //  addToMailingList :: Email -> IO([Email])
    const addToMailingList = (
      (list) => (email) =>
        IO.of(() => [...list, email])
    )([])
    // emailBlast :: [Email] -> IO ()
    const emailBlast = (list) => IO.of(() => `emailed: ${list.join(',')}`)
    // validateEmail :: Email -> Either String Email
    const validateEmail = (x) => (x.match(/\S+@\S+\.\S+/) ? Right(x) : Left('invalid email'))
    // joinMailingList :: Email -> Either String (IO ())
    const joinMailingList = pipe(
      validateEmail,
      either(identity, pipe(addToMailingList, chain(emailBlast)))
    )
    expect(joinMailingList('notanemail')).toBe('invalid email')
    joinMailingList('flaviocorpa@gmail.com').run((res) =>
      expect(res).toBe('emailed: flaviocorpa@gmail.com')
    )
  })
})
