import PropTypes from "prop-types";
import {Handle, Position} from "@xyflow/react";


UmlInterfaceNode.propTypes = {
    data: PropTypes.shape({
        className: PropTypes.string.isRequired,
        attributes: PropTypes.array.isRequired,
        methods: PropTypes.array.isRequired,
        onChange: PropTypes.func.isRequired,
    }).isRequired,
};
function UmlInterfaceNode(props){

    const attributsInterface=props.data.attributes.map((attribut,index)=>(
        <div key={attribut.id} className="divStyle">
            <input id="AttEtat" value={attribut.etat} onChange={(e)=>{
                const updatedAttributes = [...props.data.attributes];
                updatedAttributes[index].etat = e.target.value;
                props.data.onChange({attributes: updatedAttributes});
            }}/>
            <input id="attNom" value={attribut.attNom} onChange={(e)=>{
                const updatedAttributes = [...props.data.attributes];
                updatedAttributes[index].attNom = e.target.value;
                props.data.onChange({attributes: updatedAttributes});
            }}/>
            <input id="attType" value={attribut.type} onChange={(e)=>{
                const updatedAttributes = [...props.data.attributes];
                updatedAttributes[index].type = e.target.value;
                props.data.onChange({attributes: updatedAttributes});
            }}/>
        </div>
    ));

    const methodsInterface=props.data.methods.map((methode,index)=>(
        <div key={methode.id} className="divStyle">
            <input id="metEtat" value={methode.etat} onChange={(e)=>{
                const updatedMethode=[...props.data.methods];
                updatedMethode[index].etat=e.target.value;
                props.data.onChange({methods:updatedMethode});
            }}/>
            <input id="metType" value={methode.typeRetour}  onChange={(e)=>{
                const updatedMethode=[...props.data.methods];
                updatedMethode[index].typeRetour=e.target.value;
                props.data.onChange({methods:updatedMethode});
            }}/>
            <input id="metNom" value={methode.metNom}  onChange={(e)=>{
                const updatedMethode=[...props.data.methods];
                updatedMethode[index].metNom=e.target.value;
                props.data.onChange({methods:updatedMethode});
            }}/>
        </div>
    ));

    return (
        <div className="class-wrapper">
            <div className="class-name-wrapper">
                <p>interface</p>
                <input value={props.data.className} onChange={(e) => {
                props.data.onChange({className: e.target.value})
            }}/>
            </div>
            {attributsInterface}
            <div className="lineStyle"></div>
            {methodsInterface}
            <Handle type="target" position={Position.Top}/>
            <Handle type="source" position={Position.Bottom}/>
        </div>
    );
}
export default UmlInterfaceNode;