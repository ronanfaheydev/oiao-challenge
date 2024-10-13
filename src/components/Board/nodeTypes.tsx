import type { NodeTypes } from "@xyflow/react";
import ChartNode from "./ChartNode";
import DataNode from "./DataSourceNode";

export const CHART_NODE = "chart-node";
export const DATA_NODE = "data-node";

export type NodeType = typeof CHART_NODE | typeof DATA_NODE;

export const nodeTypes: NodeTypes = {
	"data-node": DataNode,
	"chart-node": ChartNode,
};
