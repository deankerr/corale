import { defineSchema } from 'convex/server'
import { messagesTable, threadsTable } from './chat/schemas'
import { treesTables } from './v0/schemas'

export default defineSchema(
  {
    messages: messagesTable,
    threads: threadsTable,
    ...treesTables,
  },
  { schemaValidation: false },
)
