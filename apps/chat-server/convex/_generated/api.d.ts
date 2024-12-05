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
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
