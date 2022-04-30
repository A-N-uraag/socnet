import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faLink, faCakeCandles, faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { Card, Container, Row, Col, Button, Modal } from "react-bootstrap";
import Moment from "moment";
import "./profilePage.css";
import "./editProfile.scss";
import { useState, useEffect } from "react";
import Post from "../Post/Posts";
import { auth } from "../../firebase/firebase";
import { ClimbingBoxLoader } from "react-spinners";
import NavComponent from "../navComponent/navComponent";
import UserList from "../userListComponent/userList";

const override = `
  display: block;
  margin: 25% auto;
  border-color: red;
`;

const ProfilePage = () => {
    const [imgLoaded, setImgLoaded] = useState<boolean>(false);
    const [user, setUser] = useState<any>({})
    const [posts, setPosts] = useState<any>("null")

    useEffect(() => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        };
        fetch('https://socnet-swe.herokuapp.com/getUser?email=' + auth.currentUser?.email, requestOptions)
        .then(response => response.json())
        .then(data => {
            setUser(data);
            console.log(Moment(data.createdDate).format('LL'));
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
    }, []);

    const [show, setShow] = useState(false);
    const [editShow, setEditShow] = useState(false);
    const [modalTitle, setModalTitle] = useState<string>("");
    const [userIds, setUserIds] = useState<string[]>([]);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleEditClose = () => setEditShow(false);
    const handleEditShow = () => setEditShow(true);

    const handleFollowerShow = () => {
        setModalTitle("Followers");
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "userIds":user.followers })
        };
        fetch('https://socnet-swe.herokuapp.com/getUnames', requestOptions)
        .then(response => response.json())
        .then(data => {
            setUserIds(data);
            handleShow();
        })
        .catch(error => console.log(error));
    };

    const handleFollowingShow = () => {
        setModalTitle("Following");
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "userIds":user.following })
        };
        fetch('https://socnet-swe.herokuapp.com/getUnames', requestOptions)
        .then(response => response.json())
        .then(data => {
            setUserIds(data);
            handleShow();
        })
        .catch(error => console.log(error));
    };

    const userEmail = auth.currentUser?.email;
    const [userName, setUserName] = useState(user.uname);
    const [dob, setDob] = useState(user.dob);
    const [bio, setBio] = useState(user.bio);
    const [website, setWebsite] = useState(user.website);
    const [location, setLocation] = useState(user.location);

    return (
        <>
            <NavComponent />
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title> {modalTitle} </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <UserList allUsers={userIds} user={user}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={editShow} onHide={handleEditClose}>
                <Modal.Header closeButton>
                <Modal.Title> Edit Profile </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* <div id="loginform"> */}
                        <form className="login__create-container__form-container__form" onSubmit={(e) => {
                            const requestOptions = {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ email: userEmail, uname: userName, dob: dob, bio: bio, website: website, location: location })
                            };
                            console.log(requestOptions.body);
                            fetch('https://socnet-swe.herokuapp.com/createUser', requestOptions)
                            .then(response => Promise.all([response.status,response.json()]))
                            .then(([status,response]) => {
                                console.log(response);
                                if (status === 200) {
                                    window.location.reload();
                                }
                                else{
                                    console.log("Error");
                                }
                            });
                            e.preventDefault();
                        }}>
                            <input
                                className="login__create-container__form-container__form--name"
                                placeholder={user.uname ? user.uname : "Username"}
                                value={userName}
                                onChange={(value) => setUserName(value.target.value)}
                                required />
                            <input
                                className="login__create-container__form-container__form--dob"
                                type="date"
                                placeholder={ user.dob ? user.dob : "01/01/2000"}
                                value={dob}
                                onChange={(value) => setDob(value.target.value)}
                                required />
                            <input
                                className="login__create-container__form-container__form--website"
                                type="url"
                                placeholder={user.website ? user.website : "Website URL"}
                                value={website}
                                onChange={(value) => setWebsite(value.target.value)} />
                            
                            <input
                                className="login__create-container__form-container__form--location"
                                placeholder={user.location ? user.location : "Place"}
                                value={location}
                                onChange={(value) => setLocation(value.target.value)} />

                            <textarea
                                className="login__create-container__form-container__form--bio"
                                cols={25}
                                placeholder={bio ? bio : "Bio"}
                                value={bio}
                                onChange={(value) => setBio(value.target.value)}>
                            </textarea>
                            <button
                                className="create-account">
                                Update Profile
                            </button>
                        </form>
                    {/* </div> */}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleEditClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <Container fluid="true">
                <Row fluid="true" className="gx-0">
                    <Col xs={0} md={3}></Col>
                    <Col fluid="true" xs={12} md={6}>
                        <Card>
                            <Card.Img variant="top" style={imgLoaded ? {width:"30%",margin:"0px auto"} : {display: 'none'}} src={"https://avatars.dicebear.com/api/bottts/"+auth.currentUser?.email+".svg?colorful=1"}  onLoad={() => setImgLoaded(true)} />
                            <Card.Body>
                                <Card.Title>{user.uname}</Card.Title>
                                <Card.Subtitle> <p className="text-secondary"> {auth.currentUser?.email} </p> </Card.Subtitle>
                                <Container fluid="true">
                                    <Row fluid="true" className="gx-0">
                                        <Col fluid="true" sm={3}>
                                            <FontAwesomeIcon size="xs" style={{display: "inline-block"}} icon={faLocationDot} /> <p style={{display: "inline-block"}}>{user.location ? user.location : "Oasis"}</p>
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
                                <Button variant="outline-dark" size="sm" onClick={handleEditShow}>Edit Profile</Button>
                            </Card.Body>
                            <Card.Footer className="py-0 my-0">
                                <Container fluid="true" className="gy-0 py-0 my-0">
                                    <Row fluid="true" className="gx-0 gy-0 py-0 my-0">
                                        <Col fluid="true" className="py-0 my-0">
                                            <div className="centerAlign py-0 my-0">
                                                <Button style={{margin:"3px 0px"}} variant="outline-dark" size="sm" onClick={handleFollowerShow}>
                                                    <p style={{fontSize:"12px",margin:"0px",display: "inline-block"}} className="text-secondary">Followers&nbsp;&nbsp;</p><p style={{fontSize:"12px",margin:"0px",fontWeight:"semibold",display: "inline-block"}}>{user.followers ? user.followers.length : 0}</p>
                                                </Button>
                                            </div>
                                        </Col>
                                        <Col fluid="true" className="py-0 my-0">
                                            <div className="centerAlign py-0 my-0">
                                                <Button style={{margin:"3px 0px"}} variant="outline-dark" size="sm" onClick={handleFollowingShow}>
                                                    <p style={{fontSize:"12px",margin:"0px",display: "inline-block"}} className="text-secondary">Following&nbsp;&nbsp;</p><p style={{fontSize:"12px",margin:"0px",fontWeight:"semibold",display: "inline-block"}}>{user.following ? user.following.length : 0}</p>
                                                </Button>
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
                    console.log(posts);
                    return (
                        <Row key={pid} fluid="true" className="gx-0">
                            <Col xs={0} md={3}></Col>
                            <Col fluid="true" xs={12} md={6}>
                                <Post content={post.content} uname={post.postedByName} media={post.media} likes={post.likes} comments={post.comments} reposts={post.reposts} pid={pid} fid={post.postedBy} uid={auth.currentUser?.uid}createdDate={post.createdDate} />
                            </Col>
                            <Col xs={0} md={3}></Col>
                        </Row>
                    );
                })}
                {Object.keys(posts).length===0 && <div style={{marginTop:"10%"}} className="text-secondary centerAlign">No posts yet!<br/>Head to the HomePage and post something!</div>}
            </Container>
        </>
    );
};

export default ProfilePage;