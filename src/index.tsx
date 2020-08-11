import * as React from 'react'
import immer, { Draft } from 'immer'

const { useContext, createContext } = React

type Listener = () => void
type UpdateFn<T> = (preState: T) => T

export interface Store<T> {
  register: (listener: Listener) => () => void
  unregister: (listener: Listener) => void
  reset: () => void
  mutate: (updater: (draft: Draft<T>) => void | T) => void
  set: (nextState: T | UpdateFn<T>) => void
}

export function createStore<T>(initialState: T): Store<T> {
  let listeners: Listener[] = []
  let currentState = initialState

  return {
    register(listener: Listener) {
      listeners.push(listener)
      return () => this.unregister(listener)
    },
    unregister(listener: Listener) {
      listeners = listeners.filter(fn => fn !== listener)
    },
    reset() {},
    mutate() {},
    set(nextState: T | UpdateFn<T>) {
      currentState =
        typeof nextState === 'function' ? (nextState as UpdateFn<T>)(currentState) : nextState
      listeners.forEach(l => l())
    }
  }
}
