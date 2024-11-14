import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import logoUml from './logoUml.svg';
import React, { useState } from 'react';



function App() {
  const [showModal, setShowModal] = useState(false);
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);
  return (
    <div className="container-fluid bg-dark text-light min-vh-100">
      <nav className="navbar fixed-top navbar-expand-lg">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <img src={logoUml} alt="Logo" width="40" height="30" className="d-inline-block align-text-top" />
            UmlDiagram
          </a>
          <button className="btn btn-outline-primary" type="submit" onClick={openModal}>New diagram</button>
        </div>
      </nav>

      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <h1>Welcom to uml diagram app</h1>
      </div>
      {showModal && (
        <div className="modal show" style={{ display: 'block' }} tabindex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h3 className="modal-title"><strong>New database diagram</strong></h3>
                <button type="button" className="btn-close" onClick={closeModal} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label for="exampleInputPassword1" className="form-label"><h5>Diagram name</h5></label>
                    <input type="text" className="form-control" id="exampleInputPassword1"></input>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Close
                </button>
                <button type="button" className="btn btn-primary">Create diagramm</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function modal() {
  return (
    <div class="modal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Modal title</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>Modal body text goes here.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary">Save changes</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App;