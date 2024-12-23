import { QueryClientProvider } from "@tanstack/react-query";
import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { queryClient, trpc, trpcLinks } from "./utils/trpc";

function App() {
	const [trpcClient] = useState(() =>
		trpc.createClient({
			links: trpcLinks,
		}),
	);

	return (
		<trpc.Provider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>
				<div>hi</div>
			</QueryClientProvider>
		</trpc.Provider>
	);
}

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
