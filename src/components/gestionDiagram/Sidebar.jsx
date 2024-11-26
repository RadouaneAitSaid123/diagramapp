import {useDnD} from "./DnDProvider";

function Sidebar(){
    const [_, setType] = useDnD();

    const onDragStart = (event, nodeType) => {
        setType(nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <aside className="sidebar">
            <div className="description">Glissez un élément vers le diagramme.</div>
            <div
                className="dndnode"
                onDragStart={(event) => onDragStart(event, 'umlClass')}
                draggable
            >
                Classe UML
            </div>
        </aside>
    );
}

export default Sidebar;