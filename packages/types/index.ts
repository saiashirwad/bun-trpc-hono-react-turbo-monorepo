import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import type { createTRPCReact } from "@trpc/react-query";

// This is a type-only import, so it won't be included in the build
import type { AppRouter } from "@template/server/src/trpc";

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;

export type TRPCReact = ReturnType<typeof createTRPCReact<AppRouter>>;
