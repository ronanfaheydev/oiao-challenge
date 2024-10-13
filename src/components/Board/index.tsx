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
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useEffect, useMemo } from "react";
import "./Board.scss";
import BoardContext from "./context";
import { initialEdges, initialNodes } from "./init-nodes";
import { nodeTypes } from "./nodeTypes";

function Board() {
	const { fitView } = useReactFlow();
	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

	const onReset = useCallback(() => {
		setNodes(initialNodes);
		setEdges(initialEdges);
		fitView();
	}, [setNodes, setEdges]);

	const onConnect = useCallback(
		(params: Connection) => {
			setEdges((eds) => addEdge(params, eds));
		},
		[setEdges]
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
		(type: string) => {
			setNodes((nds) => {
				const nodesOfType = nds.filter((node) => node.type === type);
				const maxYNode = nodesOfType.reduce((max, node) => {
					return node.position.y > max.position.y ? node : max;
				}, nodesOfType[0]);

				return [
					...nds,
					{
						id: `${type}-${nodesOfType.length + 1}`,
						data: { isReady: false },
						position: {
							x: maxYNode.position.x,
							y: maxYNode.position.y + (maxYNode.measured?.height || 0) + 20,
						},
						type: type,
					},
				];
			});
		},
		[setNodes]
	);

	const updateNode = useCallback(
		(id: string, data: any) => {
			setNodes((nds) => {
				const node = nds.find((node) => node.id === id);
				if (node) {
					const _node = {
						...node,
						data: { ...node.data, ...data },
					};
					// force update all nodes to re-render
					return [
						...nds
							.filter((node) => node.id !== id)
							.map((node) => ({ ...node })),
						_node,
					];
				}

				return nds;
			});
		},
		[setNodes]
	);

	// hook to allow nodes to be updated from the component
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
				>
					<Panel position="top-right">
						<button onClick={onReset}>Reset</button>
					</Panel>
					<Panel position="top-left">
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
