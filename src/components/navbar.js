import Modal from "./Modal";
import '../styles/navbar.css';
import logoUml from '../logoUml.svg';
import React, { useState } from 'react';



export default function Navbar({ showGenerateButton, onCreateDiagram }) {
    const [showModal, setShowModal] = useState(false);
    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);
    return (
        <>
            <nav className="navbar fixed-top navbar-expand-lg">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">
                        <img src={logoUml} alt="Logo" width="40" height="30" className="d-inline-block align-text-top" />
                        UmlDiagram
                    </a>
                    <button className="btn btn-outline-primary" onClick={openModal}>
                        New diagram
                    </button>
                    {showGenerateButton && (
                        <button className="btn btn-success">
                            Generate Code
                        </button>
                    )}
                </div>
            </nav>

            {/* La modal reste gérée ici */}
            <Modal
                isOpen={showModal}
                closeModal={closeModal}
                onCreateDiagram={() => {
                    closeModal();
                    onCreateDiagram(); // Notifie le parent
                }}
            />
        </>

    )
}