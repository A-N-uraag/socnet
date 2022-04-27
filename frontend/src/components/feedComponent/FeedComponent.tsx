import { useState } from "react";
import { Card, Col, Container, Row, Image, Form, Button } from "react-bootstrap";
import Post from "../Post/Posts";

const FeedComponent = (props: any) => {
    const [postText, setPostText] = useState<string>("");

    const onPostCaptionWrite = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPostText(event.target.value);
    }
    return (
        <>
            <Container fluid>
                <Row fluid className="gx-0">
                    <Card className="mb-1">
                        <Card.Body>
                            <Container fluid>
                                <Row fluid>
                                    <Col fluid xs={4} md={2}>
                                        <Image
                                                src={props.userData[props.uid].profile.photoURL}
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
                {props.userData[props.uid].followees.map((fid: number) => {
                    return (
                        props.userData[fid].posts.map((pid: number) => {
                            return (
                                <Row fluid className="gx-0">
                                    <Post postData={props.postData} uname={props.userData[props.uid].profile.uname} pid={pid}></Post>
                                </Row>
                            );
                        })
                    );
                })}
            </Container>
        </>
    );
};

export default FeedComponent;