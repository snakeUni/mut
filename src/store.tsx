import produce, { Draft } from 'immer'

export type Listener = () => void
export type UpdateFn<T> = (preState: T) => T

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
