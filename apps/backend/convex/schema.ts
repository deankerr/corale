import { defineEnt, defineEntFromTable, defineEntSchema, getEntDefinitions } from 'convex-ents'
import { migrationsTable } from 'convex-helpers/server/migrations'
import { v } from 'convex/values'
import { audioEnt } from './entities/audio/ent'
import { chatModelsEnt } from './entities/chatModels/ent'
import { collectionsEnt } from './entities/collections/ent'
import { generationsEnt } from './entities/generations/ent'
import { imagesEnt } from './entities/images/ent'
import { imagesMetadataEnt } from './entities/imagesMetadata/ent'
import { messagesEnt } from './entities/messages/ent'
import { operationsEventLogEnt } from './entities/operationsEventLogs/ent'
import { patternsEnt } from './entities/patterns/ent'
import { textsEnt } from './entities/texts/ent'
import { threadsEnt } from './entities/threads/ent'
import { runsEnt } from './entities/threads/runs/definition'
import { usersApiKeysEnt, usersEnt } from './entities/users/ent'

const schema = defineEntSchema(
  {
    audio: audioEnt,
    chat_models: chatModelsEnt,
    collections: collectionsEnt,
    generations_v2: generationsEnt,
    images_metadata_v2: imagesMetadataEnt,
    images_v2: imagesEnt,
    messages: messagesEnt,
    migrations: defineEntFromTable(migrationsTable),
    operationsEventLog: operationsEventLogEnt,
    patterns: patternsEnt,
    runs: runsEnt,
    speech: defineEnt({
      fileId: v.optional(v.id('_storage')),
      resourceKey: v.string(),
      textHash: v.string(),
    }).index('textHash_resourceKey', ['textHash', 'resourceKey']),
    texts: textsEnt,
    threads: threadsEnt,
    users_api_keys: usersApiKeysEnt,
    users: usersEnt,
  },
  {
    schemaValidation: true,
  },
)

export default schema
export const entDefinitions = getEntDefinitions(schema)
