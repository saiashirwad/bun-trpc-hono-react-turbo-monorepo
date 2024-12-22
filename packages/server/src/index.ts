import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { createTRPCRouter } from "./trpc";

const NODE_ENV = process.env.NODE_ENV || "development";
console.log(`Starting server in ${NODE_ENV} mode`);

const app = new Hono();
const router = createTRPCRouter();

// API routes first
app.use(
	"/trpc/*",
	trpcServer({
		router,
	}),
);

app.use("/assets/*", serveStatic({ root: "../client/dist" }));

// Serve index.html for all other routes
app.get("*", async (c) => {
	if (!c.req.path.startsWith("/trpc/")) {
		try {
			const html = await Bun.file("../client/dist/index.html").text();
			return c.html(html);
		} catch (error) {
			console.error("Error serving index.html:", error);
			return c.text("Error serving application", 500);
		}
	}
});

export default {
	fetch: app.fetch,
	port: Number(process.env.PORT) || 3000,
	reusePort: true,
};
