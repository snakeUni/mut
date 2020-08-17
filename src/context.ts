import { createContext } from 'react'
import { Store } from './store'

export const MutableSourceContext = createContext<Store<unknown>>(null as any)
