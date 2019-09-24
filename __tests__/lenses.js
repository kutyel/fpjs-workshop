import { lensPath, over, inc, dec, not } from 'ramda'

const LIKED = 'LIKED'
const DISLIKED = 'DISLIKED'
const initialState = [
  { postId: 1, likes: { count: 10 }, user_has_liked: false },
  { postId: 2, likes: { count: 42 }, user_has_liked: false },
  { postId: 3, likes: { count: 5 }, user_has_liked: true },
]

const reducer = (state = initialState, { type, index }) => {
  switch (type) {
    case LIKED:
      // TODO: refactor this with lenses!
      return [
        ...state.slice(0, index),
        {
          ...state[index],
          likes: { count: state[index].likes.count + 1 },
          user_has_liked: true,
        },
        ...state.slice(index + 1),
      ]
    case DISLIKED:
      // TODO: refactor this with lenses!
      return [
        ...state.slice(0, index),
        {
          ...state[index],
          likes: { count: state[index].likes.count - 1 },
          user_has_liked: false,
        },
        ...state.slice(index + 1),
      ]
    default:
      state
  }
}

describe('Lenses', () => {
  it('Reducer -> LIKE feature should work', () => {
    const index = 1
    const action = { type: LIKED, index }
    expect(initialState[index].likes.count).toBe(42)
    expect(initialState[index].user_has_liked).toBe(false)
    const newState = reducer(initialState, action)
    expect(newState[index].likes.count).toBe(43)
    expect(newState[index].user_has_liked).toBe(true)
  })

  it('Reducer -> DISLIKE feature should work', () => {
    const index = 2
    const action = { type: DISLIKED, index }
    expect(initialState[index].likes.count).toBe(5)
    expect(initialState[index].user_has_liked).toBe(true)
    const newState = reducer(initialState, action)
    expect(newState[index].likes.count).toBe(4)
    expect(newState[index].user_has_liked).toBe(false)
  })
})
