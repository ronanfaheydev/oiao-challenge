import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "@xyflow/react/dist/style.css";

import { useGetSeries } from "./endpoints";

import { QueryClientProvider } from "@tanstack/react-query";
import Board from "./components/Board";
import queryClient from "./queryClient";

const Test = () => {
	const {
		data: series,
		isLoading,
		isError,
		isSuccess,
	} = useGetSeries({
		series_id: "GDP",
	});

	return (
		<>
			{isLoading && <div>Loading...</div>}
			{isError && <div>Error</div>}
			{isSuccess && <div>Success</div>}
		</>
	);
};

// const theme = {
// 	palette: {
// 		primary: "green",
// 		text: "#fff",
// 	},
// 	ty
// };

function App() {
	return (
		// <ThemeProvider theme={theme}>
		<QueryClientProvider client={queryClient}>
			<Board />
		</QueryClientProvider>
		// </ThemeProvider>
	);
}

export default App;
