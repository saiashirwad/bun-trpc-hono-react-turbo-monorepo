import { initTRPC } from "@trpc/server";
import { Context } from "./context";

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export type { Context };
export { createContext } from "./context";

// Create your router
export const appRouter = router({
	hello: publicProcedure.query(() => {
		return "Hello from tRPC!";
	}),
});

export type AppRouter = typeof appRouter;
