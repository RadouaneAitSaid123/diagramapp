import {Handle, NodeToolbar, Position} from "@xyflow/react";
import PropTypes from "prop-types";
import {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";




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

    function handleDoubleClick(){
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






    const attributsDeClasse=props.data.attributes.map((attribut,index)=>(

            <div  key={attribut.id}  className="divStyle" onClick={() => {
                setSelectedIndex(index);
                setSelectedType("attribute");
                setAttDIsVisible(!attDIsVisible);
            }}>
                <input id="AttEtat" value={attribut.etat} onChange={(e) => {
                    const updatedAttributes = [...props.data.attributes];
                    updatedAttributes[index].etat = e.target.value;
                    props.data.onChange({attributes: updatedAttributes});
                }}/>
                <input id="attNom" value={attribut.attNom} onChange={(e) => {
                    const updatedAttributes = [...props.data.attributes];
                    updatedAttributes[index].attNom = e.target.value;
                    props.data.onChange({attributes: updatedAttributes});
                }}/>
                <input id="attType" value={attribut.type} onChange={(e) => {
                    const updatedAttributes = [...props.data.attributes];
                    updatedAttributes[index].type = e.target.value;
                    props.data.onChange({attributes: updatedAttributes});
                }}/>
            </div>


    ));

    const methodsDeClasse = props.data.methods.map((methode, index) => (
        <div key={methode.id} className="divStyle"  onClick={() => {
            setSelectedIndex(index);
            setSelectedType("method");
            setAttDIsVisible(!attDIsVisible);
        }} >
            <input id="metEtat" value={methode.etat} onChange={(e) => {
                const updatedMethode = [...props.data.methods];
                updatedMethode[index].etat = e.target.value;
                props.data.onChange({methods: updatedMethode});
            }}/>
            <input id="metType" value={methode.typeRetour} onChange={(e) => {
                const updatedMethode = [...props.data.methods];
                updatedMethode[index].typeRetour = e.target.value;
                props.data.onChange({methods: updatedMethode});
            }}/>
            <input id="metNom" value={methode.metNom} onChange={(e) => {
                const updatedMethode = [...props.data.methods];
                updatedMethode[index].metNom = e.target.value;
                props.data.onChange({methods: updatedMethode});
            }}/>
        </div>
    ));





    return (
        <div className="class-wrapper" onDoubleClick={handleDoubleClick}>
            <div className="class-name-wrapper">
                <input value={props.data.className} onChange={(e)=>{props.data.onChange({className: e.target.value})}}/>
            </div>
            {attributsDeClasse}
            <div className="lineStyle"></div>
            {methodsDeClasse}
            <NodeToolbar position={Position.Left} isVisible={isVisible}>
                <button onClick={addAttribut}>
                    <FontAwesomeIcon icon="fa-solid fa-plus" />
                </button>
                <button onClick={addMethod}>
                    <FontAwesomeIcon icon="fa-solid fa-grip-lines" />
                </button>
            </NodeToolbar>
            <NodeToolbar position={Position.Right} isVisible={attDIsVisible}>
                <button onClick={handleDeleteSelected}>-</button>
            </NodeToolbar>
            <Handle type="target" position={Position.Top}/>
            <Handle type="source" position={Position.Bottom}/>
        </div>
    );
}

export default UmlClassNode;