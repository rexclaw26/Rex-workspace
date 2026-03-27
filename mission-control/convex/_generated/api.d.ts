/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as agents from "../agents.js";
import type * as calendar from "../calendar.js";
import type * as crons from "../crons.js";
import type * as executionLog from "../executionLog.js";
import type * as headlines from "../headlines.js";
import type * as skillChains from "../skillChains.js";
import type * as tasks from "../tasks.js";
import type * as triggerRules from "../triggerRules.js";
import type * as xPostQueue from "../xPostQueue.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  agents: typeof agents;
  calendar: typeof calendar;
  crons: typeof crons;
  executionLog: typeof executionLog;
  headlines: typeof headlines;
  skillChains: typeof skillChains;
  tasks: typeof tasks;
  triggerRules: typeof triggerRules;
  xPostQueue: typeof xPostQueue;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
