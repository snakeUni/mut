import * as React from 'react'
import { Store } from './store'
import { MutableSourceContext } from './context'

const { useMemo } = React

interface ProviderProps<T> {
  store: Store<T>
  children?: React.ReactNode
}

export function Provider<T>({ children, store }: ProviderProps<T>) {
  const mutableSource = useMemo(() => {
    return store
  }, [store])

  return (
    <MutableSourceContext.Provider value={mutableSource}>{children}</MutableSourceContext.Provider>
  )
}
