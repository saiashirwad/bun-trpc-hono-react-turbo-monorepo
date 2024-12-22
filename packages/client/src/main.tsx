import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { getTRPCClient, trpc } from "./utils/trpc";

const queryClient = new QueryClient();
const trpcClient = getTRPCClient();

function App() {
	return (
		<div>
			<h1>Hello TRPC + React</h1>
		</div>
	);
}

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<trpc.Provider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>
				<App />
			</QueryClientProvider>
		</trpc.Provider>
	</React.StrictMode>,
);
