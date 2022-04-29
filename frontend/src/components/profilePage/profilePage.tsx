import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faLink, faCakeCandles, faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { Card, Container, Row, Col, Button } from "react-bootstrap";
import Moment from "moment";
import "./profilePage.css";
import { useState, useEffect } from "react";
import Post from "../Post/Posts";
import { auth } from "../../firebase/firebase";
import { ClimbingBoxLoader } from "react-spinners";

const override = `
  display: block;
  margin: 25% auto;
  border-color: red;
`;

const ProfilePage = () => {
    const [imgLoaded, setImgLoaded] = useState<boolean>(false);
    const [user, setUser] = useState<any>({})
    const [posts, setPosts] = useState<any>([])

    useEffect(() => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        };
        fetch('https://socnet-swe.herokuapp.com/getUser?email=' + auth.currentUser?.email, requestOptions)
        .then(response => response.json())
        .then(data => {
            setUser(data);
            const postsRequestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ "idList":data.posts })
            };
            fetch('https://socnet-swe.herokuapp.com/getPosts?', postsRequestOptions)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setPosts(data);
            });
        });
    }, []);

    return (
        <>
            <Container fluid>
                <Row fluid className="gx-0">
                    <Card>
                        <Card.Img variant="top" style={imgLoaded ? {} : {display: 'none'}} src={"https://avatars.dicebear.com/api/bottts/"+auth.currentUser?.email+".svg?colorful=1"}  onLoad={() => setImgLoaded(true)} />
                        <Card.Body>
                            <Card.Title>{user.uname}</Card.Title>
                            <Card.Subtitle> <p className="text-secondary"> {auth.currentUser?.email} </p> </Card.Subtitle>
                            <Container fluid>
                                <Row fluid className="gx-0">
                                    <Col fluid sm={3}>
                                        <FontAwesomeIcon size="xs" style={{display: "inline-block"}} icon={faLocationDot} /> <p style={{display: "inline-block"}}>{user.location ? user.location : "Zombieland"}</p>
                                    </Col>
                                    <Col fluid sm={3}>
                                        <FontAwesomeIcon size="xs" style={{display: "inline-block"}} icon={faLink} /> <a href={user.website ? user.website : "https://google.co.in"} style={{display: "inline-block", color: "#332FD0"}}>Homepage</a>
                                    </Col>
                                    <Col fluid sm={3}>
                                        <FontAwesomeIcon size="xs" style={{display: "inline-block"}} icon={faCakeCandles} /> <p style={{display: "inline-block"}}>{Moment(user.dob).format('LL')}</p>
                                    </Col>
                                    <Col fluid sm={3}>
                                        <FontAwesomeIcon size="xs" style={{display: "inline-block"}} icon={faCalendarDays} /> <p style={{display: "inline-block"}}>{Moment(user.createdDate).format('LL')}</p>
                                    </Col>
                                </Row>
                            </Container>
                            <Button variant="outline-dark" size="sm">Edit Profile</Button>
                        </Card.Body>
                        <Card.Footer className="py-0 my-0">
                            <Container fluid className="gy-0 py-0 my-0">
                                <Row fluid className="gx-0 gy-0 py-0 my-0">
                                    <Col fluid className="py-0 my-0">
                                        <div className="centerAlign py-0 my-0">
                                            <b style={{display: "inline-block"}}>{user.followers ? user.followers.length : 0}</b> <p style={{display: "inline-block"}} className="text-secondary">Followers</p>
                                        </div>
                                    </Col>
                                    <Col fluid className="py-0 my-0">
                                        <div className="centerAlign py-0 my-0">
                                            <b style={{display: "inline-block"}}>{user.followers ? user.following.length : 0}</b> <p style={{display: "inline-block"}} className="text-secondary">Following</p>
                                        </div>
                                    </Col>
                                </Row>
                            </Container>
                        </Card.Footer>
                    </Card>
                </Row>
                <ClimbingBoxLoader color="#332FD0" size={20} css={override} loading={Object.keys(posts).length===0}/>
                {Object.keys(posts).map((pid: string) => {   
                    const post:any = posts[pid];
                    return (
                        <Row fluid className="gx-0">
                            <Post content={post.content} uname={post.postedByName} likes={post.likes} comments={post.comments} reposts={post.reposts} pid={pid} fid={post.postedBy} uid={auth.currentUser?.uid}createdDate={post.createdDate} />
                        </Row>
                    );
                })}
            </Container>
        </>
    );
};

export default ProfilePage;