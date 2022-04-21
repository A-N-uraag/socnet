import { useState } from "react";
import { Card, Container, Row, Col, Form, Nav, Image, Button } from "react-bootstrap";
import Post from "../Post/Posts";
import "./HomepageComponent.css"

let userData = require("../../assets/data/users.json");
let postData = require("../../assets/data/posts.json");


const Homepage = (props: any) => {
    const [postText, setPostText] = useState<string>("");

    const onPostCaptionWrite = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPostText(event.target.value);
    }
    // console.log(userData[props.uid].profile.photoURL);
    return(
        <>
            <Container className="mt-3 justify-content-center" fluid>
                <Row fluid>
                    <Col xs={0} md={2}></Col>
                    <Col fluid xs={3} md={1}>
                        <Nav defaultActiveKey="/home" className="flex-column">
                            <Nav.Link style={{color: "#332FD0"}} href="/home" eventKey="home">Home</Nav.Link>
                            <Nav.Link style={{color: "#332FD0"}} href="/chat" eventKey="chats">Messages</Nav.Link>
                            <Nav.Link style={{color: "#332FD0"}} href="/profile" eventKey="profile">Profile</Nav.Link>
                            <Nav.Link style={{color: "#332FD0"}} href="/explore" eventKey="explore"> Explore </Nav.Link>
                        </Nav>
                    </Col>
                    <Col xs={0} md={1}></Col>
                    <Col fluid xs={8} md={5}>
                        <Container fluid>
                            <Row fluid className="gx-0">
                                <Card className="mb-1">
                                    <Card.Body>
                                        <Container fluid>
                                            <Row fluid>
                                                <Col fluid xs={4} md={2}>
                                                    {/* userData[props.uid].profile.photoURL */}
                                                    <Image
                                                            src={require("../../assets/img/photo.jpg")}
                                                            roundedCircle
                                                            fluid
                                                    />
                                                </Col>
                                                <Col fluid>
                                                    <Form>
                                                        <Form.Group controlId="postWriting">
                                                            <Form.Control className="border-0" value={postText} onChange={onPostCaptionWrite} as="textarea" rows={3} placeholder="What's happening?"/>
                                                        </Form.Group>
                                                        <Row className="mt-2">
                                                            <Form.Group as={Col} controlId="imageUpload">
                                                                <Form.Control className="justify-content-end" type="file" />
                                                            </Form.Group>
                                                            <Col>
                                                                <Button variant="primary" type="submit"> Post </Button>
                                                            </Col>
                                                        </Row>
                                                    </Form>
                                                </Col>
                                            </Row>
                                        </Container>
                                    </Card.Body>
                                </Card>
                            </Row>
                            {userData[props.uid].followees.map((fid: number) => {
                                return (
                                    userData[fid].posts.map((pid: number) => {
                                        return (
                                            <Row fluid className="gx-0">
                                                <Post postData={postData} userData={userData} uid={fid} pid={pid}></Post>
                                            </Row>
                                        );
                                    })
                                );
                            })}
                        </Container>
                    </Col>
                    <Col xs={0} md={3}></Col>
                </Row>
            </Container>
        </>
    );
};

export default Homepage;