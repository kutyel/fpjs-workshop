import { sep } from 'path'
import { Async, IO, Maybe, Either, either, getProp } from 'crocks'
import { chain, compose, identity, prop, split, last, map } from 'ramda'

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
    const getStreetName = compose(
      chain(getProp('name')),
      chain(getProp('street')),
      getProp('address')
    )
    expect(getStreetName().equals(Nothing())).toBeTruthy()
    expect(getStreetName({}).equals(Nothing())).toBeTruthy()
    expect(getStreetName(user).equals(Maybe('Walnut St'))).toBeTruthy()
  })

  // Exercise 2 🤔
  test("Use getFile to get the filename, remove the directory so it's just the file, then purely log it.", () => {
    // getFile :: IO String
    const getFile = () => IO.of(__filename)
    // pureLog :: String -> IO ()
    const pureLog = x => IO.of(`logged ${x}`)
    // logFilename :: IO String
    const logFilename = compose(
      chain(
        compose(
          pureLog,
          last,
          split(sep)
        )
      ),
      getFile
    )
    logFilename().run(succ => expect(succ).toBe('logged monads.js'))
  })

  // Exercise 3 ✅
  test("Use getPost() then pass the post's id to getComments().", () => {
    const getPost = id =>
      Async((_, res) => setTimeout(() => res({ id, title: 'Love them tasks' }), 300))
    const getComments = post_id =>
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
    // getCommentsFromPost :: Int -> Async [Comments]
    const getCommentsFromPost = compose(
      chain(
        compose(
          getComments,
          prop('id')
        )
      ),
      getPost
    )
    getCommentsFromPost(13).fork(console.error, res => {
      expect(map(prop('post_id'), res)).toEqual([13, 13])
      expect(map(prop('body'), res)).toEqual([
        'This book should be illegal',
        'Monads are like smelly shallots',
      ])
    })
  })

  // Exercise 4 ✅
  test("Use validateEmail, addToMailingList, and emailBlast to implement ex4's type signature.", () => {
    //  addToMailingList :: Email -> IO([Email])
    const addToMailingList = (list => email => IO.of(() => [...list, email]))([])
    // emailBlast :: [Email] -> IO ()
    const emailBlast = list => IO.of(() => `emailed: ${list.join(',')}`)
    // validateEmail :: Email -> Either String Email
    const validateEmail = x => (x.match(/\S+@\S+\.\S+/) ? Right(x) : Left('invalid email'))
    // joinMailingList :: Email -> Either String (IO ())
    const joinMailingList = compose(
      either(
        identity,
        compose(
          chain(emailBlast),
          addToMailingList
        )
      ),
      validateEmail
    )
    expect(joinMailingList('notanemail')).toBe('invalid email')
    joinMailingList('flaviocorpa@gmail.com').run(succ =>
      expect(succ).toBe('emailed: flaviocorpa@gmail.com')
    )
  })
})
