import { useState } from "react";
import { Container, Row, Col, Nav, Navbar, Button } from "react-bootstrap";
import { auth } from "../../firebase/firebase";
import FeedComponent from "../feedComponent/FeedComponent";
import ProfilePage from "../profilePage/profilePage";

const Homepage = () => {
    const [switchParam, setSwitchParam] = useState<string>("home");
    
    const renderSwitch = (param: string) => {
        switch(param) {
            case "home":
                return <FeedComponent />;
            case "profile":
                return <ProfilePage/>;
            default:
                return <FeedComponent />;
        };
    };
    return(
        <>
            <Navbar bg="light" expand="lg">
                <Container>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                    <Nav 
                        className="me-auto"
                        defaultActiveKey={switchParam}
                        onSelect={(selectedKey) => setSwitchParam(`${selectedKey}`)}
                    >
                            <Nav.Link style={{color: "#332FD0"}} eventKey="home">Home</Nav.Link>
                            <Nav.Link style={{color: "#332FD0"}} eventKey="chats">Messages</Nav.Link>
                            <Nav.Link style={{color: "#332FD0"}} eventKey="profile">Profile</Nav.Link>
                            <Nav.Link style={{color: "#332FD0"}} eventKey="explore"> Explore </Nav.Link>
                    </Nav>
                    <Button 
                        onClick={(e)=>{
                                e.preventDefault();
                                auth.signOut();
                            }}
                    > 
                        Signout 
                    </Button>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Container className="mt-3 justify-content-center" fluid="true">
                <Row fluid="true">
                    <Col xs={0} md={3}></Col>
                    <Col fluid="true" xs={12} md={6}>
                        {renderSwitch(switchParam)}
                    </Col>
                    <Col xs={0} md={3}></Col>
                </Row>
            </Container>
        </>
    );
};

export default Homepage;
