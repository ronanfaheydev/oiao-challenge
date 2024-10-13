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
		height: 400,
		width: 800,
	},
	{
		type: "data-category",
		id: "data-category-1",
		data: {},
		position: { x: 50, y: 10 },
	},
];

export const initialEdges: Edge[] = [
	// {
	// 	id: "edge-1",
	// 	source: "data-category-1",
	// 	target: "chart-1",
	// },
];
