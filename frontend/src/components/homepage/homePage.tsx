import { useState } from "react";
import { Container, Row, Col, Nav } from "react-bootstrap";
import FeedComponent from "../feedComponent/FeedComponent";
import ProfilePage from "../profilePage/profilePage";

let userData = require("../../assets/data/users.json");
let postData = require("../../assets/data/posts.json");


const Homepage = (props: any) => {
    const [switchParam, setSwitchParam] = useState<string>("home");
    
    const renderSwitch = (param: string) => {
        switch(param) {
            case "home":
                return <FeedComponent userData={userData} postData={postData} uid={props.uid}/>;
            case "profile":
                return <ProfilePage user={userData[props.uid]} postData={postData}/>
            default:
                return <FeedComponent userData={userData} postData={postData} uid={props.uid}/>;
        };
    };
    return(
        <>
            <Container className="mt-3 justify-content-center" fluid>
                <Row fluid>
                    <Col xs={0} md={2}></Col>
                    <Col fluid xs={3} md={1}>
                        <Nav 
                            defaultActiveKey={switchParam}
                            className="flex-column" 
                            onSelect={(selectedKey) => setSwitchParam(`${selectedKey}`)}
                        >
                            <Nav.Link style={{color: "#332FD0"}} eventKey="home">Home</Nav.Link>
                            <Nav.Link style={{color: "#332FD0"}} eventKey="chats">Messages</Nav.Link>
                            <Nav.Link style={{color: "#332FD0"}} eventKey="profile">Profile</Nav.Link>
                            <Nav.Link style={{color: "#332FD0"}} eventKey="explore"> Explore </Nav.Link>
                        </Nav>
                    </Col>
                    <Col xs={0} md={1}></Col>
                    <Col fluid xs={8} md={5}>
                        {renderSwitch(switchParam)}
                    </Col>
                    <Col xs={0} md={3}></Col>
                </Row>
            </Container>
        </>
    );
};

export default Homepage;
