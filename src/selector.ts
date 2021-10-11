import { useContext } from 'react'
import { useSyncExternalStoreExtra } from 'use-sync-external-store/extra'
import { Store } from './store'
import { MutableSourceContext } from './context'

type EqualityFn<T> = (a: T | undefined, b: T | undefined) => boolean

export function useSelector<T, K = unknown>(
  selector: (state: T) => K,
  equalityFn?: EqualityFn<K>
): K {
  const store = useContext<Store<T>>(MutableSourceContext)

  return useSyncExternalStoreExtra<T, K>(
    store.subscribe,
    store.getState,
    store.getState,
    selector,
    equalityFn
  )
}
