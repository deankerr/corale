import { customAlphabet } from 'nanoid'
import type { TableNames } from '../_generated/dataModel'
import type { Ent, EntWriter } from '../types'

export function generateXID(): string {
  return customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 12)()
}

export function nullifyDeletedEnt<T extends Ent<TableNames> | null>(doc: T): T | null {
  if (doc && 'deletionTime' in doc && doc.deletionTime !== undefined) {
    return null
  }
  return doc
}

export function nullifyDeletedEntWriter<T extends EntWriter<TableNames> | null>(ent: T): T | null {
  if (ent && 'deletionTime' in ent && ent.deletionTime !== undefined) {
    return null
  }
  return ent
}
