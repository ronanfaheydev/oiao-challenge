import {
	Handle,
	NodeResizeControl,
	Panel,
	Position,
	useReactFlow,
} from "@xyflow/react";
import { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import { useGetSeriesObservationsMulti } from "../../../queries";
import ErrorBoundary from "../../ErrorBoundary";
import { Chart, type ChartSeries, type DateRange } from "./Chart";
import { chartHeaderHeight, chartHeight, chartWidth } from "./constants";
import { formatObservationDate } from "./helpers";
import { ResizeIcon } from "./ResizeIcon";

interface ChartNodeProps {
	id: string;
	selected?: boolean;
	width?: number;
	height?: number;
}

interface NodeData extends Node {
	data: {
		series: {
			id: string;
			title: string;
			units_short: string;
			color: string;
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

const controlStyle = {
	background: "transparent",
	border: "none",
};

const ChartNodeContainer = styled.div<{
	$isSelected: boolean;
	$height?: number;
	$width?: number;
}>`
	background-color: white;
	border: 1px solid lightgray;
	border-radius: 5px;
	box-shadow: 0 2px 2px rgba(0, 0, 0, 0.1);
	outline-offset: 2px;
	${({ $isSelected }) => $isSelected && "outline: 2px solid #ff0071;"}
	position: relative;
	min-height: ${({ $height }) => $height}px;
	min-width: ${({ $width }) => $width}px;
	min-width: ${chartWidth}px;
	min-height: ${chartHeight + chartHeaderHeight}px;
`;

const StyledHandle = styled(Handle)<{ $hasConnection: boolean }>`
	background-color: ${({ $hasConnection }) =>
		$hasConnection ? "#ffa705" : "white"};
	border: 2px solid
		${({ $hasConnection }) => ($hasConnection ? "#ffa705" : "lightgray")};
	border-radius: 5px;
	z-index: 110000;

	height: 50px;
	width: 20px;
	margin-left: -5px;

	@media (min-width: 768px) {
		height: 50px;
		width: 20px;
	}
`;

const ChartNode = ({ id, selected, width, height }: ChartNodeProps) => {
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
		.filter(Boolean)
		.filter((node) => node.data.series);

	const [searchDates, setSearchDates] = useState<DateRange | null>(null);

	const onDateChange = useCallback((dates: DateRange) => {
		setSearchDates(dates);
	}, []);

	const seriesData = useGetSeriesObservationsMulti(
		{
			series_ids: incomingNodes?.map((node) => node?.data.series?.id),
			...(searchDates && {
				observation_start: formatObservationDate(searchDates.datestart),
				observation_end: formatObservationDate(searchDates.dateend),
			}),
		},
		{ queries: { enabled: !!incomingNodes.length } } as any
	) as unknown as SeriesDataObservations[];

	const formattedData: ChartSeries[] = useMemo(() => {
		const _data =
			seriesData?.map((series, i) => {
				const serie = incomingNodes[i]?.data.series;
				const data =
					series?.data?.observations?.map((observation: any) => ({
						x: +new Date(observation.date),
						y: Number(observation.value),
						seriesId: serie.id,
					})) || [];
				const values = data.map((d) => d.y);
				const dates = data.map((d) => d.x);
				return {
					data,
					name: `${serie.title} - ${serie.units_short}`,
					chartType: serie.chartType,
					lineStyle: serie.lineStyle,
					barStyle: serie.barStyle,
					color: serie.color,
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
		<>
			<StyledHandle
				type="target"
				position={Position.Left}
				$hasConnection={!!incomingNodes.length}
			/>
			<ChartNodeContainer
				$isSelected={!!selected}
				data-testid="chart-node"
				$height={height}
				$width={width}
			>
				<Chart
					data={formattedData}
					isLoading={seriesLoading}
					onDateChange={onDateChange}
					id={id}
				/>
				<Panel position="bottom-right">
					{selected && (
						<NodeResizeControl
							style={controlStyle}
							minWidth={chartWidth}
							minHeight={chartHeight}
						>
							<ResizeIcon />
						</NodeResizeControl>
					)}
				</Panel>
			</ChartNodeContainer>
		</>
	);
};

export default (props: ChartNodeProps) => (
	<ErrorBoundary type="chart" message="Error loading chart">
		<ChartNode {...props} />
	</ErrorBoundary>
);
