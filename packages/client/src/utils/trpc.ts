import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import type { AppRouter } from "types";

export const trpc = createTRPCReact<AppRouter>();

export function getTRPCClient() {
	const url =
		process.env.NODE_ENV === "production"
			? "/trpc"
			: "http://localhost:3000/trpc";

	return trpc.createClient({
		links: [
			httpBatchLink({
				url,
				// Add custom headers here if needed
				headers: () => ({}),
				fetch: (url, options) => {
					return fetch(url, {
						...options,
						credentials: "include",
					});
				},
			}),
		],
	});
}
