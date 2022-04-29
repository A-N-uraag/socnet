import { useState } from "react";
import { Container, Row, Col, Nav } from "react-bootstrap";
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
        <Container className="mt-3 justify-content-center" fluid="true">
            <Row fluid="true">
                <Col xs={0} md={2}></Col>
                <Col fluid="true" xs={3} md={1}>
                    <Nav 
                        defaultActiveKey={switchParam}
                        className="flex-column" 
                        onSelect={(selectedKey) => setSwitchParam(`${selectedKey}`)}
                    >
                        <Nav.Link style={{color: "#332FD0"}} eventKey="home">Home</Nav.Link>
                        <Nav.Link style={{color: "#332FD0"}} eventKey="chats">Messages</Nav.Link>
                        <Nav.Link style={{color: "#332FD0"}} eventKey="profile">Profile</Nav.Link>
                        <Nav.Link style={{color: "#332FD0"}} eventKey="explore"> Explore Users </Nav.Link>
                    </Nav>
                    <button onClick={(e)=>{
                        e.preventDefault();
                        auth.signOut();
                    }}>
                        Signout
                    </button>
                </Col>
                <Col xs={0} md={1}></Col>
                <Col fluid="true" xs={8} md={5}>
                    {renderSwitch(switchParam)}
                </Col>
                <Col xs={0} md={3}></Col>
            </Row>
        </Container>
    );
};

export default Homepage;
