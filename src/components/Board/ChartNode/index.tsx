import { Handle, Position, useReactFlow } from "@xyflow/react";
import { useMemo } from "react";
import styled from "styled-components";
import { useGetSeriesObservationsMulti } from "../../../queries";
import { Chart, type ChartSeries } from "./Chart";

const ChartNodeContainer = styled.div`
	background-color: white;
	border: 1px solid #ccc;
	border-radius: 5px;
	box-shadow: 0 2px 2px rgba(0, 0, 0, 0.1);
	padding: 10px;
	min-width: 400px;
	min-height: 300px;
`;

// generate hex colors from the series id
const generateColor = (series_id) => {
	const color =
		series_id
			.split("")
			.map((char) => char.charCodeAt(0))
			.reduce((acc, charCode) => acc + charCode, 0) + "000000";

	return `#${color.toString(16).slice(0, 6)}`;
};
const colorMap = {};
const getColor = (series_id) => {
	if (colorMap[series_id]) {
		return colorMap[series_id];
	}
	const color = generateColor(series_id);
	colorMap[series_id] = color;
	return color;
};

const ChartNode = ({ data, id }) => {
	const { getEdges, getNode } = useReactFlow();

	// Get all edges connected to this node
	const connectedEdges = getEdges().filter(
		(edge) => edge.source === id || edge.target === id
	);

	// Retrieve incoming and outgoing connections
	const incomingEdges = connectedEdges.filter((edge) => edge.target === id);

	// Get connected nodes based on incoming and outgoing edges
	const incomingNodes = incomingEdges
		.map((edge) => getNode(edge.source))
		.filter(Boolean);

	const seriesData = useGetSeriesObservationsMulti(
		{
			series_ids: incomingNodes?.map((node) => node.data.series?.id),
		},
		{ query: { enabled: !!incomingNodes.length } }
	);

	const formattedData: ChartSeries[] = useMemo(() => {
		const _data =
			seriesData?.map((series, i) => {
				const serie = incomingNodes[i]?.data.series;
				return {
					data:
						series?.data?.observations?.map((observation: any) => ({
							x: +new Date(observation.date),
							y: Number(observation.value),
						})) || [],
					name: `${serie.title} - ${serie.units_short}`,
					type: "line",
					color: getColor(serie.id),
				};
			}) || [];

		// add min and max values for each series
		_data.forEach((s) => {
			const values = s.data.map((d) => d.y);
			const dates = s.data.map((d) => d.x);
			s.min = Math.min(...values);
			s.max = Math.max(...values);
			s.minDate = Math.min(...dates);
			s.maxDate = Math.max(...dates);
		});

		return _data;
	}, [seriesData]);

	return (
		<ChartNodeContainer>
			<Handle type="target" position={Position.Left} />
			<Chart data={formattedData} />
		</ChartNodeContainer>
	);
};

export default ChartNode;
