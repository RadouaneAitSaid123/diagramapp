import {Handle, Position} from "@xyflow/react";
import PropTypes from "prop-types";


UmlClassNode.propTypes = {
    data: PropTypes.shape({
        className: PropTypes.string.isRequired,
        attributes: PropTypes.array.isRequired,
        methods: PropTypes.array.isRequired,
        onChange: PropTypes.func.isRequired,
    }).isRequired,
};

function UmlClassNode({ data }){


   const fields=data.attributes.map((attribut,index) =>
       <div
           style={{
               display: 'flex',
               alignItems: 'center',
               backgroundColor: '#282828',
               padding: '5px, 10px',
               color: 'white'
           }}
           key={attribut.nom}
       >
           <input
               type="text"
               value={attribut.etat}
               onChange={(e) => {
                   const updatedAttributes = [...data.attributes];
                   updatedAttributes[index].etat = e.target.value;
                   data.onChange({attributes: updatedAttributes});
               }}
           />
           <input
               type="text"
               value={attribut.nom}
               onChange={(e) => {
                   const updatedAttributes = [...data.attributes];
                   updatedAttributes[index].nom = e.target.value;
                   data.onChange({attributes: updatedAttributes});
               }}
           />
           <input
               type="text"
               value={attribut.type}
               onChange={(e) => {
                   const updatedAttributes = [...data.attributes];
                   updatedAttributes[index].type = e.target.value;
                   data.onChange({attributes: updatedAttributes});
               }}
           />
       </div>
   );

    const meth = data.methods.map((method,index) =>
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#282828',
                padding: '5px, 10px',
                color: 'white'
            }}
            key={method.nom}
        >
            <input
                type="text"
                value={method.etat}
                onChange={(e) => {
                    const updatedMethods = [...data.methods];
                    updatedMethods[index].etat = e.target.value;
                    data.onChange({methods: updatedMethods});
                }}
            />
            <input
                type="text"
                value={method.nom}
                onChange={(e) => {
                    const updatedMethods = [...data.methods];
                    updatedMethods[index].nom = e.target.value;
                    data.onChange({methods: updatedMethods});
                }}
            />
        </div>
    );
    return (
        <div className="class-wrapper">
            <div className='class-name-wrapper'>
                <input
                    value={data.className}
                    onChange={(e) => data.onChange({ className: e.target.value })}
                    className="nodrag"
                />
            </div>
            {fields}
            <div style={{
                height: '1px',
                backgroundColor: 'white',
                margin: '10px 0',
            }}></div>
            {meth}
            <Handle type="target" position={Position.Top}/>
            <Handle type="source" position={Position.Bottom}/>
        </div>
    );
}

export default UmlClassNode;