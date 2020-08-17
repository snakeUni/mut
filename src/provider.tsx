import * as React from 'react'
import { Store } from './store'
import { MutableSourceContext } from './context'
import { canUseMutableSource } from './util'

const { useMemo } = React

interface ProviderProps<T> {
  store: Store<T>
  children?: React.ReactNode
}

function getStoreVersion<T>(store: Store<T>): T {
  // Because the state is immutable,
  // it can be used as the "version".
  return store.getState()
}

// https://codesandbox.io/s/react-redux-usemutablesource-q18w8?file=/src/fake-react-redux.js:560-1265
// This mimics the current Redux <Provider> API.
// It shares the store (really now a MutableSource wrapper)
// with components below in the tree that read from the store.
export function Provider<T>({ children, store }: ProviderProps<T>) {
  const mutableSource = useMemo(() => {
    // Wrap the Redux store in a MutableSource object.
    // The useMutableSource() hook works with this type of object.
    // if can use createMutableSource then use createMutableSource
    if (canUseMutableSource()) {
      return (React as any).unstable_createMutableSource(store, getStoreVersion)
    } else {
      return store
    }
  }, [store])

  return (
    <MutableSourceContext.Provider value={mutableSource}>{children}</MutableSourceContext.Provider>
  )
}
