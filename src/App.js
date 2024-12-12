import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar';
import React, { useState } from 'react';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Diagram from "./components/gestionDiagram/Diagram";
import SVGDefs from './components/gestionDiagram/SVGDefs';
function App() {
  const [showDiagram, setShowDiagram] = useState(false);
  return (
    <div className="main">
      <Navbar
        showGenerateButton={showDiagram}
        openModal={() => setShowDiagram(false)} // Optionnel si Navbar gère autre chose
        onCreateDiagram={() => setShowDiagram(true)} // Affiche le diagramme
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
  );
}
export default App;