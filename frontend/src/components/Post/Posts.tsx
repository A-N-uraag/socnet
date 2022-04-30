import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faDotCircle, faComment, faRetweet, faShare} from "@fortawesome/free-solid-svg-icons";
import {faHeart as faRHeart, faComment as faRComment } from "@fortawesome/free-regular-svg-icons";
import Moment from "moment";
import { Card, Row, Col, Modal, Button, Form, Image } from "react-bootstrap"; 
import { useState } from "react";
import { auth } from "../../firebase/firebase";

const Post = (props: any) => {
    Moment.locale('en');
    const [likeClicked, setLikeClicked] = useState<boolean>(props.likes ? props.likes.includes(auth.currentUser?.email) : false);
    const [likes, setLikes] = useState<number>(props.likes ? props.likes.length : 0);
    const [show, setShow] = useState<boolean>(false);
    const [comment, setComment] = useState<string>("");
    const commented:any = props.comments ? props.comments.some((comment: any) => comment.uid === props.uid) : false;
    const onLikeClick = () => {
        if(auth.currentUser !== null){
            if(!likeClicked) {
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ "postId":props.pid,"email":auth.currentUser?.email })
                };
                fetch('https://socnet-swe.herokuapp.com/likePost', requestOptions);
            }
            else{
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ "postId":props.pid,"email":auth.currentUser?.email })
                };
                fetch('https://socnet-swe.herokuapp.com/unlikePost', requestOptions);
            }
            setLikeClicked(!likeClicked);
            setLikes(likeClicked ? likes - 1 : likes + 1);
        }
    };
    const onCommentChange = (event: any) => {
        setComment(event.target.value);
    };
    const handleClose = () => {
        setShow(false);
    };
    const onCommentClick = () => {
        setShow(true);
    };
    const handleSubmit = () => {
        if(comment === ""){
            console.log("No comment");
        }
        else{
            console.log(comment);
        }
        setShow(false);
    };
    return (
        <Card className="my-1">
            <Card.Body>
                <Card.Subtitle> 
                    <p style={{display: "inline-block"}}> 
                        {props.uname}
                    </p>
                    <FontAwesomeIcon key="delimiter" className={"mx-2"}  size="xs" style={{display: "inline-block"}} icon={faDotCircle} /> 
                    <p className="text-secondary" style={{display: "inline-block", color: "secondary"}}> {Moment(props.createdDate).format('LL')} </p>
                </Card.Subtitle>
                <Card.Text style={{fontSize:"15px"}}>
                    {props.content}
                </Card.Text>
                {props.media && <Image
                    style={{width: "30%", margin:"2px 35%"}}
                    src={props.media}
                    fluid={true}
                />}
            </Card.Body>
            <Card.Footer className="py-0 my-0">
                <Row fluid="true">
                    <Col fluid="true">
                        {likeClicked ? <FontAwesomeIcon key="like" onClick={onLikeClick}  size="xs" style={{display: "inline-block"}} icon={faHeart} /> : <FontAwesomeIcon key="liked" onClick={onLikeClick} size="xs" style={{display: "inline-block"}} icon={faRHeart} />}
                        <i style={{display: "inline-block"}}>{likes}</i>
                    </Col>
                    <Col fluid="true">
                        {commented ? <FontAwesomeIcon key="comment" onClick={onCommentClick} size="xs" style={{display: "inline-block"}} icon={faComment} /> : <FontAwesomeIcon key="commented" onClick={onCommentClick} size="xs" style={{display: "inline-block"}} icon={faRComment} />}
                        <i style={{display: "inline-block"}}>{props.comments ? props.comments.length : 0}</i>
                        <Modal show={show} onHide={handleClose}>
                            <Modal.Header closeButton>
                            <Modal.Title>Comment</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Comment</Form.Label>
                                        <Form.Control as="textarea" rows={1} placeholder={"Tweet your reply"} onChange={onCommentChange}/>
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                            <Button variant="secondary" onClick={handleSubmit}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={handleClose}>
                                Tweet Comment
                            </Button>
                            </Modal.Footer>
                        </Modal>
                    </Col>
                    <Col fluid="true">
                        <FontAwesomeIcon key="share" size="xs" style={{display: "inline-block"}} icon={faRetweet} /> <i style={{display: "inline-block"}}>{props.reposts}</i>
                    </Col>
                    <Col fluid="true">
                        <FontAwesomeIcon key="share" size="xs" style={{display: "inline-block"}} icon={faShare} />
                    </Col>
                </Row>
            </Card.Footer>
        </Card>
    );
};

export default Post;