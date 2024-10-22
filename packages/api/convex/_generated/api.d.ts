/* prettier-ignore-start */

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
import type * as action_textToAudio from "../action/textToAudio.js";
import type * as action_textToImage from "../action/textToImage.js";
import type * as crons from "../crons.js";
import type * as db_admin_events from "../db/admin/events.js";
import type * as db_admin_runs from "../db/admin/runs.js";
import type * as db_audio from "../db/audio.js";
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
import type * as files from "../files.js";
import type * as functions from "../functions.js";
import type * as http from "../http.js";
import type * as init from "../init.js";
import type * as lib_ai from "../lib/ai.js";
import type * as lib_clerk from "../lib/clerk.js";
import type * as lib_env from "../lib/env.js";
import type * as lib_fetch from "../lib/fetch.js";
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
  "action/textToAudio": typeof action_textToAudio;
  "action/textToImage": typeof action_textToImage;
  crons: typeof crons;
  "db/admin/events": typeof db_admin_events;
  "db/admin/runs": typeof db_admin_runs;
  "db/audio": typeof db_audio;
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
  files: typeof files;
  functions: typeof functions;
  http: typeof http;
  init: typeof init;
  "lib/ai": typeof lib_ai;
  "lib/clerk": typeof lib_clerk;
  "lib/env": typeof lib_env;
  "lib/fetch": typeof lib_fetch;
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

/* prettier-ignore-end */
