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
      <Label3 />
      <Buttons />
    </Provider>
  )
}

function Label() {
  const selector = React.useCallback(state => state.count, [])
  const count = useSelector<State, number>(selector)
  console.log('render count:', count)
  return <div>count: {count}</div>
}

function Label2() {
  const selector = React.useCallback(state => state.value, [])
  const value = useSelector<State, number>(selector)
  console.log('render value:', value)
  return <div>value: {value}</div>
}

function Label3() {
  const state = useSelector<State, State>(s => s)
  console.log('render state:', state)
  return (
    <div>
      <h1>Label3</h1>
      <div>value: {state.value}</div>
      <div>count: {state.count}</div>
    </div>
  )
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
