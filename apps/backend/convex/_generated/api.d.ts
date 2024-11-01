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
import type * as constants from "../constants.js";
import type * as crons from "../crons.js";
import type * as entities_audio_db from "../entities/audio/db.js";
import type * as entities_audio_ent from "../entities/audio/ent.js";
import type * as entities_audio_generate from "../entities/audio/generate.js";
import type * as entities_audio_internal from "../entities/audio/internal.js";
import type * as entities_audio_public from "../entities/audio/public.js";
import type * as entities_audio_validators from "../entities/audio/validators.js";
import type * as entities_chatModels_db from "../entities/chatModels/db.js";
import type * as entities_chatModels_ent from "../entities/chatModels/ent.js";
import type * as entities_chatModels_internal from "../entities/chatModels/internal.js";
import type * as entities_chatModels_public from "../entities/chatModels/public.js";
import type * as entities_chatModels_validators from "../entities/chatModels/validators.js";
import type * as entities_collections_db from "../entities/collections/db.js";
import type * as entities_collections_ent from "../entities/collections/ent.js";
import type * as entities_collections_public from "../entities/collections/public.js";
import type * as entities_collections_validators from "../entities/collections/validators.js";
import type * as entities_generations_db from "../entities/generations/db.js";
import type * as entities_generations_ent from "../entities/generations/ent.js";
import type * as entities_generations_internal from "../entities/generations/internal.js";
import type * as entities_generations_public from "../entities/generations/public.js";
import type * as entities_generations_validators from "../entities/generations/validators.js";
import type * as entities_helpers from "../entities/helpers.js";
import type * as entities_images_db from "../entities/images/db.js";
import type * as entities_images_ent from "../entities/images/ent.js";
import type * as entities_images_internal from "../entities/images/internal.js";
import type * as entities_images_public from "../entities/images/public.js";
import type * as entities_images_serve from "../entities/images/serve.js";
import type * as entities_images_validators from "../entities/images/validators.js";
import type * as entities_imagesMetadata_db from "../entities/imagesMetadata/db.js";
import type * as entities_imagesMetadata_ent from "../entities/imagesMetadata/ent.js";
import type * as entities_imagesMetadata_public from "../entities/imagesMetadata/public.js";
import type * as entities_imagesMetadata_validators from "../entities/imagesMetadata/validators.js";
import type * as entities_kvMetadata from "../entities/kvMetadata.js";
import type * as entities_messages_db from "../entities/messages/db.js";
import type * as entities_messages_ent from "../entities/messages/ent.js";
import type * as entities_messages_public from "../entities/messages/public.js";
import type * as entities_messages_validators from "../entities/messages/validators.js";
import type * as entities_operationsEventLogs_db from "../entities/operationsEventLogs/db.js";
import type * as entities_operationsEventLogs_ent from "../entities/operationsEventLogs/ent.js";
import type * as entities_operationsEventLogs_internal from "../entities/operationsEventLogs/internal.js";
import type * as entities_operationsEventLogs_public from "../entities/operationsEventLogs/public.js";
import type * as entities_operationsEventLogs_validators from "../entities/operationsEventLogs/validators.js";
import type * as entities_patterns_db from "../entities/patterns/db.js";
import type * as entities_patterns_ent from "../entities/patterns/ent.js";
import type * as entities_patterns_public from "../entities/patterns/public.js";
import type * as entities_patterns_validators from "../entities/patterns/validators.js";
import type * as entities_runs_db from "../entities/runs/db.js";
import type * as entities_runs_ent from "../entities/runs/ent.js";
import type * as entities_runs_internal from "../entities/runs/internal.js";
import type * as entities_runs_public from "../entities/runs/public.js";
import type * as entities_runs_validators from "../entities/runs/validators.js";
import type * as entities_shared from "../entities/shared.js";
import type * as entities_texts_ent from "../entities/texts/ent.js";
import type * as entities_texts_internal from "../entities/texts/internal.js";
import type * as entities_texts_public from "../entities/texts/public.js";
import type * as entities_texts_validators from "../entities/texts/validators.js";
import type * as entities_threads_db from "../entities/threads/db.js";
import type * as entities_threads_ent from "../entities/threads/ent.js";
import type * as entities_threads_public from "../entities/threads/public.js";
import type * as entities_threads_validators from "../entities/threads/validators.js";
import type * as entities_types from "../entities/types.js";
import type * as entities_users_db from "../entities/users/db.js";
import type * as entities_users_ent from "../entities/users/ent.js";
import type * as entities_users_internal from "../entities/users/internal.js";
import type * as entities_users_keys from "../entities/users/keys.js";
import type * as entities_users_public from "../entities/users/public.js";
import type * as entities_users_validators from "../entities/users/validators.js";
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
import type * as tests_helpers from "../tests/helpers.js";
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
  constants: typeof constants;
  crons: typeof crons;
  "entities/audio/db": typeof entities_audio_db;
  "entities/audio/ent": typeof entities_audio_ent;
  "entities/audio/generate": typeof entities_audio_generate;
  "entities/audio/internal": typeof entities_audio_internal;
  "entities/audio/public": typeof entities_audio_public;
  "entities/audio/validators": typeof entities_audio_validators;
  "entities/chatModels/db": typeof entities_chatModels_db;
  "entities/chatModels/ent": typeof entities_chatModels_ent;
  "entities/chatModels/internal": typeof entities_chatModels_internal;
  "entities/chatModels/public": typeof entities_chatModels_public;
  "entities/chatModels/validators": typeof entities_chatModels_validators;
  "entities/collections/db": typeof entities_collections_db;
  "entities/collections/ent": typeof entities_collections_ent;
  "entities/collections/public": typeof entities_collections_public;
  "entities/collections/validators": typeof entities_collections_validators;
  "entities/generations/db": typeof entities_generations_db;
  "entities/generations/ent": typeof entities_generations_ent;
  "entities/generations/internal": typeof entities_generations_internal;
  "entities/generations/public": typeof entities_generations_public;
  "entities/generations/validators": typeof entities_generations_validators;
  "entities/helpers": typeof entities_helpers;
  "entities/images/db": typeof entities_images_db;
  "entities/images/ent": typeof entities_images_ent;
  "entities/images/internal": typeof entities_images_internal;
  "entities/images/public": typeof entities_images_public;
  "entities/images/serve": typeof entities_images_serve;
  "entities/images/validators": typeof entities_images_validators;
  "entities/imagesMetadata/db": typeof entities_imagesMetadata_db;
  "entities/imagesMetadata/ent": typeof entities_imagesMetadata_ent;
  "entities/imagesMetadata/public": typeof entities_imagesMetadata_public;
  "entities/imagesMetadata/validators": typeof entities_imagesMetadata_validators;
  "entities/kvMetadata": typeof entities_kvMetadata;
  "entities/messages/db": typeof entities_messages_db;
  "entities/messages/ent": typeof entities_messages_ent;
  "entities/messages/public": typeof entities_messages_public;
  "entities/messages/validators": typeof entities_messages_validators;
  "entities/operationsEventLogs/db": typeof entities_operationsEventLogs_db;
  "entities/operationsEventLogs/ent": typeof entities_operationsEventLogs_ent;
  "entities/operationsEventLogs/internal": typeof entities_operationsEventLogs_internal;
  "entities/operationsEventLogs/public": typeof entities_operationsEventLogs_public;
  "entities/operationsEventLogs/validators": typeof entities_operationsEventLogs_validators;
  "entities/patterns/db": typeof entities_patterns_db;
  "entities/patterns/ent": typeof entities_patterns_ent;
  "entities/patterns/public": typeof entities_patterns_public;
  "entities/patterns/validators": typeof entities_patterns_validators;
  "entities/runs/db": typeof entities_runs_db;
  "entities/runs/ent": typeof entities_runs_ent;
  "entities/runs/internal": typeof entities_runs_internal;
  "entities/runs/public": typeof entities_runs_public;
  "entities/runs/validators": typeof entities_runs_validators;
  "entities/shared": typeof entities_shared;
  "entities/texts/ent": typeof entities_texts_ent;
  "entities/texts/internal": typeof entities_texts_internal;
  "entities/texts/public": typeof entities_texts_public;
  "entities/texts/validators": typeof entities_texts_validators;
  "entities/threads/db": typeof entities_threads_db;
  "entities/threads/ent": typeof entities_threads_ent;
  "entities/threads/public": typeof entities_threads_public;
  "entities/threads/validators": typeof entities_threads_validators;
  "entities/types": typeof entities_types;
  "entities/users/db": typeof entities_users_db;
  "entities/users/ent": typeof entities_users_ent;
  "entities/users/internal": typeof entities_users_internal;
  "entities/users/keys": typeof entities_users_keys;
  "entities/users/public": typeof entities_users_public;
  "entities/users/validators": typeof entities_users_validators;
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
  "tests/helpers": typeof tests_helpers;
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
