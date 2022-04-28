import { useEffect, useState } from "react";
import { Card, Col, Container, Row, Image, Form, Button } from "react-bootstrap";
import Post from "../Post/Posts";
import { auth } from "../../firebase/firebase";

const FeedComponent = (props: any) => {
    const [postText, setPostText] = useState<string>("");
    var posts = {};
    useEffect(() => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: auth.currentUser?.email})
        };
        console.log(requestOptions.body);
        fetch('https://socnet-swe.herokuapp.com/generateFeed', requestOptions)
        .then((response) => {
            console.log("hello");
            console.log({response});
            posts = response;
        });
    }, []);
    console.log(props.uid);
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
                                        <Form onSubmit={(e)=>{
                                            e.preventDefault();
                                            const requestOptions = {
                                                method: 'POST',
                                                headers: {
                                                    'Content-Type': 'application/json'
                                                },
                                                body: JSON.stringify({
                                                    user: auth.currentUser?.email,
                                                    content: postText
                                                })
                                            };
                                            console.log(requestOptions.body);
                                            fetch('https://socnet-swe.herokuapp.com/createPost', requestOptions)
                                                .then(response => {
                                                    console.log(response);
                                                    if (response.status === 200) {
                                                        window.location.reload();
                                                    }
                                                });
                                        }}>
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
                
            </Container>
        </>
    );
};

export default FeedComponent;