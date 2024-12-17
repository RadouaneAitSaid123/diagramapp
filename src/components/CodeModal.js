import '../styles/CodeModal.css';
import { useState } from 'react';

export default function CodeModal({ isOpen, closeModal, codeContent }) {
    const [copied, setCopied] = useState(false); // État pour suivre si le code a été copié

    // Fonction pour copier le code dans le presse-papiers
    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(codeContent); // Copier le contenu du code
            setCopied(true); // Marquer que le code a été copié
            setTimeout(() => setCopied(false), 2000); // Réinitialiser l'état après 2 secondes
        } catch (err) {
            console.error('Failed to copy!', err);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal show code-modal" style={{ display: 'block' }} tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h3 className="modal-title"><strong>Generated Code</strong></h3>
                        <button type="button" className="btn-close" onClick={closeModal} aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <pre>{codeContent}</pre>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={closeModal}>Close</button>
                        {/* Bouton Copier */}
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={copyToClipboard}
                        >
                            {copied ? 'Copied!' : 'Copy Code'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
