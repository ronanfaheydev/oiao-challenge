import axios from "axios";

const axiosClient = axios.create({
	baseURL: import.meta.env.VITE_FRED_API_URL,
});

axiosClient.interceptors.request.use((config) => {
	config.params = {
		...config.params,
		api_key: import.meta.env.VITE_FRED_API_KEY,
		file_type: "json",
	};
	return config;
});

// return data key
axiosClient.interceptors.response.use((response) => response.data);

export default axiosClient;
