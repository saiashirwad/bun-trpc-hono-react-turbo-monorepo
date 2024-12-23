import { loginSchema } from "@template/schemas";
import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { Context } from "./context";

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export type { Context };
export { createContext } from "./context";

export const appRouter = router({
	hi: publicProcedure.query(() => {
		return {
			hi: "there" as const,
		};
	}),

	hello: publicProcedure
		.input(
			z.object({
				name: z.string(),
			}),
		)
		.query(({ input, ctx }) => {
			console.log({ ctx });
			return {
				name: input.name,
				message: "Hello from tRPC!",
			};
		}),

	login: publicProcedure.input(loginSchema).mutation(({ input }) => {
		return input;
	}),
});

export type AppRouter = typeof appRouter;
