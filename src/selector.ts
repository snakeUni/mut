import React, { useContext, useCallback, useMemo } from 'react'
import { useSubscription } from 'use-subscription'
import { Store, Listener } from './store'
import { MutableSourceContext } from './context'

function subscribe<T>(store: Store<T>, callback: Listener) {
  store.subscribe(callback)

  return () => store.unsubscribe(callback)
}

// This is the user-facing hook!
// It requires a selector and returns a derived store value.
// This is probably an oversimplified example. :)
function useSelectorMutable<T, K = unknown>(selector: (state: T) => K): K {
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
  return (
    (React as any).unstable_useMutableSource &&
    (React as any).unstable_useMutableSource(mutableSource, getSnapshot, subscribe)
  )
}

// This is the user-facing hook!
// It requires a selector and returns a derived store value.
// This is probably an oversimplified example. :)
function useSelectorSubscribe<T, K = unknown>(selector: (state: T) => K): K {
  // getStore
  const mutableSource = useContext(MutableSourceContext)
  const subscription = useMemo(
    () => ({
      getCurrentValue: () => selector(mutableSource.getState() as any),
      subscribe: (callback: any) => {
        const unSubscription = mutableSource.subscribe(callback)
        return unSubscription
      }
    }),
    [mutableSource]
  )

  // Pass the store state to user selector:
  // const getSnapshot = useCallback(store => selector(store.getState()), [selector])

  // Connect the user selector to the Redux store safely
  // with the new useMutableSource hook.
  //
  // NOTE
  // This hook enables mutable sources (like Redux)
  // to be used safely with concurrent mode-
  // but it does so at the cost of deopting to
  // sync rendering mode in some cases to avoid tearing.
  return useSubscription(subscription)
  // return (React as any).useMutableSource(mutableSource, getSnapshot, subscribe)
}

export const useSelector = (React as any).unstable_useMutableSource
  ? useSelectorMutable
  : useSelectorSubscribe
