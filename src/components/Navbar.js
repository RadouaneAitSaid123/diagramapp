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
import { saveAs } from 'file-saver';
import { generatePHPCode } from '../utils/phpGenerator';
import { generateJavaFiles } from '../components/generationCode/javaGenerator';
import { generatePythonCode } from '../utils/pythonGenerator';





export default function Navbar({ showGenerateButton, onCreateDiagram, onGenerateJSON, diagramData}) {

    const [modalType, setModalType] = useState(null); // Type de modal à afficher
    const [codeContent, setCodeContent] = useState(""); // Contenu du code généré
    const [showModal, setShowModal] = useState(false);
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

     // Ajout de la fonction de gestion pour Python
     const handleGeneratePython = () => {
        const jsonData = onGenerateJSON();  // Assurez-vous que cette fonction retourne des données
        
        // Vérification des données
        if (!jsonData) {
            console.error('No data to generate Python code');
            return;
        }
    
        console.log('JSON Data:', jsonData);  // Pour déboguer
    
        try {
            // Générer le code Python
            const pythonCode = generatePythonCode(jsonData);
            
            // Créer et sauvegarder le fichier
            if (pythonCode) {
                const pythonBlob = new Blob([pythonCode], 
                    { type: 'text/plain;charset=utf-8' });
                saveAs(pythonBlob, 'generated_classes.py');
            }
        } catch (error) {
            console.error('Error generating Python code:', error);
        }
    };
    

    const handleNewDiagram = () => {  
        setModalType('createDiagram');
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
                            <ul class="dropdown-menu">
                                <li>
                                    <a
                                        className="dropdown-item"
                                        href="#"
                                        onClick={() => generateJavaFiles(diagramData.nodes, diagramData.edges)}
                                    >
                                        <FontAwesomeIcon icon={faJava}/> Java
                                    </a>
                                </li>
                                <li><a class="dropdown-item" onClick={handleGeneratePhp} href="#"><FontAwesomeIcon
                                    icon={faPhp}/> Php</a></li>
                                <li>
                                    <a
                                        className="dropdown-item"
                                        href="#"
                                        onClick={handleGeneratePython}
                                    >
                                        <FontAwesomeIcon icon={faPython}/> Python
                                    </a>
                                </li>
                            </ul>
                        </div>
                    )}
                    <button className="new-diagram-btn" onClick={handleNewDiagram}>
                        <FontAwesomeIcon icon={faPlus} className="icon"/> <span>New Diagram</span>
                    </button>
                </div>
            </nav>

            {modalType === 'createDiagram' && (
                <Modal
                isOpen={true}
                closeModal={() => setModalType(null)}
                title="New Diagram"
                onCreateDiagram={() => {
                    onCreateDiagram();  // Appelle la fonction pour créer le diagramme
                    setModalType(null); // Ferme le modal
                }}
            />
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