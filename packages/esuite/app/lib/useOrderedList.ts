import { useReducer } from 'react'

type Action<T> =
  | { type: 'unshift' | 'push'; item: T }
  | { type: 'moveUp' | 'moveDown' | 'moveToStart' | 'moveToEnd' | 'remove'; index: number }
  | { type: 'update'; index: number; updateFn: (item: T) => T }

export function orderedListReducer<T>(state: T[], action: Action<T>): T[] {
  switch (action.type) {
    case 'unshift':
      return [action.item, ...state]
    case 'push':
      return [...state, action.item]
    case 'moveUp':
      if (action.index > 0) {
        const newState = [...state]
        const item = newState[action.index]
        const prevItem = newState[action.index - 1]
        if (item !== undefined && prevItem !== undefined) {
          newState[action.index - 1] = item
          newState[action.index] = prevItem
          return newState
        }
      }
      return state
    case 'moveDown':
      if (action.index < state.length - 1) {
        const newState = [...state]
        const item = newState[action.index]
        const nextItem = newState[action.index + 1]
        if (item !== undefined && nextItem !== undefined) {
          newState[action.index] = nextItem
          newState[action.index + 1] = item
          return newState
        }
      }
      return state
    case 'moveToStart':
      if (action.index >= 0 && action.index < state.length) {
        const item = state[action.index]
        if (item !== undefined) {
          return [item, ...state.slice(0, action.index), ...state.slice(action.index + 1)]
        }
      }
      return state
    case 'moveToEnd':
      if (action.index >= 0 && action.index < state.length) {
        const item = state[action.index]
        if (item !== undefined) {
          return [...state.slice(0, action.index), ...state.slice(action.index + 1), item]
        }
      }
      return state
    case 'remove':
      if (action.index >= 0 && action.index < state.length) {
        return [...state.slice(0, action.index), ...state.slice(action.index + 1)]
      }
      return state
    case 'update':
      if (action.index >= 0 && action.index < state.length) {
        return state.map((item, index) => (index === action.index && item !== undefined ? action.updateFn(item) : item))
      }
      return state
    default:
      return state
  }
}

export function useOrderedList<T>(initialItems: T[] = []) {
  return useReducer(orderedListReducer<T>, initialItems)
}
