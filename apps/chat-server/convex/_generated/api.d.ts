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
import type * as chat_db from "../chat/db.js";
import type * as chat_helpers from "../chat/helpers.js";
import type * as chat_schemas from "../chat/schemas.js";
import type * as common from "../common.js";
import type * as init from "../init.js";
import type * as services_completion from "../services/completion.js";
import type * as types from "../types.js";
import type * as v0_helpers_runs from "../v0/helpers/runs.js";
import type * as v0_helpers_trees from "../v0/helpers/trees.js";
import type * as v0_helpers_uid from "../v0/helpers/uid.js";
import type * as v0_runs from "../v0/runs.js";
import type * as v0_schemas from "../v0/schemas.js";
import type * as v0_trees from "../v0/trees.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "chat/db": typeof chat_db;
  "chat/helpers": typeof chat_helpers;
  "chat/schemas": typeof chat_schemas;
  common: typeof common;
  init: typeof init;
  "services/completion": typeof services_completion;
  types: typeof types;
  "v0/helpers/runs": typeof v0_helpers_runs;
  "v0/helpers/trees": typeof v0_helpers_trees;
  "v0/helpers/uid": typeof v0_helpers_uid;
  "v0/runs": typeof v0_runs;
  "v0/schemas": typeof v0_schemas;
  "v0/trees": typeof v0_trees;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
