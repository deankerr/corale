import { defineEntFromTable, defineEntSchema, getEntDefinitions } from 'convex-ents'
import { migrationsTable } from 'convex-helpers/server/migrations'
import { audioEnt } from './entities/audio/ent'
import { chatModelsEnt } from './entities/chatModels'
import { collectionsEnt } from './entities/collections'
import { generationsEnt } from './entities/generations'
import { imagesEnt } from './entities/images'
import { imagesMetadataEnt } from './entities/imagesMetadata'
import { messagesEnt } from './entities/messages/ent'
import { operationsEventLogEnt } from './entities/operationsEventLogs'
import { patternsEnt } from './entities/patterns'
import { runsEnt } from './entities/runs'
import { speechEnt } from './entities/speech'
import { textsEnt } from './entities/texts'
import { threadsEnt } from './entities/threads'
import { usersApiKeysEnt } from './entities/userApiKeys'
import { usersEnt } from './entities/users'

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
    speech: speechEnt,
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
