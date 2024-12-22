import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "../server/src/trpc";

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
