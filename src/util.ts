import * as React from 'react'

export const canUseMutableSource = () => {
  return (React as any).unstable_useMutableSource ? true : false
}
