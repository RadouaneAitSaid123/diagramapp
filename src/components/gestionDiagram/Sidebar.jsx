import { useDnD } from "./DnDProvider";
import '../../styles/gestionDiagram/Sidebar.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightLong } from '@fortawesome/free-solid-svg-icons';
import { faDiamond } from '@fortawesome/free-solid-svg-icons';
import { faStairs } from '@fortawesome/free-solid-svg-icons';
import { faMinus } from '@fortawesome/free-solid-svg-icons';


export default Sidebar;

function Sidebar() {
    const [type, setType] = useDnD();

    const onDragStart = (event, nodeType) => {
        setType(nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };
    return (
        <aside>
            <div className="list-group">
                <a href="#" className="list-group-item list-group-item-action active description" aria-current="true">
                    Shape your diagram
                </a>
                <a href="#" className="list-group-item list-group-item-action dndnode" onDragStart={(event) => onDragStart(event, 'umlClass')}
                    draggable> Classe UML</a>
                     <a href="#" className="list-group-item list-group-item-action dndnode" onDragStart={(event) => onDragStart(event, 'umlInterface')}
                    draggable> Interface</a>
                     <a href="#" className="list-group-item list-group-item-action dndnode" onDragStart={(event) => onDragStart(event, 'umlAbstractClass')}
                    draggable> Abstract</a>
            </div>

            <div className="list-group">
                <a href="#" className="list-group-item list-group-item-action active" aria-current="true">
                    Relations
                </a>
                <a href="#" className="list-group-item list-group-item-action" onClick={() => setType('association')}>Association <FontAwesomeIcon icon={faStairs} /></a>
                <a href="#" className="list-group-item list-group-item-action" onClick={() => setType('inheritance')}>Héritage <FontAwesomeIcon icon={faRightLong} /></a>
                <a href="#" className="list-group-item list-group-item-action" onClick={() => setType('implementation')}>Implémentaion <FontAwesomeIcon icon={faMinus} /> <FontAwesomeIcon icon={faMinus} /> <FontAwesomeIcon icon={faMinus} /></a>
                <a href="#" className="list-group-item list-group-item-action" onClick={() => setType('aggregation')}>Agréggation</a>
                <a href="#" className="list-group-item list-group-item-action" onClick={() => setType('composition')}>Composition <FontAwesomeIcon icon={faDiamond} /></a>
            </div>

            <div className="list-group">
                <a href="#" className="list-group-item list-group-item-action active" aria-current="true">
                    Navigabilité
                </a>
                <a href="#" className="list-group-item list-group-item-action" onClick={() => setType('unidirectionnelle')}>Unidirectionnelle</a>
                <a href="#" className="list-group-item list-group-item-action" onClick={() => setType('bidirectional')}>Bidirectionnelle </a>
            </div>

        </aside>
    );
}