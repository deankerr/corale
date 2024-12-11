import { defineSchema } from 'convex/server'
import { messagesTable, threadsTable } from './chat/schemas'

export default defineSchema(
  {
    messages: messagesTable,
    threads: threadsTable,
  },
  { schemaValidation: true },
)
