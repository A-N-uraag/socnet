import { useEffect, useState } from "react";
import { Card, Col, Container, Row, Image, Form, Button } from "react-bootstrap";
import Post from "../Post/Posts";
import { auth } from "../../firebase/firebase";
import { ClimbingBoxLoader } from "react-spinners";

const override = `
  display: block;
  margin: 25% auto;
  border-color: red;
`;

const FeedComponent = () => {
    const [postText, setPostText] = useState<string>("");
    const [posts, setPosts] = useState<any>({});
    
    useEffect(() => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "userId":"mara@gmail.com"})
        };
        console.log(requestOptions.body);
        fetch('https://socnet-swe.herokuapp.com/generateFeed', requestOptions)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            setPosts(data);
        });
    }, []);

    const onPostCaptionWrite = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPostText(event.target.value);
    }
    return (
        <>
            <Container fluid="true">
                <Row fluid="true" className="gx-0">
                    <Card className="mb-1">
                        <Card.Body>
                            <Container fluid="true">
                                <Row fluid="true">
                                    <Col fluid="true" xs={4} md={2}>
                                        <Image
                                                src={"img/ramam.jpeg"}
                                                roundedCircle
                                                fluid={true}
                                        />
                                    </Col>
                                    <Col fluid="true">
                                        <Form onSubmit={(e)=>{
                                            e.preventDefault();
                                            const requestOptions = {
                                                method: 'POST',
                                                headers: {
                                                    'Content-Type': 'application/json'
                                                },
                                                body: JSON.stringify({
                                                    email: auth.currentUser?.email,
                                                    content: postText
                                                })
                                            };
                                            fetch('https://socnet-swe.herokuapp.com/createPost', requestOptions)
                                            .then(response => response.json())
                                            .then(response => {
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
                <ClimbingBoxLoader color="#332FD0" size={20} css={override} loading={Object.keys(posts).length===0}/>
                {Object.keys(posts).map((pid: string) => {   
                    const post:any = posts[pid];
                    return (
                        <Row key={pid} fluid="true" className="gx-0">
                            <Post content={post.content} uname={post.postedByName} likes={post.likes} comments={post.comments} reposts={post.reposts} pid={pid} fid={post.postedBy} uid={auth.currentUser?.uid}createdDate={post.createdDate} />
                        </Row>
                    );
                })}
            </Container>
        </>
    );
};

export default FeedComponent;