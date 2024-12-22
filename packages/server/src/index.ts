import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { createTRPCRouter } from "./trpc";

const app = new Hono();
const router = createTRPCRouter();

// API routes first
app.use(
	"/trpc/*",
	trpcServer({
		router,
	}),
);

if (process.env.NODE_ENV === "production") {
	// Serve static assets (JS, CSS, images)
	app.use("/assets/*", serveStatic({ root: "../client/dist" }));

	// Serve index.html for all non-API routes (client-side routing)
	app.get("*", async (c) => {
		if (!c.req.path.startsWith("/trpc/")) {
			return c.html(await Bun.file("../client/dist/index.html").text());
		}
	});
}

export default {
	port: Number(process.env.PORT) || 3000,
	fetch: app.fetch,
};
