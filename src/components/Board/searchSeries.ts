import axiosClient from "../../axiosClient";
import { getGetSeriesSearchQueryKey } from "../../endpoints";
import queryClient from "../../queryClient";

const handleSearch = async (params: { search_text: string }) => {
	return axiosClient.get(`/fred/series/search`, {
		params,
	});
};

const searchSeries = async (params: { search_text: string }) => {
	// Use queryClient.fetchQuery to access the promise directly
	const queryKey = getGetSeriesSearchQueryKey(params);
	return queryClient.fetchQuery({
		queryKey,
		queryFn: () => handleSearch(params),
	});
};

export default searchSeries;
