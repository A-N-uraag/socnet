import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faLink, faCakeCandles, faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { Card, Container, Row, Col, Button } from "react-bootstrap";
import Moment from "moment";
import "./profilePage.css";
import { useState } from "react";
import Post from "../Post/Posts";

const ProfilePage = (props: any) => {
    const [imgLoaded, setImgLoaded] = useState<boolean>(false);
    return (
        <>
            <Container fluid>
                <Row fluid className="gx-0">
                    <Card>
                        <Card.Img variant="top" style={imgLoaded ? {} : {display: 'none'}} src={props.user.profile.photoURL}  onLoad={() => setImgLoaded(true)} />
                        <Card.Body>
                            <Card.Title>{props.user.profile.name}</Card.Title>
                            <Card.Subtitle> <p className="text-secondary"> {props.user.profile.uname} </p> </Card.Subtitle>
                            <Container fluid>
                                <Row fluid className="gx-0">
                                    <Col fluid sm={3}>
                                        <FontAwesomeIcon size="xs" style={{display: "inline-block"}} icon={faLocationDot} /> <p style={{display: "inline-block"}}>{props.user.profile.location ? props.user.profile.location : "Zombieland"}</p>
                                    </Col>
                                    <Col fluid sm={3}>
                                        <FontAwesomeIcon size="xs" style={{display: "inline-block"}} icon={faLink} /> <a href={props.user.profile.website ? props.user.profile.website : "https://google.co.in"} style={{display: "inline-block", color: "#332FD0"}}>Homepage</a>
                                    </Col>
                                    <Col fluid sm={3}>
                                        <FontAwesomeIcon size="xs" style={{display: "inline-block"}} icon={faCakeCandles} /> <p style={{display: "inline-block"}}>{Moment(props.user.profile.dob).format('LL')}</p>
                                    </Col>
                                    <Col fluid sm={3}>
                                        <FontAwesomeIcon size="xs" style={{display: "inline-block"}} icon={faCalendarDays} /> <p style={{display: "inline-block"}}>{Moment(props.user.profile.createdDate).format('LL')}</p>
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
                                            <b style={{display: "inline-block"}}>{props.user.followers.length}</b> <p style={{display: "inline-block"}} className="text-secondary">Followers</p>
                                        </div>
                                    </Col>
                                    <Col fluid className="py-0 my-0">
                                        <div className="centerAlign py-0 my-0">
                                            <b style={{display: "inline-block"}}>{props.user.followees.length}</b> <p style={{display: "inline-block"}} className="text-secondary">Following</p>
                                        </div>
                                    </Col>
                                </Row>
                            </Container>
                        </Card.Footer>
                    </Card>
                </Row>
                {props.user.posts.map((pid: number) => {
                    return(
                        <Row fluid className="gx-0">
                            <Post postData={props.postData} uname={props.user.profile.uname} pid={pid}></Post>
                        </Row>
                    );
                })}
            </Container>
        </>
    );
};

export default ProfilePage;