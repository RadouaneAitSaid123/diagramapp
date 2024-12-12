import { useDnD } from "./DnDProvider";
import '../../styles/gestionDiagram/Sidebar.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightLong } from '@fortawesome/free-solid-svg-icons';
import { faDiamond } from '@fortawesome/free-solid-svg-icons';
import { faStairs } from '@fortawesome/free-solid-svg-icons';
import { faMinus } from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";


export default Sidebar;

function Sidebar() {
    const [type, setType] = useDnD();
    const [navigability, setNavigability] = useState('unidirectional');

    const onDragStart = (event, nodeType) => {
        setType(nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    const handleNavigabilityChange = (event) => {
        setNavigability(event.target.value);
    };

    return (
        <aside>
            <div className="list-group">
                <a href="#" className="list-group-item list-group-item-action active description" aria-current="true">
                    Shape your diagram
                </a>
                <a href="#" className="list-group-item list-group-item-action dndnode" onDragStart={(event) => onDragStart(event, 'umlClass')}
                    draggable> Classe UML</a>
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

            <div className="navigability-section">
                <div className="navigability-header">Navigabilité</div>
                <div className="navigability-dropdown">
                    <label htmlFor="navigability-type">Type de navigabilité :</label>
                    <select
                        id="navigability-type"
                        value={navigability}
                        onChange={handleNavigabilityChange}
                    >
                        <option value="unidirectional">Unidirectionnelle</option>
                        <option value="bidirectional">Bidirectionnelle</option>
                    </select>
                </div>
            </div>
        </aside>
    );
}

