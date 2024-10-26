/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as action_evaluateMessageUrls from "../action/evaluateMessageUrls.js";
import type * as action_generateThreadTitle from "../action/generateThreadTitle.js";
import type * as action_ingestImageUrl from "../action/ingestImageUrl.js";
import type * as action_run from "../action/run.js";
import type * as action_textToImage from "../action/textToImage.js";
import type * as crons from "../crons.js";
import type * as db_admin_events from "../db/admin/events.js";
import type * as db_admin_runs from "../db/admin/runs.js";
import type * as db_collections from "../db/collections.js";
import type * as db_generations from "../db/generations.js";
import type * as db_helpers_kvMetadata from "../db/helpers/kvMetadata.js";
import type * as db_helpers_xid from "../db/helpers/xid.js";
import type * as db_images from "../db/images.js";
import type * as db_messages from "../db/messages.js";
import type * as db_models from "../db/models.js";
import type * as db_patterns from "../db/patterns.js";
import type * as db_runs from "../db/runs.js";
import type * as db_tasks from "../db/tasks.js";
import type * as db_texts from "../db/texts.js";
import type * as db_thread_messages from "../db/thread/messages.js";
import type * as db_threads from "../db/threads.js";
import type * as db_users from "../db/users.js";
import type * as entities_audio_ent from "../entities/audio/ent.js";
import type * as entities_audio_generate from "../entities/audio/generate.js";
import type * as entities_audio_validators from "../entities/audio/validators.js";
import type * as entities_audio from "../entities/audio.js";
import type * as entities_chatModels from "../entities/chatModels.js";
import type * as entities_collections from "../entities/collections.js";
import type * as entities_generations from "../entities/generations.js";
import type * as entities_helpers from "../entities/helpers.js";
import type * as entities_images from "../entities/images.js";
import type * as entities_imagesMetadata from "../entities/imagesMetadata.js";
import type * as entities_messages_db from "../entities/messages/db.js";
import type * as entities_messages_ent from "../entities/messages/ent.js";
import type * as entities_messages_validators from "../entities/messages/validators.js";
import type * as entities_messages from "../entities/messages.js";
import type * as entities_operationsEventLogs from "../entities/operationsEventLogs.js";
import type * as entities_patterns from "../entities/patterns.js";
import type * as entities_runs from "../entities/runs.js";
import type * as entities_shared from "../entities/shared.js";
import type * as entities_speech from "../entities/speech.js";
import type * as entities_texts from "../entities/texts.js";
import type * as entities_threads_db from "../entities/threads/db.js";
import type * as entities_threads_ent from "../entities/threads/ent.js";
import type * as entities_threads_validators from "../entities/threads/validators.js";
import type * as entities_threads from "../entities/threads.js";
import type * as entities_types from "../entities/types.js";
import type * as entities_userApiKeys from "../entities/userApiKeys.js";
import type * as entities_users from "../entities/users.js";
import type * as files from "../files.js";
import type * as functions from "../functions.js";
import type * as http from "../http.js";
import type * as init from "../init.js";
import type * as lib_ai from "../lib/ai.js";
import type * as lib_clerk from "../lib/clerk.js";
import type * as lib_env from "../lib/env.js";
import type * as lib_fetch from "../lib/fetch.js";
import type * as lib_parse from "../lib/parse.js";
import type * as lib_sharp from "../lib/sharp.js";
import type * as lib_utils from "../lib/utils.js";
import type * as migrations from "../migrations.js";
import type * as provider_fal_models from "../provider/fal/models.js";
import type * as provider_openrouter from "../provider/openrouter.js";
import type * as rules from "../rules.js";
import type * as types from "../types.js";
import type * as values from "../values.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "action/evaluateMessageUrls": typeof action_evaluateMessageUrls;
  "action/generateThreadTitle": typeof action_generateThreadTitle;
  "action/ingestImageUrl": typeof action_ingestImageUrl;
  "action/run": typeof action_run;
  "action/textToImage": typeof action_textToImage;
  crons: typeof crons;
  "db/admin/events": typeof db_admin_events;
  "db/admin/runs": typeof db_admin_runs;
  "db/collections": typeof db_collections;
  "db/generations": typeof db_generations;
  "db/helpers/kvMetadata": typeof db_helpers_kvMetadata;
  "db/helpers/xid": typeof db_helpers_xid;
  "db/images": typeof db_images;
  "db/messages": typeof db_messages;
  "db/models": typeof db_models;
  "db/patterns": typeof db_patterns;
  "db/runs": typeof db_runs;
  "db/tasks": typeof db_tasks;
  "db/texts": typeof db_texts;
  "db/thread/messages": typeof db_thread_messages;
  "db/threads": typeof db_threads;
  "db/users": typeof db_users;
  "entities/audio/ent": typeof entities_audio_ent;
  "entities/audio/generate": typeof entities_audio_generate;
  "entities/audio/validators": typeof entities_audio_validators;
  "entities/audio": typeof entities_audio;
  "entities/chatModels": typeof entities_chatModels;
  "entities/collections": typeof entities_collections;
  "entities/generations": typeof entities_generations;
  "entities/helpers": typeof entities_helpers;
  "entities/images": typeof entities_images;
  "entities/imagesMetadata": typeof entities_imagesMetadata;
  "entities/messages/db": typeof entities_messages_db;
  "entities/messages/ent": typeof entities_messages_ent;
  "entities/messages/validators": typeof entities_messages_validators;
  "entities/messages": typeof entities_messages;
  "entities/operationsEventLogs": typeof entities_operationsEventLogs;
  "entities/patterns": typeof entities_patterns;
  "entities/runs": typeof entities_runs;
  "entities/shared": typeof entities_shared;
  "entities/speech": typeof entities_speech;
  "entities/texts": typeof entities_texts;
  "entities/threads/db": typeof entities_threads_db;
  "entities/threads/ent": typeof entities_threads_ent;
  "entities/threads/validators": typeof entities_threads_validators;
  "entities/threads": typeof entities_threads;
  "entities/types": typeof entities_types;
  "entities/userApiKeys": typeof entities_userApiKeys;
  "entities/users": typeof entities_users;
  files: typeof files;
  functions: typeof functions;
  http: typeof http;
  init: typeof init;
  "lib/ai": typeof lib_ai;
  "lib/clerk": typeof lib_clerk;
  "lib/env": typeof lib_env;
  "lib/fetch": typeof lib_fetch;
  "lib/parse": typeof lib_parse;
  "lib/sharp": typeof lib_sharp;
  "lib/utils": typeof lib_utils;
  migrations: typeof migrations;
  "provider/fal/models": typeof provider_fal_models;
  "provider/openrouter": typeof provider_openrouter;
  rules: typeof rules;
  types: typeof types;
  values: typeof values;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
