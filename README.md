# mut

A tiny state management library based on Immer and useMutableSource or useSubscribe

## Usage

### Install

`yarn add @bete/mut` 或 `npm install @bete/mut`

_Note:_

if useMutableSource is available then use useMutableSource otherwise use useSubscribe

### Example

```jsx
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { createStore, useSelector, Provider } from '@bete/mut'

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
      <Reset />
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

function Reset() {
  const reset = () => {
    store.reset()
  }

  return (
    <button onClick={reset}>decreaseValue</button>
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
```

## Api

### createStore

```jsx
function createStore<T>(initialState: T): Store<T>
```

```jsx
interface Store<T> {
  subscribe: (listener: Listener) => () => void
  unsubscribe: (listener: Listener) => void
  reset: () => void
  mutate: (updater: (draft: Draft<T>) => void | T) => void
  setState: (nextState: T | UpdateFn<T>) => void
  getState: () => T
}
```

### Provider

```
const store = createStore()

<Provider store={store}>
  {children}
</Provider>
```

### useSelector

```jsx
function useSelector<T, K = unknown>(selector: (state: T) => K): K
```

Example

```jsx
const selector = React.useCallback(state => state.value, [])
const value = useSelector<State, number>(selector)
```

> _Note_  
> selector [need use useCallback](https://github.com/reactjs/rfcs/blob/master/text/0147-use-mutable-source.md)
