import { Container } from "react-bootstrap";
import Navbar from "react-bootstrap/Navbar";

import logo from "../just_token.svg";

function App() {
    return (
        <Container>
            <Navbar>
                <img alt="logo" src={logo} width="40" height="40" className="d-inline-block align-top mx-3"/>
                <Navbar.Brand href="#">JUST TOKEN Crowdsale</Navbar.Brand>
            </Navbar>
        </Container>
    );
}

export default App;