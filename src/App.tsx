import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "@xyflow/react/dist/style.css";

import { QueryClientProvider } from "@tanstack/react-query";
import Board from "./components/Board";
import queryClient from "./queryClient";

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<Board />
		</QueryClientProvider>
	);
}

export default App;
