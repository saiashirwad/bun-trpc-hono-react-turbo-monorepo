import { QueryClient } from "@tanstack/react-query";
import type { AppRouter } from "@template/trpc";
import { createTRPCReact, httpLink } from "@trpc/react-query";

export type TRPCReact = ReturnType<typeof createTRPCReact<AppRouter>>;
export const trpc: TRPCReact = createTRPCReact<AppRouter>({});

export const trpcLinks = [
	httpLink({
		url: "/trpc",
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
