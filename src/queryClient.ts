import { QueryClient } from "@tanstack/react-query";

// add api_key query param to all requests
const queryClient = new QueryClient({
	defaultOptions: {},
});

export default queryClient;
