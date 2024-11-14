import Modal from "./modal";
import '../styles/navbar.css';
import logoUml from '../logoUml.svg';


export default function Navbar() {
    return (

        <nav className="navbar fixed-top navbar-expand-lg">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">
                    <img src={logoUml} alt="Logo" width="40" height="30" className="d-inline-block align-text-top" />
                    UmlDiagram
                </a>
                <button className="btn btn-outline-primary" type="submit" onClick={Modal}>New diagram</button>
            </div>
        </nav>

    )
}