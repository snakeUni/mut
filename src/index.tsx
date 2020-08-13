import * as React from 'react'
import produce, { Draft } from 'immer'

const { useContext, createContext, useMemo, useCallback } = React

type Listener = () => void
type UpdateFn<T> = (preState: T) => T

export interface Store<T> {
  subscribe: (listener: Listener) => () => void
  unsubscribe: (listener: Listener) => void
  reset: () => void
  mutate: (updater: (draft: Draft<T>) => void | T) => void
  setState: (nextState: T | UpdateFn<T>) => void
  getState: () => T
}

export function createStore<T>(initialState: T): Store<T> {
  let listeners: Listener[] = []
  let currentState = initialState

  return {
    subscribe(listener: Listener) {
      listeners.push(listener)
      return () => this.unsubscribe(listener)
    },
    unsubscribe(listener: Listener) {
      listeners = listeners.filter(fn => fn !== listener)
    },
    reset() {
      this.setState(initialState)
    },
    mutate(updater: (draft: Draft<T>) => void | T) {
      const cur = this.getState()
      const nextState = produce(cur, updater)
      if (nextState !== cur) {
        this.setState(nextState as T)
      }
    },
    setState(nextState: T | UpdateFn<T>) {
      currentState =
        typeof nextState === 'function' ? (nextState as UpdateFn<T>)(currentState) : nextState
      listeners.forEach(l => l())
    },
    getState: () => currentState
  }
}

function subscribe<T>(store: Store<T>, callback: Listener) {
  store.subscribe(callback)

  return () => store.unsubscribe(callback)
}

function getStoreVersion<T>(store: Store<T>): T {
  // Because the state is immutable,
  // it can be used as the "version".
  return store.getState()
}

const MutableSourceContext = createContext<Store<unknown>>(null as any)

interface ProviderProps<T> {
  store: Store<T>
  children?: React.ReactNode
}

// https://codesandbox.io/s/react-redux-usemutablesource-q18w8?file=/src/fake-react-redux.js:560-1265
// This mimics the current Redux <Provider> API.
// It shares the store (really now a MutableSource wrapper)
// with components below in the tree that read from the store.
export function Provider<T>({ children, store }: ProviderProps<T>) {
  const mutableSource = useMemo(() => {
    // Wrap the Redux store in a MutableSource object.
    // The useMutableSource() hook works with this type of object.
    return (React as any).unstable_createMutableSource(store, getStoreVersion)
  }, [store])

  return (
    <MutableSourceContext.Provider value={mutableSource}>{children}</MutableSourceContext.Provider>
  )
}

// This is the user-facing hook!
// It requires a selector and returns a derived store value.
// This is probably an oversimplified example. :)
export function useSelector<T, K = unknown>(selector: (state: T) => K): K {
  const mutableSource = useContext(MutableSourceContext)
  // Pass the store state to user selector:
  const getSnapshot = useCallback(store => selector(store.getState()), [selector])

  // Connect the user selector to the Redux store safely
  // with the new useMutableSource hook.
  //
  // NOTE
  // This hook enables mutable sources (like Redux)
  // to be used safely with concurrent mode-
  // but it does so at the cost of deopting to
  // sync rendering mode in some cases to avoid tearing.
  return (React as any).unstable_useMutableSource(mutableSource, getSnapshot, subscribe)
}
