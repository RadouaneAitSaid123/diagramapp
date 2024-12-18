import React, { useCallback, useRef, useState,forwardRef,  useImperativeHandle, useContext, useEffect } from "react";
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
import { DiagramContext } from '../../App';

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

const Diagram = forwardRef((props, ref) => {
    const { updateDiagramData } = useContext(DiagramContext);
    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const { screenToFlowPosition } = useReactFlow();
    const [type] = useDnD();

    useEffect(() => {
        updateDiagramData(nodes, edges);
    }, [nodes, edges, updateDiagramData]);
    useImperativeHandle(ref, () => ({
        generateJSON: () => generateJSON()
    }));

    const updateEdgeData = (edgeId, newData, id, updatedData) => {
        setEdges((eds) =>
            eds.map((edge) => {
                if (edge.id === edgeId) {
                    return {
                        ...edge,
                        data: {
                            ...edge.data,
                            ...newData,
                        },
                    };
                }
                return edge;
            })
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

    const generateJSON = () => {
        const diagramData = {
            classes: nodes.map(node => ({
                id: node.id,
                type: node.type,
                className: node.data.className,
                attributes: node.data.attributes ? node.data.attributes.map(attr => ({
                    visibility: attr.etat || '+',
                    name: attr.attNom || '',
                    type: attr.type || ''
                })) : [],
                methods: node.data.methods ? node.data.methods.map(method => ({
                    visibility: method.etat || '+',
                    returnType: method.typeRetour || '',
                    name: method.metNom || ''
                })) : []
            })),
            relationships: edges.map(edge => {
                // Vérification de l'existence de edge.data
                const data = edge.data || {};
                return {
                    id: edge.id,
                    sourceClass: edge.source,
                    targetClass: edge.target,
                    type: data.relationType || 'association',
                    sourceCardinality: data.sourceCardinality || '1',
                    targetCardinality: data.targetCardinality || '1'
                };
            })
        };
        return diagramData;
    };



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
});

const DiagramWithProvider = forwardRef((props, ref) => (
    <ReactFlowProvider>
<<<<<<< HEAD
        <DnDProvider>
            <Diagram ref={ref} />
        </DnDProvider>
=======
            <DnDProvider>
                <Diagram />
            </DnDProvider>
>>>>>>> sauvegarde-diagram
    </ReactFlowProvider>
));

export default DiagramWithProvider;
