import {Handle, Position} from "@xyflow/react";


function UmlClassNode({ data }){

   const fields=data.attributes.map(attribut =>
    <div style={{display:'flex',
        alignItems:'center',
        backgroundColor:'#232323',
        padding:'5px, 10px',
        color:'white'}}>
        <p>{attribut.etat}</p>
        <p>{attribut.nom}</p>
        <p style={{marginLeft:'10px'}}>{attribut.type}</p>
    </div>
   );

       const meth=data.methods.map(method =>
           <div style={{
               display: 'flex',
               alignItems: 'center',
               backgroundColor: '#282828',
               padding: '5px, 10px',
               color: 'white'
           }}>
               <p style={{marginLeft: '10px'}}>{method.etat}</p>
               <p style={{marginLeft:'10px'}}>{method.nom}</p>
           </div>

);
    return (
        <div className="class-wrapper">
            <div className='class-name-wrapper'>
                <p>{data.className}</p>
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