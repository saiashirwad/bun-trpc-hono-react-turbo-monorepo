import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import type { AppRouter } from "./trpc";
export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;

export { AppRouter };
