import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { auth } from "../../firebase/firebase";
import "./navComponent.css";

const NavComponent = () => {
    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav 
                    className="pl-20 me-auto"
                >
                        <Nav.Link className="navLink" style={{color: "#332FD0"}} href="/home"> Home </Nav.Link>
                        <Nav.Link className="navLink" style={{color: "#332FD0"}} href="/chat"> Messages </Nav.Link>
                        <Nav.Link className="navLink" style={{color: "#332FD0"}} href="/myprofile"> Profile </Nav.Link>
                        <Nav.Link className="navLink" style={{color: "#332FD0"}} href="/explore"> Explore Network </Nav.Link>
                </Nav>
                {auth.currentUser ? <Button 
                    onClick={(e)=>{
                            e.preventDefault();
                            auth.signOut();
                        }}
                > 
                    Signout 
                </Button> : null}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavComponent;