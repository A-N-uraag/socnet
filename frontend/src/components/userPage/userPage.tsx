import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faLink, faCakeCandles, faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { Card, Container, Row, Col, Button } from "react-bootstrap";
import Moment from "moment";
import "./userPage.css";
import { useState, useEffect } from "react";
import Post from "../Post/Posts";
import { auth } from "../../firebase/firebase";
import { ClimbingBoxLoader } from "react-spinners";
import { useParams } from "react-router-dom";
// import FeedComponent from "../feedComponent/FeedComponent";
// import ProfilePage from "../profilePage/profilePage";
import NavComponent from "../navComponent/navComponent";

const override = `
  display: block;
  margin: 25% auto;
  border-color: red;
`;

const UserProfilePage = () => {
    const { userId } = useParams();
    const [imgLoaded, setImgLoaded] = useState<boolean>(false);
    const [user, setUser] = useState<any>({});
    const [posts, setPosts] = useState<any>("null");
    const [following, setFollowing] = useState<boolean>(user.followers ? user.followers.includes(auth.currentUser?.email) : false);
    const handleEdge = () => {
        if(auth.currentUser !== null){
            if(!following) {
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ "userId":userId,"followerId":auth.currentUser?.email })
                };
                fetch('https://socnet-swe.herokuapp.com/followUser', requestOptions);
            }
            else{
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ "userId":userId,"followerId":auth.currentUser?.email })
                };
                fetch('https://socnet-swe.herokuapp.com/unfollowUser', requestOptions);
            }
            setFollowing(!following);
        }
    };

    useEffect(() => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        };
        fetch('https://socnet-swe.herokuapp.com/getUser?email=' + userId, requestOptions)
        .then(response => response.json())
        .then(data => {
            if(data.error) {
                window.location.href = "/usernotfound";
            }
            setUser(data);
            const postsRequestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ "idList":data.posts })
            };
            fetch('https://socnet-swe.herokuapp.com/getPosts?', postsRequestOptions)
            .then(response => response.json())
            .then(data => {
                setPosts(data);
            });
        });
    }, [userId]);
    if(Object.keys(user).length===0 || user.error)
        return <ClimbingBoxLoader color="#332FD0" size={40} css={override} loading={posts==="null"}/>
    else {
        return (
            <>
                <NavComponent />
                <Container fluid="true">
                    <Row fluid="true" className="gx-0">
                        <Col xs={0} md={3}></Col>
                        <Col fluid xs={12} md={6}>
                            <Card>
                                <Card.Img variant="top" style={imgLoaded ? {width:"30%",margin:"0px auto"} : {display: 'none'}} src={"https://avatars.dicebear.com/api/bottts/"+userId+".svg?colorful=1"}  onLoad={() => setImgLoaded(true)} />
                                <Card.Body>
                                    <Card.Title>{user.uname}</Card.Title>
                                    <Card.Subtitle> <p className="text-secondary"> {userId} </p> </Card.Subtitle>
                                    <Container fluid="true">
                                        <Row fluid="true" className="gx-0">
                                            <Col fluid="true" sm={3}>
                                                <FontAwesomeIcon size="xs" style={{display: "inline-block"}} icon={faLocationDot} /> <p style={{display: "inline-block"}}>{user.location ? user.location : "Zombieland"}</p>
                                            </Col>
                                            <Col fluid="true" sm={3}>
                                                <FontAwesomeIcon size="xs" style={{display: "inline-block"}} icon={faLink} /> <a href={user.website ? user.website : "https://google.co.in"} style={{display: "inline-block", color: "#332FD0"}}>Website</a>
                                            </Col>
                                            <Col fluid="true" sm={3}>
                                                <FontAwesomeIcon size="xs" style={{display: "inline-block"}} icon={faCakeCandles} /> <p style={{display: "inline-block"}}>{Moment(user.dob).format('LL')}</p>
                                            </Col>
                                            <Col fluid="true" sm={3}>
                                                <FontAwesomeIcon size="xs" style={{display: "inline-block"}} icon={faCalendarDays} /> <p style={{display: "inline-block"}}>{Moment(user.createdDate).format('LL')}</p>
                                            </Col>
                                        </Row>
                                    </Container>
                                    {(auth.currentUser === null) ? null : <Button variant={following ? "dark" : "outline-dark"} size="sm" onClick={handleEdge}>{following ? "Unfollow" : "Follow"}</Button>}
                                    
                                </Card.Body>
                                <Card.Footer className="py-0 my-0">
                                    <Container fluid="true" className="gy-0 py-0 my-0">
                                        <Row fluid="true" className="gx-0 gy-0 py-0 my-0">
                                            <Col fluid="true" className="py-0 my-0">
                                                <div className="centerAlign py-0 my-0">
                                                    <p style={{display: "inline-block"}} className="text-secondary">Followers: </p><p style={{display: "inline-block"}}>{user.followers ? user.followers.length : 0}</p>
                                                </div>
                                            </Col>
                                            <Col fluid="true" className="py-0 my-0">
                                                <div className="centerAlign py-0 my-0">
                                                    <p style={{display: "inline-block"}} className="text-secondary">Following: </p><p style={{display: "inline-block"}}>{user.followers ? user.following.length : 0}</p>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Container>
                                </Card.Footer>
                            </Card>
                        </Col>
                        <Col xs={0} md={3}></Col>
                    </Row>
                    <ClimbingBoxLoader color="#332FD0" size={20} css={override} loading={posts==="null"}/>
                    {typeof posts === 'object' && Object.keys(posts).reverse().map((pid: string) => {   
                        const post:any = posts[pid];
                        return (
                            <Row key={pid} fluid="true" className="gx-0">
                                <Col xs={0} md={3}></Col>
                                <Col fluid xs={12} md={6}>
                                    <Post content={post.content} uname={post.postedByName} likes={post.likes} comments={post.comments} reposts={post.reposts} pid={pid} fid={post.postedBy} uid={auth.currentUser?.uid}createdDate={post.createdDate} />
                                </Col>
                                <Col xs={0} md={3}></Col>
                            </Row>
                        );
                    }) }
                    {Object.keys(posts).length===0 && <div style={{marginTop:"10%"}} className="text-secondary centerAlign">No posts yet!<br/>Head to the HomePage and post something!</div>}
                </Container>
            </>
        );
    }
};

export default UserProfilePage;