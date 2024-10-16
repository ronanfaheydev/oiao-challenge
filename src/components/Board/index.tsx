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
import styled from "styled-components";
import { useIsMobile } from "../../hooks/useIsMobile";
import BoardContext from "./context";
import { initialEdges, initialNodes, initialNodesDefaults } from "./init-nodes";
import { CHART_NODE, DATA_NODE, nodeTypes, type NodeType } from "./nodeTypes";

const BoardContainer = styled.div`
	height: 100vh;
	width: 100vw;
`;

function Board() {
	const { fitView } = useReactFlow();
	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

	const onReset = useCallback(() => {
		setNodes(
			initialNodes.map((node) => ({
				...node,
				id: `node-${+new Date()}`,
			}))
		);
		setEdges(
			initialEdges.map((edge) => ({
				...edge,
				id: `edge-${+new Date()}`,
				data: {},
			}))
		);
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
		(type: NodeType) => {
			setNodes((nds) => {
				const nodesOfType = nds.filter((node) => node.type === type);
				const maxYNode = nodesOfType.reduce((max, node) => {
					return node.position.y > max.position.y ? node : max;
				}, nodesOfType[0]);

				return [
					...nds,
					{
						...initialNodesDefaults[type],
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

	const isMobile = useIsMobile();

	useEffect(() => {
		fitView();
	}, [fitView]);

	return (
		<BoardContext.Provider value={boardCtx}>
			<BoardContainer>
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
						<Button color="error" onClick={onReset}>
							Reset
						</Button>
					</Panel>
					<Panel position="top-left">
						<Button
							onClick={() => addNode(CHART_NODE)}
							data-testid="add-chart-btn"
						>
							Add Chart
						</Button>
						<Button
							onClick={() => addNode(DATA_NODE)}
							data-testid="add-data-btn"
						>
							Add Data Category
						</Button>
					</Panel>
					<Background />
					<Controls />
					{!isMobile && <MiniMap />}
				</ReactFlow>
			</BoardContainer>
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
