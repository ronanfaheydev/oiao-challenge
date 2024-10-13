import type { Edge, Node } from "@xyflow/react";

export const initialNodes: Node[] = [
	{
		type: "chart",
		id: "chart-1",
		data: {
			chartType: "line",
			title: "Connect a data category to begin",
		},
		position: { x: 500, y: 5 },
	},
	{
		type: "data-category",
		id: "data-category-1",
		data: {},
		position: { x: 100, y: 100 },
	},
];

export const initialEdges: Edge[] = [
	// {
	// 	id: "edge-1",
	// 	source: "data-category-1",
	// 	target: "chart-1",
	// },
];
