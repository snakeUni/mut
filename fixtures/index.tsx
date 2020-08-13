import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { createStore, useSelector, Provider } from '../src'

interface State {
  count: number
}

const store = createStore<State>({
  count: 0
})

function App() {
  return (
    <Provider store={store}>
      <Label />
      <Buttons />
    </Provider>
  )
}

function Label() {
  const count = useSelector<State, number>(state => state.count)
  return <div>count: {count}</div>
}

function Buttons() {
  const handleIncrease = () => {
    store.mutate(state => {
      state.count++
    })
  }

  const handleDecrease = () => {
    store.mutate(state => {
      state.count--
    })
  }
  return (
    <div>
      <button onClick={handleIncrease}>increase</button>
      <button onClick={handleDecrease}>decrease</button>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
