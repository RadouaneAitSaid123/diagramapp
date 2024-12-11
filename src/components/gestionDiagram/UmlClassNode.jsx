import {Handle, NodeToolbar, Position} from "@xyflow/react";
import PropTypes from "prop-types";
import {useRef, useState} from "react";


UmlClassNode.propTypes = {
    data: PropTypes.shape({
        className: PropTypes.string.isRequired,
        attributes: PropTypes.array.isRequired,
        methods: PropTypes.array.isRequired,
        onChange: PropTypes.func.isRequired,
    }).isRequired,
};

function UmlClassNode({ data }){
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
    const attributeRefs = useRef([]);

    const handleDeleteAttribute = () => {
        if (selectedIndex !== null) {
            const updatedAttributes = data.attributes.filter((_, index) => index !== selectedIndex);
            data.onChange({ attributes: updatedAttributes });
            setSelectedIndex(null); // Réinitialiser l'index sélectionné après suppression
        }
    };
    const handleSelectAttribute = (index) => {
        setSelectedIndex(index);

        const element = attributeRefs.current[index];
        if (element) {
            const rect = element.getBoundingClientRect();
            setToolbarPosition({
                top: rect.top + window.scrollY, // Prendre en compte le scroll vertical
                left: rect.left + rect.width + 10, // Décalage horizontal pour le positionnement
            });
        }
    };


    const fields = data.attributes.map((attribut, index) => (
        <div
            ref={(el) => (attributeRefs.current[index] = el)}
            onClick={() => setSelectedIndex(index)}
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: selectedIndex === index ? "#444" : "#282828",
                padding: "5px, 10px",
                color: "white",
            }}
            key={attribut.Nom}
        >

                <input
                    id="AttEtat"
                    type="text"
                    value={attribut.etat}
                    onChange={(e) => {
                        const updatedAttributes = [...data.attributes];
                        updatedAttributes[index].etat = e.target.value;
                        data.onChange({attributes: updatedAttributes});
                    }}
                />
                <input
                    id="attNom"
                    type="text"
                    value={attribut.attNom}
                    onChange={(e) => {
                        const updatedAttributes = [...data.attributes];
                        updatedAttributes[index].attNom = e.target.value;
                        data.onChange({attributes: updatedAttributes});
                    }}
                />
                <input
                    id="attType"
                    type="text"
                    value={attribut.type}
                    onChange={(e) => {
                        const updatedAttributes = [...data.attributes];
                        updatedAttributes[index].type = e.target.value;
                        data.onChange({attributes: updatedAttributes});
                    }}
                />
                {/* Toggle NodeToolbar visibility */}

        </div>
    ));

    return (
        <div className="class-wrapper">
            <div className="class-name-wrapper">
                <input
                    value={data.className}
                    onChange={(e) => data.onChange({className: e.target.value})}
                    className="nodrag"
                />
            </div>

            {fields}
            {selectedIndex !== null && (
                <NodeToolbar
                    style={{
                        position: "absolute",
                        top: `${toolbarPosition.top}px`,
                        left: `${toolbarPosition.left}px`,
                    }}
                >
                    <button
                        onClick={() => {
                            // Ajouter un nouvel attribut
                            const newAttribute = { etat: "+", attNom: "newAttr", type: "type" };
                            const updatedAttributes = [...data.attributes, newAttribute];
                            data.onChange({ attributes: updatedAttributes });
                        }}
                    >
                        +
                    </button>
                    <button onClick={handleDeleteAttribute}>-</button>
                </NodeToolbar>
            )}
            <div
                style={{
                    height: "1px",
                    backgroundColor: "white",
                    margin: "10px 0",
                }}
            ></div>

            {/* Other fields for methods can go here */}

            <Handle type="target" position={Position.Top}/>
            <Handle type="source" position={Position.Bottom}/>
        </div>
    );
}

export default UmlClassNode;