import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar';
import Diagram from './components/gestionDiagram/Diagram';
import React,{useState } from 'react';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Sidebar from "./components/gestionDiagram/Sidebar";
import {ReactFlowProvider} from "@xyflow/react";





function App() {
  const [showDiagram, setShowDiagram] = useState(false);
  return (
    <div className="container-fluid">
      {/* Navbar reste toujours visible */}
      <Navbar
        showGenerateButton={showDiagram}
        openModal={() => setShowDiagram(false)} // Optionnel si Navbar gère autre chose
        onCreateDiagram={() => setShowDiagram(true)} // Affiche le diagramme
      />

      {/* Affichage conditionnel */}
      {!showDiagram && (
        <div className="welcome">
          <h1>Welcome to UML Diagram App</h1>
        </div>
      )}
      {showDiagram &&
          <div>
              <ReactFlowProvider>
                  <Diagram />
                  <Sidebar/>
              </ReactFlowProvider>
          </div>

      }
    </div>
  );
}
export default App;