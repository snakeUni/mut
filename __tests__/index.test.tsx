import * as React from 'react'
import { render, fireEvent, cleanup } from '@testing-library/react'
import { createStore, useSelector, Provider, Store } from '../src'

interface State {
  count: number
  value: number
}

interface Astore {
  store: Store<State>
  renderValue?: () => void
  renderCount?: () => void
}

function Label({ renderCount }: { renderCount?: () => void }) {
  const selector = React.useCallback(state => state.count, [])
  const count = useSelector<State, number>(selector)
  console.log('render count:', count)
  renderCount && renderCount()
  return <div>count: {count}</div>
}

function Label2({ renderValue }: { renderValue?: () => void }) {
  const selector = React.useCallback(state => state.value, [])
  const value = useSelector<State, number>(selector)
  console.log('render value:', value)
  renderValue && renderValue()
  return <div>value: {value}</div>
}

function Reset({ store }: Astore) {
  const handleReset = () => {
    store.reset()
  }
  return (
    <div>
      <button onClick={handleReset}>reset</button>
    </div>
  )
}

function Buttons({ store }: Astore) {
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

function App({ store, renderCount, renderValue }: Astore) {
  return (
    <Provider store={store}>
      <Label renderCount={renderCount} />
      <Label2 renderValue={renderValue} />
      <Buttons store={store} />
      <Reset store={store} />
    </Provider>
  )
}

describe('test', () => {
  afterEach(cleanup)

  it('test store', () => {
    const store = createStore<State>({
      count: 0,
      value: 0
    })

    const { getByText } = render(<App store={store} />)
    const increaseNode = getByText('increase')
    fireEvent.click(increaseNode)
    expect(getByText(/count: 1/i)).not.toBeNull()

    const decreaseNode = getByText('decrease')
    fireEvent.click(decreaseNode)
    expect(getByText(/count: 0/i)).not.toBeNull()

    // 点击 value node
    const increaseValueNode = getByText(/increaseValue/i)
    fireEvent.click(increaseValueNode)
    expect(getByText(/value: 1/i)).not.toBeNull()
    expect(getByText(/count: 0/i)).not.toBeNull()

    const decreaseValueNode = getByText(/decreaseValue/i)
    fireEvent.click(decreaseValueNode)
    expect(getByText(/value: 0/i)).not.toBeNull()

    // reset
    const resetNode = getByText(/reset/i)
    fireEvent.click(resetNode)
    expect(getByText(/value: 0/i)).not.toBeNull()
    expect(getByText(/count: 0/i)).not.toBeNull()
  })

  it('test render', () => {
    const store = createStore<State>({
      count: 0,
      value: 0
    })

    const fnCount = jest.fn()
    const fnValue = jest.fn()

    const { getByText } = render(<App store={store} renderCount={fnCount} renderValue={fnValue} />)
    expect(fnCount).toHaveBeenCalledTimes(1)
    expect(fnValue).toHaveBeenCalledTimes(1)

    const increaseNode = getByText('increase')
    fireEvent.click(increaseNode)
    expect(fnCount).toHaveBeenCalledTimes(2)
    expect(fnValue).toHaveBeenCalledTimes(1)

    const decreaseNode = getByText('decrease')
    fireEvent.click(decreaseNode)
    expect(fnCount).toHaveBeenCalledTimes(3)
    expect(fnValue).toHaveBeenCalledTimes(1)

    // value
    const increaseValueNode = getByText('increaseValue')
    fireEvent.click(increaseValueNode)
    expect(fnCount).toHaveBeenCalledTimes(4)
    expect(fnValue).toHaveBeenCalledTimes(2)

    fireEvent.click(increaseValueNode)
    expect(fnCount).toHaveBeenCalledTimes(4)
    expect(fnValue).toHaveBeenCalledTimes(3)
  })
})
