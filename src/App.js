import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar.js';
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
        onCreateDiagram={() => setShowDiagram(true)}
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
              <h2 className="uml-title">UML Diagram</h2>
              <SVGDefs/>
              <Diagram/>

          </div>

      }


    </div>
  );
}

export default App;