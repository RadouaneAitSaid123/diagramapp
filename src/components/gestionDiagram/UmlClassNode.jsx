import {Handle, NodeToolbar, Position} from "@xyflow/react";
import PropTypes from "prop-types";
import { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faPlus } from "@fortawesome/free-solid-svg-icons";

UmlClassNode.propTypes = {
    data: PropTypes.shape({
        className: PropTypes.string.isRequired,
        attributes: PropTypes.array.isRequired,
        methods: PropTypes.array.isRequired,
        onChange: PropTypes.func.isRequired,
    }).isRequired,
};

function UmlClassNode(props){
    const [isVisible, setIsVisible]=useState(false);
    const [attDIsVisible, setAttDIsVisible]=useState(false);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [selectedType, setSelectedType] = useState(null);

    const wrapperRef = useRef(null);

    // Close toolbars when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsVisible(false);
                setAttDIsVisible(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    function handleDoubleClick() {
        setIsVisible(!isVisible);
    }

    function handleDeleteSelected() {
        if (selectedIndex !== null && selectedType) {
            if (selectedType === "attribute") {
                const updatedAttributes = props.data.attributes.filter((_, index) => index !== selectedIndex);
                props.data.onChange({ attributes: updatedAttributes });
            } else if (selectedType === "method") {
                const updatedMethods = props.data.methods.filter((_, index) => index !== selectedIndex);
                props.data.onChange({ methods: updatedMethods });
            }
            setSelectedIndex(null);
            setSelectedType(null);
        }
    }

    function addAttribut(){
        const newAttribute = { etat: "+", attNom: "newAttr", type: "type" };
        const updatedAttributes = [...props.data.attributes, newAttribute];
        props.data.onChange({ attributes: updatedAttributes });
    }

    function addMethod(){
        const newMethod = { etat: "+", typeRetour: "type", metNom: "method()" };
        const updatedMethods = [...props.data.methods, newMethod];
        props.data.onChange({ methods: updatedMethods });
    }

    const attributsDeClasse = props.data.attributes.map((attribut, index) => (
        <div
            key={index}
            className="divStyle"
            onClick={() => {
                setSelectedIndex(index);
                setSelectedType("attribute");
                setAttDIsVisible(!attDIsVisible);
            }}
        >
            <input
                id="AttEtat"
                value={attribut.etat}
                onChange={(e) => {
                    const updatedAttributes = [...props.data.attributes];
                    updatedAttributes[index].etat = e.target.value;
                    props.data.onChange({ attributes: updatedAttributes });
                }}
            />
            <input
                id="attNom"
                value={attribut.attNom}
                onChange={(e) => {
                    const updatedAttributes = [...props.data.attributes];
                    updatedAttributes[index].attNom = e.target.value;
                    props.data.onChange({ attributes: updatedAttributes });
                }}
            />
            <input
                id="attType"
                value={attribut.type}
                onChange={(e) => {
                    const updatedAttributes = [...props.data.attributes];
                    updatedAttributes[index].type = e.target.value;
                    props.data.onChange({ attributes: updatedAttributes });
                }}
            />
        </div>
    ));

    const methodsDeClasse = props.data.methods.map((methode, index) => (
        <div
            key={index}
            className="divStyle"
            onClick={() => {
                setSelectedIndex(index);
                setSelectedType("method");
                setAttDIsVisible(!attDIsVisible);
            }}
        >
            <input
                id="metEtat"
                value={methode.etat}
                onChange={(e) => {
                    const updatedMethode = [...props.data.methods];
                    updatedMethode[index].etat = e.target.value;
                    props.data.onChange({ methods: updatedMethode });
                }}
            />
            <input
                id="metType"
                value={methode.typeRetour}
                onChange={(e) => {
                    const updatedMethode = [...props.data.methods];
                    updatedMethode[index].typeRetour = e.target.value;
                    props.data.onChange({ methods: updatedMethode });
                }}
            />
            <input
                id="metNom"
                value={methode.metNom}
                onChange={(e) => {
                    const updatedMethode = [...props.data.methods];
                    updatedMethode[index].metNom = e.target.value;
                    props.data.onChange({ methods: updatedMethode });
                }}
            />
        </div>
    ));





    return (
        <div className="class-wrapper" ref={wrapperRef} onDoubleClick={handleDoubleClick}>
            <div className="class-name-wrapper">
                {props.type === "umlInterface" && <div className="specification">&lt;&lt;Interface&gt;&gt;</div>}
                {props.type === "umlAbstractClass" && <div className="specification">&lt;&lt;Abstract&gt;&gt;</div>}
                <input
                    value={props.data.className}
                    onChange={(e) => {
                        props.data.onChange({ className: e.target.value });
                    }}
                />
            </div>
            {attributsDeClasse}
            <div className="lineStyle"></div>
            {methodsDeClasse}
            <NodeToolbar position={Position.Left} isVisible={isVisible}>
                <button onClick={addAttribut} className="bouton">
                    <FontAwesomeIcon icon={faPlus} />
                </button>
                <button className="bouton" onClick={addMethod}>
                    <FontAwesomeIcon icon={faGear} />
                </button>
            </NodeToolbar>
            <NodeToolbar position={Position.Right} isVisible={attDIsVisible}>
                <button onClick={handleDeleteSelected} className="bouton">-</button>
            </NodeToolbar>
            <Handle type="target" position={Position.Top} />
            <Handle type="source" position={Position.Bottom} />
            <Handle
                type="source"
                position={Position.Left}
                id="left-source"
                style={{ top: "50%", background: "#555" }}
            />
            <Handle
                type="target"
                position={Position.Right}
                id="right-target"
                style={{ top: "50%", background: "#555" }}
            />
        </div>
    );
}

export default UmlClassNode;