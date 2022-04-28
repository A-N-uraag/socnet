import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faDotCircle, faComment, faRetweet, faShare} from "@fortawesome/free-solid-svg-icons";
import {faHeart as faRHeart, faComment as faRComment } from "@fortawesome/free-regular-svg-icons";
import Moment from "moment";
import { Card, Row, Col, Modal, Button, Form } from "react-bootstrap"; 
import { useState } from "react";

const Post = (props: any) => {
    Moment.locale('en');
    const [likeClicked, setLikeClicked] = useState<boolean>(false);
    const [likes, setLikes] = useState<number>(props.postData[props.pid].likes);
    const [show, setShow] = useState<boolean>(false);
    const [comment, setComment] = useState<string>("");
    const [commented, setCommented] = useState<boolean>(props.postData[props.pid].comments.some((comment: any) => comment.uid === props.uid));
    const [repostClicked, setRepostClicked] = useState<boolean>(false);
    const onLikeClick = () => {
        likeClicked ? setLikes(likes-1) : setLikes(likes+1);
        setLikeClicked(!likeClicked);
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
    const triggerEvent = () => {
        console.log("Hello")
        props.userCallback(props.fid);
        props.paramCallback("user");
    };
    return (
        <Card className="my-1">
            <Card.Body>
                <Card.Subtitle> 
                    <p style={{display: "inline-block"}} onClick={triggerEvent}> 
                        {props.uname}
                    </p>
                    <FontAwesomeIcon className={"mx-2"}  size="xs" style={{display: "inline-block"}} icon={faDotCircle} /> 
                    <p className="text-secondary" style={{display: "inline-block", color: "secondary"}}> {Moment(props.postData[props.pid].createdDate).format('LL')} </p>
                </Card.Subtitle>
                <Card.Text className="">
                    {props.postData[props.pid].content}
                </Card.Text>
            </Card.Body>
            <Card.Footer className="py-0 my-0">
                <Row fluid>
                    <Col fluid>
                        {likeClicked ? ([<FontAwesomeIcon onClick={onLikeClick}  size="xs" style={{display: "inline-block"}} icon={faHeart} />, <i style={{display: "inline-block"}}>{likes}</i>]) : ([<FontAwesomeIcon onClick={onLikeClick} size="xs" style={{display: "inline-block"}} icon={faRHeart} />, <i style={{display: "inline-block"}}>{likes}</i>])}
                    </Col>
                    <Col fluid>
                        {commented ? ([<FontAwesomeIcon  onClick={onCommentClick} size="xs" style={{display: "inline-block"}} icon={faComment} />, <i style={{display: "inline-block"}}>{props.postData[props.pid].comments.length}</i>]):([<FontAwesomeIcon onClick={onCommentClick} size="xs" style={{display: "inline-block"}} icon={faRComment} />, <i style={{display: "inline-block"}}>{props.postData[props.pid].comments.length}</i>])}
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
                    <Col fluid>
                        <FontAwesomeIcon  size="xs" style={{display: "inline-block"}} icon={faRetweet} /> <i style={{display: "inline-block"}}>{props.postData[props.pid].reposts}</i>
                    </Col>
                    <Col fluid>
                        <FontAwesomeIcon  size="xs" style={{display: "inline-block"}} icon={faShare} />
                    </Col>
                </Row>
            </Card.Footer>
        </Card>
    );
};

export default Post;