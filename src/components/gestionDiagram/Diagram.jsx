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

const nodeTypes = { umlClass: UmlClassNode, umlInterface: UmlClassNode, umlAbstractClass: UmlClassNode };

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
    { id: 'e1-2', source: '1', target: '2', type: 'custom', data: { relationType: 'inheritance', sourceCardinality: '1', targetCardinality: '*' } },
    { id: 'e2-3', source: '2', target: '3', type: 'custom', data: { relationType: 'implementation', sourceCardinality: '0..1', targetCardinality: '1' } },
    { id: 'e3-4', source: '3', target: '4', type: 'custom', data: { relationType: 'aggregation', sourceCardinality: '1', targetCardinality: '0..*' } },
    { id: 'e4-5', source: '4', target: '5', type: 'custom', data: { relationType: 'composition', sourceCardinality: '1', targetCardinality: '1' } },
    { id: 'e1', source: '1', sourceHandle: 'left-source', target: '2', targetHandle: 'right-target' },
];

let id = 0;
const getId = () => `dndnode_${id++}`;

const Diagram = () => {
    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const { screenToFlowPosition } = useReactFlow();
    const [type] = useDnD();

    const updateEdgeData = (id, updatedData) => {
        setEdges((eds) =>
            eds.map((edge) =>
                edge.id === id ? { ...edge, data: { ...edge.data, ...updatedData } } : edge
            )
        );
    };

    // Exemple d'interaction pour changer la cardinalité
    const onEdgeDoubleClick = (event, edge) => {
        const sourceCardinality = prompt("Enter source cardinality:", edge.data.sourceCardinality || "");
        const targetCardinality = prompt("Enter target cardinality:", edge.data.targetCardinality || "");
        // Ne mettez à jour que si l'utilisateur a saisi une valeur
        if (sourceCardinality || targetCardinality) {
            updateEdgeData(edge.id, {
                sourceCardinality: sourceCardinality || edge.data.sourceCardinality,
                targetCardinality: targetCardinality || edge.data.targetCardinality,
            });
        }
    };

    const onConnect = useCallback((connection) => {
        setEdges((edges) =>
            addEdge(
                {
                    ...connection,
                    type: 'custom',
                    data: { relationType: type || "association" },
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
                        id: 0,
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
        ...node, data: { ...node.data, onChange: (newData) => updateNodeData(node.id, newData), },
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
                    onEdgeDoubleClick={onEdgeDoubleClick}
                    fitView
                >
                    <Controls />
                    <Background color="#222" variant={BackgroundVariant.Dots} />
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
