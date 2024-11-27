import {useCallback} from "react";
import {Handle, Position} from "@xyflow/react";

function UmlClassNode({ data }){
    const handleClassNameChange = useCallback((event) => {
        const newName = event.target.value;
        data.onClassNameChange(newName);
    }, [data]);


    return (
        <div className="class-wrapper">
            <div className='class-name-wrapper'>
                <p>{data.className}</p>
            </div>


            <div style={{borderBottom: '1px solid black', paddingBottom: '5px'}}>
                <ul style={{padding: 0, margin: 0, listStyle: 'none'}}>
                    {data.attributes.map((attr, index) => (
                        <li key={index}>+ {attr}</li>
                    ))}
                </ul>
            </div>


            <div>
                <ul style={{padding: 0, margin: 0, listStyle: 'none'}}>
                    {data.methods.map((method, index) => (
                        <li key={index}>+ {method}()</li>
                    ))}
                </ul>
            </div>


            <Handle type="target" position={Position.Top}/>
            <Handle type="source" position={Position.Bottom}/>
        </div>
    );
}

export default UmlClassNode;