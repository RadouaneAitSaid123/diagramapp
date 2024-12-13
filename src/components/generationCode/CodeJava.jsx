import React, { useState } from 'react';
import CodeModal from "../CodeModal";

const CodeJava = ({ diagramData }) => {
    const [generatedCode, setGeneratedCode] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fonction pour générer le code Java à partir des données du diagramme
    const generateJavaCode = () => {
        let javaCode = "";

        diagramData.nodes.forEach(node => {
            let classCode = `public class ${node.label} {\n`;

            // Ajouter les attributs
            node.attributes.forEach(attribute => {
                classCode += `    private ${attribute};\n`;
            });

            // Ajouter les méthodes
            node.methods.forEach(method => {
                classCode += `    public ${method} {\n        // TODO: implement\n    }\n`;
            });

            classCode += "}\n\n";

            javaCode += classCode;
        });

        // Gérer les héritages
        diagramData.edges.forEach(edge => {
            if (edge.type === 'inheritance') {
                const parent = diagramData.nodes.find(node => node.id === edge.source);
                const child = diagramData.nodes.find(node => node.id === edge.target);
                javaCode = javaCode.replace(`public class ${child.label}`, `public class ${child.label} extends ${parent.label}`);
            }
        });

        setGeneratedCode(javaCode);
        setIsModalOpen(true); // Ouvrir le modal après avoir généré le code
    };

    return (
        <div>
            <button onClick={generateJavaCode}>Generate Java Code</button>

            {/* Afficher le CodeModal si le code est généré */}
            {isModalOpen && (
                <CodeModal
                    isOpen={isModalOpen}
                    closeModal={() => setIsModalOpen(false)}
                    codeContent={generatedCode}
                />
            )}
        </div>
    );
};

export default CodeJava;
