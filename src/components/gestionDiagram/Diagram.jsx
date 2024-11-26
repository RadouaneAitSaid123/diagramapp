import {useCallback, useRef, useState} from "react";
import {
    addEdge,
    applyEdgeChanges,
    applyNodeChanges,
    Background,
    Controls,
    MiniMap,
    ReactFlow, ReactFlowProvider, useReactFlow,
} from "@xyflow/react";
import '@xyflow/react/dist/style.css';
import '../../styles/gestionDiagram/diagram.css'
import UmlClassNode from "./UmlClassNode";
import DnDProvider, {useDnD} from "./DnDProvider";

const nodeTypes={umlClass: UmlClassNode};
let id=1;
const getId=()=> `node_${id++}`;

function Diagram(){
    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes]=useState(
        [
            {
                id: '1',
                type: 'umlClass',
                position: { x: 250, y: 5 },
                data: {
                    className: 'MaClasse',
                    attributes: ['attribut1 : int', 'attribut2 : string'],
                    methods: ['methode1()', 'methode2()'],
                    onClassNameChange: (newName) => {
                        setNodes((nds) =>
                            nds.map((node) =>
                                node.id === '1' ? { ...node, data: { ...node.data, className: newName } } : node
                            )
                        );
                    },
                },
            },
        ]
    );
    const [edges, setEdges]=useState([]);
    const{screenToFlowPosition}=useReactFlow();
    const [type]=useDnD();
    const onNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
        [setNodes]
    );
    const onEdgesChange = useCallback(
        (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        [setEdges]
    );
    const onConnect = useCallback(
        (connection) => setEdges((edg)=>addEdge(connection,edg)),
        [setEdges]
    )
    const onDrop = useCallback(
        (event) => {
            event.preventDefault();
            if (!type) return; // Si aucun type sélectionné, ne rien faire

            const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
            const position = screenToFlowPosition({
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top,
            });

            const newNode = {
                id: getId(),
                type: type,
                position,
                data: {
                    className: 'NouvelleClasse',
                    attributes: ['attribut1 : string'],
                    methods: ['methode1()'],
                },
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [screenToFlowPosition, type]
    );

    // Gestion du drag au-dessus de la zone
    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);
    const nodeColor = (node) => {
        switch (node.type) {
            case 'input':
                return '#6ede87';
            case 'output':
                return '#6865A5';
            default:
                return '#ff0072';
        }
    };





    return(
        <ReactFlowProvider>
            <div className="diagram-container">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    nodeTypes={nodeTypes}
                    selectionOnDrag
                >
                    <Controls/>
                    <MiniMap nodeColor={nodeColor} nodeStrokeWidth={3} pannable/>
                    <Background variant="dots" gap={12} size={1}/>
                </ReactFlow>
            </div>
        </ReactFlowProvider>

    );
}

export default () => (
    <ReactFlowProvider>
        <DnDProvider>
            <Diagram/>
        </DnDProvider>
    </ReactFlowProvider>
);