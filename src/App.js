import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import Navbar from './components/navbar';



function App() {
  const [showModal, setShowModal] = useState(false);
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);
  return (
    <div className="container-fluid bg-dark text-light min-vh-100">
      <Navbar />
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <h1>Welcom to uml diagram app</h1>
      </div>
    </div>
  );
}
export default App;