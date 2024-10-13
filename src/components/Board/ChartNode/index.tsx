import { Handle, Position, useReactFlow } from "@xyflow/react";
import { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import { useGetSeriesObservationsMulti } from "../../../queries";
import ErrorBoundary from "../../ErrorBoundary";
import { Chart, type ChartSeries, type DateRange } from "./Chart";
import { chartHeight, chartWidth } from "./constants";

const formatObservationDate = (date: number) => {
	// yyyy-mm-dd
	return new Date(date).toISOString().split("T")[0];
};

const ChartNodeContainer = styled.div`
	background-color: white;
	border: 1px solid #ccc;
	border-radius: 5px;
	box-shadow: 0 2px 2px rgba(0, 0, 0, 0.1);
	padding: 10px;
	min-width: ${chartWidth}px;
	min-height: ${chartHeight}px;
`;

// generate hex colors from the series id
const generateColor = (series_id: string) => {
	const color = `${series_id}666666`
		.split("")
		.map((char) => char.charCodeAt(0))
		.reduce((acc, charCode) => acc + charCode, 0);

	return `#${color.toString(16).slice(0, 6)}`;
};

const colorMap: { [key: string]: string } = {};

const getColor = (series_id: string) => {
	if (colorMap[series_id]) {
		return colorMap[series_id];
	}
	const color = generateColor(series_id);
	colorMap[series_id] = color;
	return color;
};

interface ChartNodeProps {
	id: string;
}

interface NodeData extends Node {
	data: {
		series: {
			id: string;
			title: string;
			units_short: string;
		};
	};
}

interface SeriesDataObservations {
	data: {
		observations: {
			date: string;
			value: number;
		}[];
	};
	isLoading: boolean;
	error: Error;
}

const ChartNode = ({ id }: ChartNodeProps) => {
	const { getEdges, getNode } = useReactFlow();

	// Get all edges connected to this node
	const connectedEdges = getEdges().filter(
		(edge) => edge.source === id || edge.target === id
	);

	// Retrieve incoming and outgoing connections
	const incomingEdges = connectedEdges.filter((edge) => edge.target === id);

	// Get connected nodes based on incoming and outgoing edges
	const incomingNodes = incomingEdges
		.map((edge) => getNode(edge.source) as unknown as NodeData)
		.filter(Boolean);

	const [searchDates, setSearchDates] = useState<DateRange | null>(null);

	const onDateChange = useCallback((dates: DateRange) => {
		setSearchDates(dates);
	}, []);

	console.log(searchDates);

	const seriesData = useGetSeriesObservationsMulti(
		{
			series_ids: incomingNodes?.map((node) => node?.data.series?.id),
			...(searchDates && {
				observation_start: formatObservationDate(searchDates.datestart),
				observation_end: formatObservationDate(searchDates.dateend),
			}),
		},
		{ queries: { enabled: !!incomingNodes.length } }
	) as unknown as SeriesDataObservations[];

	const formattedData: ChartSeries[] = useMemo(() => {
		const _data =
			seriesData?.map((series, i) => {
				const serie = incomingNodes[i]?.data.series;
				const data =
					series?.data?.observations?.map((observation: any) => ({
						x: +new Date(observation.date),
						y: Number(observation.value),
					})) || [];
				const values = data.map((d) => d.y);
				const dates = data.map((d) => d.x);
				return {
					data,
					name: `${serie.title} - ${serie.units_short}`,
					type: "line",
					color: getColor(serie.id),
					min: Math.min(...values),
					max: Math.max(...values),
					minDate: Math.min(...dates),
					maxDate: Math.max(...dates),
				};
			}) || [];

		return _data;
	}, [seriesData]);

	const seriesLoading = seriesData.some((data) => data.isLoading);
	const seriesError = seriesData.find((data) => data.error);

	if (seriesError) {
		throw seriesError;
	}

	return (
		<ChartNodeContainer>
			<Handle type="target" position={Position.Left} />
			<Chart
				data={formattedData}
				isLoading={seriesLoading}
				onDateChange={onDateChange}
				id={id}
			/>
		</ChartNodeContainer>
	);
};

export default (props: ChartNodeProps) => (
	<ErrorBoundary type="chart" message="Error loading chart">
		<ChartNode {...props} />
	</ErrorBoundary>
);
