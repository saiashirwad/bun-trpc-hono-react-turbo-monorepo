import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@template/server/src/trpc";
import type { TRPCReact } from "@template/types";

export const trpc: TRPCReact = createTRPCReact<AppRouter>();

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
