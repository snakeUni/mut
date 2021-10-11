import { createContext } from 'react'
import { Store } from './store'

export const MutableSourceContext = createContext<Store<any>>(null as any)
