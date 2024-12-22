import { initTRPC } from "@trpc/server";
import { z } from "zod";

const t = initTRPC.create();

export const createTRPCRouter = () => {
	return t.router({
		greeting: t.procedure
			.input(z.object({ name: z.string() }))
			.query(({ input }) => {
				return `Hello ${input.name}!`;
			}),
	});
};

export type AppRouter = ReturnType<typeof createTRPCRouter>;
