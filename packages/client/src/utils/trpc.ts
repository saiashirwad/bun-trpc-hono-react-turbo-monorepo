import type { AppRouter } from "@template/server";
import { httpBatchLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";

type TRPCReact = ReturnType<typeof createTRPCReact<AppRouter>>;
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
