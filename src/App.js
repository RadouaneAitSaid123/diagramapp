import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar';
import Diagram from './components/Diagram';
import { useState } from 'react';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import React from 'react';




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
      {showDiagram && <Diagram />}
    </div>
  );
}
export default App;