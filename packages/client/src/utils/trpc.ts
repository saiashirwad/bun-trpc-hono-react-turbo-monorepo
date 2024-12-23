import { QueryClient } from "@tanstack/react-query";
import type { AppRouter } from "@template/trpc";
import { createTRPCClient, createTRPCReact, httpLink } from "@trpc/react-query";
import superjson from "superjson";

export const trpcLinks = [
	httpLink({
		url: "/trpc",
		transformer: superjson,
	}),
];

export const trpc = createTRPCReact<AppRouter>();
export const trpcClient = createTRPCClient<AppRouter>({
	links: trpcLinks,
});

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			// gcTime: 1000 * 60 * 5, // 24 hours
			// persister: experimental_createPersister({
			// 	storage: {
			// 		getItem: get,
			// 		setItem: set,
			// 		removeItem: del,
			// 	},
			// 	prefix: "trpc",
			// }),
		},
	},
});
