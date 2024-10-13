import {
	useQueries,
	useQuery,
	type QueryFunction,
	type QueryKey,
	type UseQueryOptions,
	type UseQueryResult,
} from "@tanstack/react-query";
import type { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import axios from "./axiosClient";

export type GetSeriesSearchParams = {
	/**
	 * Get the observations or data values for an economic data series.
	 */
	Description?: string;
	/**
	 * Read API Keys for more information.
	 */
	api_key?: string;
	/**
	 * A key or file extension that indicates the type of file to send.
	 */
	file_type?: string;
	/**
	 * The words to match against economic data series.
	 */
	search_text?: string;
	/**
	 * Determines the type of search to perform.
	 */
	search_type?: string;
	/**
	 * The start of the real-time period. For more information, see Real-Time Periods.
	 */
	realtime_start?: string;
	/**
	 * The end of the real-time period. For more information, see Real-Time Periods.
	 */
	realtime_end?: string;
	/**
	 * The maximum number of results to return.
	 */
	limit?: string;
	/**
	 * non-negative integer, optional, default: 0
	 */
	offset?: number;
	/**
	 * Order results by values of the specified attribute.
	 */
	order_by?: string;
	/**
	 * Sort results is ascending or descending observation_date order.
	 */
	sort_order?: string;
	/**
	 * The attribute to filter results by.
	 */
	filter_variable?: string;
	/**
	 * The value of the filter_variable attribute to filter results by.
	 */
	filter_value?: string;
	/**
	 * A semicolon delimited list of tag names that series match all of.
	 */
	tag_names?: string;
	/**
	 * A semicolon delimited list of tag names that series match none of.
	 */
	exclude_tag_names?: string;
};
export type GetSeriesObservationsParamsMulti = {
	series_ids: string[];
};
export type GetSeriesObservationsParams = {
	/**
	 * Get the observations or data values for an economic data series.
	 */
	Description?: string;
	/**
	 * Read API Keys for more information.
	 */
	api_key?: string;
	/**
	 * A key or file extension that indicates the type of file to send.
	 */
	file_type?: string;
	/**
	 * The id for a series.
	 */
	series_id?: string;
	/**
	 * The start of the real-time period. For more information, see Real-Time Periods.
	 */
	realtime_start?: string;
	/**
	 * The end of the real-time period. For more information, see Real-Time Periods.
	 */
	realtime_end?: string;
	/**
	 * The maximum number of results to return.
	 */
	limit?: string;
	/**
	 * non-negative integer, optional, default: 0
	 */
	offset?: number;
	/**
	 * Sort results is ascending or descending observation_date order.
	 */
	sort_order?: string;
	/**
	 * The start of the observation period.
	 */
	observation_start?: string;
	/**
	 * The end of the observation period.
	 */
	observation_end?: string;
	/**
	 * A key that indicates a data value transformation.
	 */
	units?: string;
	/**
	 * An optional parameter that indicates a lower frequency to aggregate values to. The FRED frequency aggregation feature converts higher frequency data series into lower frequency data series (e.g. converts a monthly data series into an annual data series). In FRED, the highest frequency data is daily, and the lowest frequency data is annual. There are 3 aggregation methods available- average, sum, and end of period. See the aggregation_method parameter.
	 */
	frequency?: unknown;
	/**
	 * A key that indicates the aggregation method used for frequency aggregation. This parameter has no affect if the frequency parameter is not set.
	 */
	aggregation_method?: string;
	/**
	 * An integer that indicates an output type.
	 */
	output_type?: number;
	/**
	 * Vintage dates are used to download data as it existed on these specified dates in history. Vintage dates can be specified instead of a real-time period using realtime_start and realtime_end.
	 */
	vintage_dates?: string;
};

export interface SeriesSearchData {
	frequency: string;
	frequency_short: string;
	group_popularity: number;
	id: string;
	last_updated: string;
	observation_end: string;
	observation_start: string;
	popularity: number;
	realtime_end: string;
	realtime_start: string;
	seasonal_adjustment: string;
	seasonal_adjustment_short: string;
	title: string;
	units: string;
	units_short: string;
}

interface SeriesSearchResponse {
	count: number;
	limit: number;
	offset: number;
	order_by: string;
	realtime_end: string;
	realtime_start: string;
	seriess: SeriesSearchData[];
	sort_order: string;
}

export const getSeriesSearch = (
	params?: GetSeriesSearchParams,
	options?: AxiosRequestConfig
): Promise<AxiosResponse<SeriesSearchResponse>> => {
	return axios.get(`/fred/series/search`, {
		...options,
		params: { ...params, ...options?.params },
	});
};

export const getGetSeriesSearchQueryKey = (params?: GetSeriesSearchParams) => {
	return [`/fred/series/search`, ...(params ? [params] : [])] as const;
};

export const getGetSeriesSearchQueryOptions = <
	TData = Awaited<ReturnType<typeof getSeriesSearch>>,
	TError = AxiosError<unknown>,
>(
	params?: GetSeriesSearchParams,
	options?: {
		query?: UseQueryOptions<
			Awaited<ReturnType<typeof getSeriesSearch>>,
			TError,
			TData
		>;
		axios?: AxiosRequestConfig;
	}
) => {
	const { query: queryOptions, axios: axiosOptions } = options ?? {};

	const queryKey = queryOptions?.queryKey ?? getGetSeriesSearchQueryKey(params);

	const queryFn: QueryFunction<Awaited<ReturnType<typeof getSeriesSearch>>> = ({
		signal,
	}) => getSeriesSearch(params, { signal, ...axiosOptions });

	return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
		Awaited<ReturnType<typeof getSeriesSearch>>,
		TError,
		TData
	> & { queryKey: QueryKey };
};

export type GetSeriesSearchQueryResult = NonNullable<
	Awaited<ReturnType<typeof getSeriesSearch>>
>;
export type GetSeriesSearchQueryError = AxiosError<unknown>;

export const useGetSeriesSearch = <
	TData = Awaited<ReturnType<typeof getSeriesSearch>>,
	TError = AxiosError<unknown>,
>(
	params?: GetSeriesSearchParams,
	options?: {
		query?: UseQueryOptions<
			Awaited<ReturnType<typeof getSeriesSearch>>,
			TError,
			TData
		> & { enabled?: boolean };
		axios?: AxiosRequestConfig;
	}
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
	const queryOptions = getGetSeriesSearchQueryOptions(params, options);

	const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
		queryKey: QueryKey;
	};

	query.queryKey = queryOptions.queryKey;

	return query;
};

export const getSeriesObservations = (
	params?: GetSeriesObservationsParams,
	options?: AxiosRequestConfig
): Promise<AxiosResponse<unknown>> => {
	return axios.get(`/fred/series/observations`, {
		...options,
		params: { ...params, ...options?.params },
	});
};

export const getGetSeriesObservationsQueryKey = (
	params?: GetSeriesObservationsParams
) => {
	return [`/fred/series/observations`, ...(params ? [params] : [])] as const;
};

export const getGetSeriesObservationsQueryOptions = <
	TData = Awaited<ReturnType<typeof getSeriesObservations>>,
	TError = AxiosError<unknown>,
>(
	params?: GetSeriesObservationsParams,
	options?: {
		query?: UseQueryOptions<
			Awaited<ReturnType<typeof getSeriesObservations>>,
			TError,
			TData
		>;
		axios?: AxiosRequestConfig;
	}
) => {
	const { query: queryOptions, axios: axiosOptions } = options ?? {};

	const queryKey =
		queryOptions?.queryKey ?? getGetSeriesObservationsQueryKey(params);

	const queryFn: QueryFunction<
		Awaited<ReturnType<typeof getSeriesObservations>>
	> = ({ signal }) =>
		getSeriesObservations(params, { signal, ...axiosOptions });

	return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
		Awaited<ReturnType<typeof getSeriesObservations>>,
		TError,
		TData
	> & { queryKey: QueryKey };
};

export type GetSeriesObservationsQueryResult = NonNullable<
	Awaited<ReturnType<typeof getSeriesObservations>>
>;
export type GetSeriesObservationsQueryError = AxiosError<unknown>;

export const useGetSeriesObservations = <
	TData = Awaited<ReturnType<typeof getSeriesObservations>>,
	TError = AxiosError<unknown>,
>(
	params?: GetSeriesObservationsParams,
	options?: {
		query?: UseQueryOptions<
			Awaited<ReturnType<typeof getSeriesObservations>>,
			TError,
			TData
		> & { enabled?: boolean };
		axios?: AxiosRequestConfig;
	}
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
	const queryOptions = getGetSeriesObservationsQueryOptions(params, options);

	const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
		queryKey: QueryKey;
	};

	query.queryKey = queryOptions.queryKey;

	return query;
};

export const getSeriesObservationsMulti = (
	params?: GetSeriesObservationsParams,
	options?: AxiosRequestConfig
): Promise<AxiosResponse<unknown>> => {
	return axios.get(`/fred/series/observations`, {
		...options,
		params: { ...params, ...options?.params },
	});
};

export const getGetSeriesObservationsMultiQueryKey = (
	params?: GetSeriesObservationsParams
) => {
	return [`/fred/series/observations`, ...(params ? [params] : [])] as const;
};

export const getGetSeriesObservationsMultiQueryOptions = <
	TData = Awaited<ReturnType<typeof getSeriesObservations>>,
	TError = AxiosError<unknown>,
>(
	params?: GetSeriesObservationsParams,
	options?: {
		query?: UseQueryOptions<
			Awaited<ReturnType<typeof getSeriesObservations>>,
			TError,
			TData
		>;
		axios?: AxiosRequestConfig;
	}
) => {
	const { query: queryOptions, axios: axiosOptions } = options ?? {};

	const queryKey =
		queryOptions?.queryKey ?? getGetSeriesObservationsMultiQueryKey(params);

	const queryFn: QueryFunction<
		Awaited<ReturnType<typeof getSeriesObservations>>
	> = ({ signal }) =>
		getSeriesObservations(params, { signal, ...axiosOptions });

	return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
		Awaited<ReturnType<typeof getSeriesObservations>>,
		TError,
		TData
	> & { queryKey: QueryKey };
};

export type GetSeriesObservationsMultiQueryResult = NonNullable<
	Awaited<ReturnType<typeof getSeriesObservations>>
>;

export type GetSeriesObservationsMultiQueryError = AxiosError<unknown>;

export const useGetSeriesObservationsMulti = <
	TData = Awaited<ReturnType<typeof getSeriesObservations>>,
	TError = AxiosError<unknown>,
>(
	params: GetSeriesObservationsParamsMulti,
	options?: {
		queries?: UseQueryOptions<
			Awaited<ReturnType<typeof getSeriesObservations>>,
			TError,
			TData
		>[];
		axios?: AxiosRequestConfig;
	}
): (UseQueryResult<TData, TError> & { queryKey: QueryKey })[] => {
	const { series_ids, ...restParams } = params || {};
	const queriesOptions: any = {
		queries: series_ids?.map((series_id) => {
			const queryOptions = getGetSeriesObservationsQueryOptions(
				{ series_id, ...restParams },
				options
			);

			return queryOptions;
		}),
	};

	const query = useQueries(queriesOptions) as (UseQueryResult<TData, TError> & {
		queryKey: QueryKey;
	})[];

	return query;
};
