import Modal from "./Modal";
import CodeModal from "./CodeModal";
import '../styles/navbar.css';
import logoUml from '../logoUml.svg';
import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faJava } from '@fortawesome/free-brands-svg-icons';
import { faPhp } from '@fortawesome/free-brands-svg-icons';
import { faPython } from '@fortawesome/free-brands-svg-icons';
import { generateJavaFiles } from '../components/generationCode/javaGenerator';






export default function Navbar({ showGenerateButton, onCreateDiagram, diagramData }) {
    const [modalType, setModalType] = useState(null); // Type de modal à afficher
    const [codeContent, setCodeContent] = useState(""); // Contenu du code généré

    const openModal = (type, code = "") => {
        setModalType(type);
        setCodeContent(code); // Définir le code uniquement si nécessaire
    };

    const closeModal = () => setModalType(null);

    const codeExamples = {
        java: `public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
      }
     }`,
        php: `<?php
     echo "Hello, PHP!";
    ?>`,
        python: `print("Hello, Python!")`
    };


    return (
        <>
            <nav className="navbar fixed-top navbar-expand-lg">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">
                        <img src={logoUml} alt="Logo" width="40" height="30" className="d-inline-block align-text-top"/>
                        UmlDiagram
                    </a>
                    {showGenerateButton && (
                        <div className="btn-group">
                            <button className="btn btn-outline-success dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Generate code
                            </button>
                            <ul className="dropdown-menu">
                                <li>
                                    <a
                                        className="dropdown-item"
                                        href="#"
                                        onClick={() => generateJavaFiles(diagramData.nodes, diagramData.edges)}
                                    >
                                        <FontAwesomeIcon icon={faJava} /> Java
                                    </a>
                                </li>
                                <li>
                                    <a
                                        className="dropdown-item"
                                        href="#"
                                        onClick={() => openModal('affichageCode', codeExamples.php)}
                                    >
                                        <FontAwesomeIcon icon={faPhp} /> PHP
                                    </a>
                                </li>
                                <li>
                                    <a
                                        className="dropdown-item"
                                        href="#"
                                        onClick={() => openModal('affichageCode', codeExamples.python)}
                                    >
                                        <FontAwesomeIcon icon={faPython} /> Python
                                    </a>
                                </li>
                            </ul>
                        </div>
                    )}
                    <button className="btn btn-outline-primary" onClick={() => openModal('createDiagram')}>
                        New diagram <FontAwesomeIcon icon={faPlus}/>
                    </button>
                </div>
            </nav>

            {modalType === 'createDiagram' && (
                <Modal
                    isOpen={modalType === 'createDiagram'}
                    closeModal={closeModal}
                    title="New Diagram"
                    type="createDiagram"
                    onCreateDiagram={onCreateDiagram}
                    className="create-diagram-modal"
                >
                    <form>
                        <div className="mb-3">
                            <label htmlFor="diagramName" className="form-label"><h5>Diagram name</h5></label>
                            <input type="text" className="form-control" id="diagramName" />
                        </div>
                    </form>
                </Modal>
            )}

            {/* CodeModal */}
            {modalType === 'affichageCode' && (
                <CodeModal
                    isOpen={modalType === 'affichageCode'}
                    closeModal={closeModal}
                    codeContent={codeContent}
                    className="code-modal"
                />
            )}
        </>

    )
}
