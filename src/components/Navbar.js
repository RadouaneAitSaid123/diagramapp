import Modal from "./Modal";
import '../styles/navbar.css';
import logoUml from '../logoUml.svg';
import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faJava } from '@fortawesome/free-brands-svg-icons';
import { faPhp } from '@fortawesome/free-brands-svg-icons';
import { faPython } from '@fortawesome/free-brands-svg-icons';
import { saveAs } from 'file-saver';
import { generatePHPCode } from '../utils/phpGenerator';


export default function Navbar({ showGenerateButton, onCreateDiagram, onGenerateJSON}) {

    const [showModal, setShowModal] = useState(false);
    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);
    const handleGeneratePhp = () => {
        const jsonData = onGenerateJSON();
        if (!jsonData || !jsonData.classes) {
            console.error('Invalid diagram data');
            return;
        }
        const phpCode = generatePHPCode(jsonData);

        // Créez deux blobs : un pour le JSON et un pour le PHP
        const jsonBlob = new Blob([JSON.stringify(jsonData, null, 2)], 
             { type: 'application/json' });
        const phpBlob = new Blob([phpCode], { type: 'text/plain;charset=utf-8' });

         // Sauvegardez les deux fichiers
        saveAs(jsonBlob, 'diagram.json');
        saveAs(phpBlob, 'generated_classes.php');
    };
      
    

    return (
        <>
            <nav className="navbar fixed-top navbar-expand-lg">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">
                        <img src={logoUml} alt="Logo" width="40" height="30" className="d-inline-block align-text-top" />
                        UmlDiagram
                    </a>
                    {showGenerateButton && (
                        <div class="btn-group">
                            <button class="btn btn-outline-success dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Generate code
                            </button>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="#"><FontAwesomeIcon icon={faJava} /> Java</a></li>
                                <li><a class="dropdown-item" onClick={handleGeneratePhp} href="#"><FontAwesomeIcon icon={faPhp} /> Php</a></li>
                                <li><a class="dropdown-item" href="#"><FontAwesomeIcon icon={faPython} /> Python</a></li>
                            </ul>
                        </div>
                    )}
                    <button className="new-diagram-btn" onClick={openModal}>
                        <FontAwesomeIcon icon={faPlus} className="icon"/> <span>New Diagram</span>
                    </button>
                </div>
            </nav>

            {/* La modal reste gérée ici */}
            <Modal
                isOpen={showModal}
                closeModal={closeModal}
                onCreateDiagram={() => {
                    closeModal();
                    onCreateDiagram(); // Envoie le nom du diagramme au parent
                }}
            />
        </>

    )
}
