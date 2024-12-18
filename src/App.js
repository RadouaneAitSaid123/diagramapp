import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar.js';
import React, { useState, createContext, useContext, useRef } from 'react';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Diagram from "./components/gestionDiagram/Diagram";
import SVGDefs from './components/gestionDiagram/SVGDefs';

// Créer un contexte pour partager les données du diagramme
export const DiagramContext = createContext();

function App() {
  const [showDiagram, setShowDiagram] = useState(false);
  const diagramRef = useRef(null);
  const [diagramData, setDiagramData] = useState({ nodes: [], edges: [] });

  const updateDiagramData = (nodes, edges) => {
    setDiagramData({ nodes, edges });
  };

  return (
      <DiagramContext.Provider value={{ diagramData, updateDiagramData }}>
        <div className="main">
          <Navbar
            showGenerateButton={showDiagram}
            openModal={() => setShowDiagram(false)} // Optionnel si Navbar gère autre chose
            onCreateDiagram={() => setShowDiagram(true)}
            onGenerateJSON={() => diagramRef.current?.generateJSON()}
            diagramData={diagramData}
      />


      {!showDiagram && (
          <div className="welcome">
              <div className="welcome-text">
                  <h1 className="animated-title">Welcome to UML Diagram App</h1>
                  {/* Ajout du lien "Learn React" ici */}
                  <p className="app-description">
                      Create class diagrams effortlessly and generate code
                      in <strong>PHP</strong>, <strong>Java</strong>, and <strong>Python</strong>.
                  </p>
              </div>
          </div>
      )}
      {showDiagram &&
          <div className="dndflow">
              <SVGDefs/>
              <Diagram ref={diagramRef}/>
          </div>
      }
    </div>
      </DiagramContext.Provider>
  );
}

export default App;