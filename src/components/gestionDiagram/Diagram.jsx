import React, {useCallback, useRef} from "react";
import {
    addEdge,
    Background,
    Controls,
    MiniMap,
    ReactFlow, ReactFlowProvider, useEdgesState, useNodesState, useReactFlow,
} from "@xyflow/react";
import '@xyflow/react/dist/style.css';
import '../../styles/gestionDiagram/diagram.css'
import UmlClassNode from "./UmlClassNode";
import Sidebar from "./Sidebar";
import DnDProvider, {useDnD} from "./DnDProvider";

const nodeTypes={umlClass: UmlClassNode};



const initialNodes=[
    {
        id: '1',
        type: 'umlClass',
        position: {x: 250, y: 5},
        data: {
            className: 'MaClasse',
            attributes: ['attribut1 : int', 'attribut2 : string'],
            methods: ['methode1()', 'methode2()'],
        },
    },
]
const initialEdges = [{ id: 'e1-2', source: '1', target: '2', animated:true }];
let id = 0;
const getId = () => `dndnode_${id++}`;

const Diagram = () => {
    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const { screenToFlowPosition } = useReactFlow();
    const [type] = useDnD();

    const onConnect = useCallback(
        (connection) => setEdges((edg)=>addEdge(connection,edg)),
        [setEdges]
    )
    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event) => {
            event.preventDefault();

            if (!type) {
                return;
            }


            const position = screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });
            const newNode = {
                id: getId(),
                type,
                position,
                data: {
                    className: 'MaClasse',
                    attributes: ['attribut1 : int', 'attribut2 : string'],
                    methods: ['methode1()', 'methode2()'],
                },
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [screenToFlowPosition, type],
    );



    return (
        <div className="dndflow">
            <div className="diagram-container" ref={reactFlowWrapper}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    nodeTypes={nodeTypes}
                    fitView
                    style={{ backgroundColor: "#F7F9FB" }}
                >
                    <Controls />
                    <Background />
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
