import type { MutationCtx } from '../../types'

const entityCode = {
  thread: 't',
  message: 'm',
  image: 'i',
  run: 'r',
  pattern: 'p',
}

const epoch = new Date('2022-04-18').getTime()

export function generateXidTime(entityType: keyof typeof entityCode): string {
  const timestamp = (Date.now() - epoch).toString(36)
  const randomPart = Math.random().toString(36).substring(2, 5)

  return `${timestamp}${entityCode[entityType]}${randomPart}`
}

const tables = {
  audio: 'a',
  threads: 't',
  messages: 'm',
  images_v2: 'i',
  runs: 'r',
  patterns: 'p',
  generations_v2: 'g',
  collections: 'c',
}

export async function generateXID(ctx: MutationCtx, tableName: keyof typeof tables): Promise<string> {
  const rnd = Math.random().toString(36).slice(2, 11)
  const xid = tables[tableName] + rnd
  const existing = await ctx.skipRules.table(tableName).get('xid', xid)
  return existing ? generateXID(ctx, tableName) : xid
}
