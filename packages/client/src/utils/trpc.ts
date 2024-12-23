import { QueryClient } from "@tanstack/react-query";
import type { AppRouter } from "@template/trpc";
import { createTRPCReact, httpLink } from "@trpc/react-query";
import superjson from "superjson";

export const trpc = createTRPCReact<AppRouter>({});

export const trpcLinks = [
	httpLink({
		url: "/trpc",
		transformer: superjson,
	}),
];

export const trpcClient = trpc.createClient({
	links: trpcLinks,
});

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 5 * 1000,
		},
	},
});
