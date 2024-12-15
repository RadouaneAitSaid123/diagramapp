import React, {useCallback, useRef} from "react";
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
import DnDProvider, {useDnD} from "./DnDProvider";


const nodeTypes={umlClass: UmlClassNode, umlInterface: UmlClassNode, umlAbstractClass: UmlClassNode};
const initialNodes=[
    {
        id: '1',
        type: 'umlClass',
        position: {x: 0, y: 0},
        data: {
            className: 'Ma Classe',
            attributes: [
                {
                    etat:'+',
                    attNom:'nomAttribut',
                    type:'type'
                }
            ],

            methods: [
                {
                    etat:'+',
                    typeRetour:'type',
                    metNom:'methode()'
                }
            ],
            onChange: ()=>{}
        },
    },

]
const initialEdges = [{ id: 'e1-2', source: '1', target: '2', animated:true }];

let id = 0;
const getId = () => `dndnode_${id++}`;

const Diagram = () => {
    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const { screenToFlowPosition } = useReactFlow();
    const [type] = useDnD();
    const onConnect = useCallback((connection) => setEdges((edg)=>addEdge(connection,edg)), [setEdges])
    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);
    const onDrop = useCallback((event) => {
            event.preventDefault();
            if (!type) {return;}
            const position = screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });
            const newNode = {
                id: getId(),
                type,
                position,
                data: {
                    className: 'Nom',
                    attributes: [
                        {
                            id:0,
                            etat:'+',
                            attNom:'nomAttribut',
                            type:'type'
                        }
                    ],

                    methods: [
                        {
                            id:0,
                            etat:'+',
                            typeRetour:'type',
                            metNom:'methode()'
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

    const nodesWithHandlers = nodes.map((node) => ({
        ...node, data: {...node.data, onChange: (newData) => updateNodeData(node.id, newData),},
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
                    fitView
                >
                    <Controls />
                    <Background color="#222" variant={BackgroundVariant.Lines}/>
                    <MiniMap/>
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
