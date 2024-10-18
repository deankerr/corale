import { ConvexError } from 'convex/values'
import { customAlphabet } from 'nanoid/non-secure'
import type { Ent, EntWriter, MutationCtx, QueryCtx } from '../../types'

export function generateXID(): string {
  return customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 12)()
}

type XIDTableNames =
  | 'audio'
  | 'collections'
  | 'generations_v2'
  | 'images_v2'
  | 'messages'
  | 'patterns'
  | 'runs'
  | 'threads'

export async function getEntity<T extends XIDTableNames>(
  ctx: QueryCtx,
  tableName: T,
  id: string,
): Promise<Ent<T> | null> {
  const docId = ctx.table(tableName).normalizeId(id)
  if (docId) return await ctx.table(tableName).get(docId)

  switch (tableName) {
    case 'audio':
      return (await ctx.table('audio').get('xid', id)) as Ent<T> | null
    case 'collections':
      return (await ctx.table('collections').get('xid', id)) as Ent<T> | null
    case 'generations_v2':
      return (await ctx.table('generations_v2').get('xid', id)) as Ent<T> | null
    case 'images_v2':
      return (await ctx.table('images_v2').get('xid', id)) as Ent<T> | null
    case 'messages':
      return (await ctx.table('messages').get('xid', id)) as Ent<T> | null
    case 'patterns':
      return (await ctx.table('patterns').get('xid', id)) as Ent<T> | null
    case 'runs':
      return (await ctx.table('runs').get('xid', id)) as Ent<T> | null
    case 'threads':
      return (await ctx.table('threads').get('xid', id)) as Ent<T> | null
    default:
      return null
  }
}

export async function getEntityX<T extends XIDTableNames>(ctx: QueryCtx, tableName: T, id: string): Promise<Ent<T>> {
  const entity = await getEntity(ctx, tableName, id)
  if (!entity) throw new ConvexError({ message: 'invalid entity id', tableName, id })
  return entity
}

export async function getEntityWriter<T extends XIDTableNames>(
  ctx: MutationCtx,
  tableName: T,
  id: string,
): Promise<EntWriter<T> | null> {
  const docId = ctx.table(tableName).normalizeId(id)
  if (docId) return await ctx.table(tableName).get(docId)

  switch (tableName) {
    case 'audio':
      return (await ctx.table('audio').get('xid', id)) as EntWriter<T> | null
    case 'collections':
      return (await ctx.table('collections').get('xid', id)) as EntWriter<T> | null
    case 'generations_v2':
      return (await ctx.table('generations_v2').get('xid', id)) as EntWriter<T> | null
    case 'images_v2':
      return (await ctx.table('images_v2').get('xid', id)) as EntWriter<T> | null
    case 'messages':
      return (await ctx.table('messages').get('xid', id)) as EntWriter<T> | null
    case 'patterns':
      return (await ctx.table('patterns').get('xid', id)) as EntWriter<T> | null
    case 'runs':
      return (await ctx.table('runs').get('xid', id)) as EntWriter<T> | null
    case 'threads':
      return (await ctx.table('threads').get('xid', id)) as EntWriter<T> | null
    default:
      return null
  }
}

export async function getEntityWriterX<T extends XIDTableNames>(
  ctx: MutationCtx,
  tableName: T,
  id: string,
): Promise<EntWriter<T>> {
  const entity = await getEntityWriter(ctx, tableName, id)
  if (!entity) throw new ConvexError({ message: 'invalid entity id', tableName, id })
  return entity
}
