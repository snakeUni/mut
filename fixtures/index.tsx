import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { createStore, useSelector, Provider } from '../src'

interface State {
  count: number
  value: number
}

const store = createStore<State>({
  count: 0,
  value: 0
})

function App() {
  return (
    <Provider store={store}>
      <Label />
      <Label2 />
      <Buttons />
    </Provider>
  )
}

const Count = ({ c }) => {
  console.log('c', c)
  return c
}

function Label() {
  const count = useSelector<State, number>(state => state.count)
  console.log('render count:', count)
  return <div>count: {count}</div>
}

function Label2() {
  const value = useSelector<State, number>(state => state.value)
  console.log('render value:', value)
  return <div>value: {value}</div>
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

  const handleIncreaseV = () => {
    store.mutate(state => {
      state.value++
    })
  }

  const handleDecreaseV = () => {
    store.mutate(state => {
      state.value--
    })
  }
  return (
    <div>
      <button onClick={handleIncrease}>increase</button>
      <button onClick={handleDecrease}>decrease</button>
      <button onClick={handleIncreaseV}>increaseValue</button>
      <button onClick={handleDecreaseV}>decreaseValue</button>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
