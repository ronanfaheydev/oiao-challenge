import type { Edge, Node } from "@xyflow/react";
import { CHART_NODE, DATA_NODE, type NodeType } from "./nodeTypes";

export const initialNodesDefaults: Record<NodeType, any> = {
	[CHART_NODE]: {
		type: CHART_NODE,
		data: {
			chartType: "line",
			title: "Connect a data category to begin",
		},
		height: 400,
		width: 800,
	},
	[DATA_NODE]: {
		type: DATA_NODE,
		data: {},
	},
};

export const initialNodes: Node[] = [
	{
		type: CHART_NODE,
		id: "chart-1",
		data: {
			chartType: "line",
			title: "Connect a data category to begin",
		},
		position: { x: 500, y: 5 },
		height: 400,
		width: 800,
	},
	{
		type: DATA_NODE,
		id: "data-node-1",
		data: {},
		position: { x: 50, y: 10 },
	},
];

export const initialEdges: Edge[] = [];
