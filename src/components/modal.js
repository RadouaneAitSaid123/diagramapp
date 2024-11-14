import '../styles/modal.css';
export default function Modal() {
    return (
        <div className="modal show" style={{ display: 'block' }} tabindex="-1" role="dialog">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h3 className="modal-title"><strong>New database diagram</strong></h3>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
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
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                            Close
                        </button>
                        <button type="button" className="btn btn-primary">Create diagramm</button>
                    </div>
                </div>
            </div>
        </div>
    )
}