import {createContext, useContext, useState} from "react";

const DnDContext = createContext([null, (_) => {}]);

function DnDProvider({ children }){
    const [type, setType] = useState(null);
    return(
        <DnDContext.Provider value={[type, setType]}>
            {children}
        </DnDContext.Provider>
    );
}
export default DnDProvider;
export const useDnD=()=>useContext(DnDContext)