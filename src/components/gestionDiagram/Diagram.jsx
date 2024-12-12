import React, { useCallback, useRef } from "react";
import CustomEdge from "./CustomEdge";
import {
    addEdge,
    Background, BackgroundVariant,
    Controls,
    MiniMap,
    ReactFlow, ReactFlowProvider, useEdgesState, useNodesState, useReactFlow,
} from "@xyflow/react";
import '@xyflow/react/dist/style.css';
import '../../styles/gestionDiagram/diagram.css'
import UmlClassNode from "./UmlClassNode";
import Sidebar from "./Sidebar";
import DnDProvider, { useDnD } from "./DnDProvider";

const nodeTypes = { umlClass: UmlClassNode };
const initialNodes = [
    {
        id: '1',
        type: 'umlClass',
        position: { x: 0, y: 0 },
        data: {
            className: 'Ma Classe',
            attributes: [
                {
                    etat: '+',
                    attNom: 'nomAttribut',
                    type: 'type'
                }
            ],

            methods: [
                {
                    etat: '+',
                    typeRetour: 'type',
                    metNom: 'methode()'
                }
            ],
            onChange: () => { }
        },
    },
]

const initialEdges = [
    { id: 'e1-2', source: '1', target: '2', type: 'custom', data: { relationType: 'inheritance' } },
    { id: 'e2-3', source: '2', target: '3', type: 'custom', data: { relationType: 'implementation' } },
    { id: 'e3-4', source: '3', target: '4', type: 'custom', data: { relationType: 'aggregation' } },
    { id: 'e4-5', source: '4', target: '5', type: 'custom', data: { relationType: 'composition' } },
    { id: 'e5-6', source: '5', target: '6', type: 'custom', data: { relationType: 'composition' } },
    { id: 'e6-7', source: '6', target: '7', type: 'custom', data: { relationType: 'composition' } },
];

let id = 0;
const getId = () => `dndnode_${id++}`;

const Diagram = () => {
    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const { screenToFlowPosition } = useReactFlow();
    const [type] = useDnD();
    
    const onConnect = useCallback((connection) => {
        setEdges((edges) =>
            addEdge(
                {
                    ...connection,
                    type: 'custom',
                    data: { relationType: type  || "association" },
                },
                edges
            )
        );
    }, [setEdges, type]);

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);
    const onDrop = useCallback((event) => {
        event.preventDefault();
        if (!type) { return; }
        const position = screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
        });
        const newNode = {
            id: getId(),
            type,
            position,
            data: {
                className: 'Ma Classe',
                attributes: [
                    {
                        etat: '+',
                        attNom: 'nomAttribut',
                        type: 'type'
                    }
                ],

                methods: [
                    {
                        etat: '+',
                        typeRetour: 'type',
                        metNom: 'methode()'
                    }
                ],
            },
        };

        setNodes((nds) => nds.concat(newNode));
    }, [screenToFlowPosition, type],);
    const updateNodeData = (id, updatedData) => {
        setNodes((nds) =>
            nds.map((node) =>
                node.id === id ? { ...node, data: { ...node.data, ...updatedData } } : node
            )
        );
    };
    const edgeTypes = {
        custom: CustomEdge,
    };
    const nodesWithHandlers = nodes.map((node) => ({
        ...node,
        data: {
            ...node.data,
            onChange: (newData) => updateNodeData(node.id, newData),
        },
    }));





    return (
        <div className="dndflow">
            <div className="diagram-container" ref={reactFlowWrapper}>
                <ReactFlow
                    nodes={nodesWithHandlers}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                    fitView
                >
                    <Controls />
                    <Background color="#222" variant={BackgroundVariant.Lines} />
                    <MiniMap />
                </ReactFlow>
            </div>
            <Sidebar />
        </div>
    );
};

export default () => (
    <ReactFlowProvider>
        <DnDProvider>
            <Diagram />
        </DnDProvider>
    </ReactFlowProvider>
);
