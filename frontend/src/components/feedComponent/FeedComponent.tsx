import { useEffect, useState } from "react";
import { Card, Col, Container, Row, Image, Form, Button } from "react-bootstrap";
import Post from "../Post/Posts";
import { auth } from "../../firebase/firebase";
import { ClimbingBoxLoader, PacmanLoader } from "react-spinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faSpinner } from "@fortawesome/free-solid-svg-icons";

const override = `
  display: block;
  margin: 25% auto;
  border-color: red;
`;

const FeedComponent = () => {
    const nullObj = {value: "null"};
    const nullBlob = new Blob([JSON.stringify(nullObj, null, 2)], {type : 'application/json'});

    const [postText, setPostText] = useState<string>("");
    const [posts, setPosts] = useState<any>("null");
    const [postMedia, setPostMedia] = useState<any>(nullBlob);
    const [posting, setPosting] = useState<boolean>(false);
    
    useEffect(() => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "userId":auth.currentUser?.email})
        };
        console.log(requestOptions.body);
        fetch('https://socnet-swe.herokuapp.com/generateFeed', requestOptions)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            setPosts(data);
        });
    }, []);

    const onPostCaptionWrite = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPostText(e.target.value);
    }
    const onFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPostMedia(e.target.files ? e.target.files[0] : nullBlob);
    }

    const submitPost = () => {
        setPosting(true);

        var formdata = new FormData();
        formdata.append("file", postMedia, postMedia.name);

        var requestOptions:any = {
            method: 'POST',
            body: formdata
        };

        fetch("https://socnet-swe.herokuapp.com/upload", requestOptions)
        .then(response => response.json())
        .then(uploadResp => {
            requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: auth.currentUser?.email,
                    content: postText,
                    media: uploadResp.url
                })
            };
            console.log(requestOptions.body);
            return fetch('https://socnet-swe.herokuapp.com/createPost', requestOptions)
        })
        .then(response => Promise.all([response.status,response.json()]))
        .then(([status,response]) => {
            if(status === 200){
                window.location.reload();
            }
            console.log(response);
        })
        .catch(error => console.log('error', error));
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
                                                src={"https://avatars.dicebear.com/api/bottts/"+auth.currentUser?.email+".svg?colorful=1"}
                                                fluid={true}
                                        />
                                    </Col>
                                    <Col fluid="true">
                                        <Form onSubmit={(e)=>{
                                            e.preventDefault();
                                            submitPost();
                                        }}>
                                            <Form.Group controlId="postWriting">
                                                <Form.Control required className="border-0" value={postText} onChange={onPostCaptionWrite} as="textarea" rows={3} placeholder="What's happening?"/>
                                            </Form.Group>
                                            <Row className="mt-2">
                                                <Form.Group as={Col} controlId="imageUpload">
                                                    <Form.Control className="justify-content-end" onChange={onFileUpload} size="sm" type="file" />
                                                </Form.Group>
                                                <Col>
                                                    <Button color="#332fd0" variant="primary" type="submit" size="sm">
                                                        {posting
                                                        ? <FontAwesomeIcon icon={faSpinner} color="white" />
                                                        : <FontAwesomeIcon icon={faPaperPlane} color="white" />
                                                        }
                                                        {posting
                                                        ? " Posting..."
                                                        : " Post"
                                                        }
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </Form>
                                    </Col>
                                </Row>
                            </Container>
                        </Card.Body>
                    </Card>
                </Row>
                <ClimbingBoxLoader color="#332FD0" size={20} css={override} loading={posts==="null"}/>
                {typeof posts === 'object' && Object.keys(posts).map((pid: string) => {   
                    const post:any = posts[pid];
                    return (
                        <Row key={pid} fluid="true" className="gx-0">
                            <Post content={post.content} uname={post.postedByName} media={post.media} likes={post.likes} comments={post.comments} reposts={post.reposts} pid={pid} fid={post.postedBy} uid={auth.currentUser?.uid}createdDate={post.createdDate} />
                        </Row>
                    );
                })}
                {Object.keys(posts).length===0 && <div style={{marginTop:"10%"}} className="text-secondary centerAlign">No posts yet!<br/>Head to the HomePage and post something!</div>}
            </Container>
        </>
    );
};

export default FeedComponent;