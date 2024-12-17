// src/App.js
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar';
import React, { useState, createContext, useContext } from 'react';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Diagram from "./components/gestionDiagram/Diagram";
import SVGDefs from './components/gestionDiagram/SVGDefs';

// Créer un contexte pour partager les données du diagramme
export const DiagramContext = createContext();

function App() {
  const [showDiagram, setShowDiagram] = useState(false);
  const [diagramData, setDiagramData] = useState({ nodes: [], edges: [] });

  const updateDiagramData = (nodes, edges) => {
    setDiagramData({ nodes, edges });
  };

  return (
    <DiagramContext.Provider value={{ diagramData, updateDiagramData }}>
      <div className="main">
        <Navbar
          showGenerateButton={showDiagram}
          openModal={() => setShowDiagram(false)}
          onCreateDiagram={() => setShowDiagram(true)}
          diagramData={diagramData}
        />

        {!showDiagram && (
          <div className="welcome">
            <h1>Welcome to UML Diagram App</h1>
          </div>
        )}
        {showDiagram &&
          <div className="dndflow">
            <SVGDefs />
            <Diagram />
          </div>
        }
      </div>
    </DiagramContext.Provider>
  );
}

export default App;