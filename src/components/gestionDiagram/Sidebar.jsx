import {useDnD} from "./DnDProvider";
import '../../styles/gestionDiagram/Sidebar.css'
function Sidebar(){
    const [_, setType] = useDnD();

    const onDragStart = (event, nodeType) => {
        setType(nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <aside>
                <div className="description">
                    shape your diagram
                </div>
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