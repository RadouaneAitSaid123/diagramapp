import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar';
import Diagram from './components/Diagram';
import { useState } from 'react';



function App() {
  const [showDiagram, setShowDiagram] = useState(false);
  return (
    <div className="container-fluid bg-dark text-light min-vh-100">
      {/* Navbar reste toujours visible */}
      <Navbar
        showGenerateButton={showDiagram}
        openModal={() => setShowDiagram(false)} // Optionnel si Navbar gère autre chose
        onCreateDiagram={() => setShowDiagram(true)} // Affiche le diagramme
      />

      {/* Affichage conditionnel */}
      {!showDiagram && (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
          <h1>Welcome to UML Diagram App</h1>
        </div>
      )}
      {showDiagram && <Diagram />}
    </div>
  );
}
export default App;