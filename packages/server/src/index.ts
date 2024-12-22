import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { createTRPCRouter } from "./trpc";

const app = new Hono();
const trpc = createTRPCRouter();

// Configure CORS for development
if (process.env.NODE_ENV !== "production") {
	app.use(
		"*",
		cors({
			origin: "http://localhost:5173", // Vite's default port
			credentials: true,
		}),
	);
}

app.get("/", (c) => {
	return c.text("Hello World");
});

// app.use("/trpc/*", trpc.fetchHandler());
// app.use("/*", serveStatic({ root: "./public" }));

serve({
	fetch: app.fetch,
	port: Number(process.env.PORT) || 3000,
});

console.log(`🚀 Server running on port ${process.env.PORT || 3000}`);
