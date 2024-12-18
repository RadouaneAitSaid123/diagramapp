import '../styles/modal.css';
export default function Modal({ isOpen, closeModal, onCreateDiagram }) {
    if (!isOpen) return null;

    const handleCreate = () => {
        onCreateDiagram();  // Appelle la fonction pour créer le diagramme
        closeModal();       // Ferme le modal
    };
    
    return (
<<<<<<< HEAD
        <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title" ><strong>New Database Diagram</strong></h3>
                    <button
                        type="button"
                        className="btn-close"
                        onClick={closeModal}
                        aria-label="Close"
                    ></button>
                </div>
                <div className="modal-body">
                    <form>
                        <div className="mb-3">
                            <label htmlFor="diagramName" className="form-label"><h5>Diagram Name</h5></label>
                            <input
                                type="text"
                                className="form-control"
                                id="diagramName"
                                placeholder="Enter diagram name"
                            />
                        </div>
                    </form>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={closeModal}>
                        Close
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                            closeModal();
                            onCreateDiagram();
                        }}
                    >
                        Create Diagram
                    </button>
=======
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
                                <input type="text" className="form-control" id="diagramNameInput"></input>
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={closeModal}>
                            Close
                        </button>
                        <button type="button" className="btn btn-primary" onClick={
                               () => {
                                  closeModal();
                                onCreateDiagram()
                              }}
                        >Create diagramm</button>
                    </div>
>>>>>>> sauvegarde-diagram
                </div>
            </div>
        </div>
    );
}
