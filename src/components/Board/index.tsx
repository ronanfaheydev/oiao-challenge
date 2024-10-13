import { Button } from "@mui/material";
import {
	Background,
	Controls,
	MiniMap,
	Panel,
	ReactFlow,
	ReactFlowProvider,
	addEdge,
	useEdgesState,
	useNodesState,
	useReactFlow,
	type Connection,
	type Edge,
	type Node,
	type ResizeParamsWithDirection,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { stratify, tree } from "d3-hierarchy";
import { useCallback, useEffect, useMemo } from "react";
import "./Board.scss";
import BoardContext from "./context";
import { nodeTypes } from "./nodeTypes";

const g = tree();

const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
	if (nodes.length === 0) return { nodes, edges };

	const { width, height } = document
		.querySelector(`[data-id="${nodes[0].id}"]`)
		.getBoundingClientRect();
	const hierarchy = stratify()
		.id((node) => node.id)
		.parentId((node) => edges.find((edge) => edge.target === node.id)?.source);
	const root = hierarchy(nodes);
	const layout = g.nodeSize([width * 2, height * 2])(root);

	return {
		nodes: layout
			.descendants()
			.map((node) => ({ ...node.data, position: { x: node.x, y: node.y } })),
		edges,
	};
};

const initialNodes: any = [
	{
		type: "chart",
		id: "chart-1",
		data: {
			chartType: "line",
		},
		position: { x: 500, y: 5 },
	},
	{
		type: "data-category",
		id: "data-category-1",
		data: { isReady: false },
		position: { x: 100, y: 100 },
	},
];

const initialEdges: any = [];

function Board() {
	const { fitView } = useReactFlow();
	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

	const onReset = useCallback(() => {
		setNodes(initialNodes);
		setEdges(initialEdges);
	}, [setNodes, setEdges]);

	const onLayout = useCallback(
		(direction: ResizeParamsWithDirection) => {
			const { nodes: layoutedNodes, edges: layoutedEdges } =
				getLayoutedElements(nodes, edges, {
					direction: direction || "LR",
				});

			setNodes([...layoutedNodes]);
			setEdges([...layoutedEdges]);

			window.requestAnimationFrame(() => {
				fitView();
			});
		},
		[nodes, edges]
	);

	const onConnect = useCallback(
		(params: Connection) => {
			setEdges((eds) => addEdge(params, eds));
		},
		[setEdges, fitView]
	);
	// Force update nodes or re-render to ensure the layout updates after a connection
	useEffect(() => {
		setNodes((nds) =>
			nds.map((node) => ({
				...node,
				data: { ...node.data },
			}))
		);
	}, [edges]);

	const addNode = useCallback(
		(type?: string) => {
			setNodes((nds) => [
				...nds,
				{
					id: (nds.length + 1).toString(),
					data: { isReady: false },
					position: { x: 100, y: nds.length * 100 },
					type: type || "data-category",
				},
			]);
			fitView();
		},
		[setNodes, fitView]
	);

	const updateNode = useCallback(
		(id, data) => {
			setNodes((nds) => {
				const node = nds.find((node) => node.id === id);
				node.data = { ...node?.data, ...data };
				return [...nds];
			});
		},
		[setNodes]
	);

	const boardCtx = useMemo(
		() => ({
			updateNode: updateNode,
		}),
		[updateNode]
	);

	return (
		<BoardContext.Provider value={boardCtx}>
			<div style={{ height: "100vh", width: "100vw" }}>
				<ReactFlow
					nodes={nodes}
					onNodesChange={onNodesChange}
					edges={edges}
					onEdgesChange={onEdgesChange}
					onConnect={onConnect}
					fitView
					nodeTypes={nodeTypes}
					// onClick={canAddNode ? addNode : undefined}
				>
					<Panel position="top-right">
						<button onClick={onReset}>Reset</button>
					</Panel>
					<Panel position="top-left">
						{/* <button onClick={onLayout}>Reset layout</button> */}
						<Button onClick={() => addNode("chart")}>Add Chart</Button>
						<Button onClick={() => addNode("data-category")}>
							Add Data Category
						</Button>
					</Panel>
					<Background />
					<Controls />
					<MiniMap />
				</ReactFlow>
			</div>
		</BoardContext.Provider>
	);
}

export default function () {
	return (
		<ReactFlowProvider>
			<Board />
		</ReactFlowProvider>
	);
}
