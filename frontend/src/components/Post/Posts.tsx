import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faDotCircle} from "@fortawesome/free-solid-svg-icons";
import Moment from "moment";
import { Card, Row, Col } from "react-bootstrap"; 

const Post = (props: any) => {
    Moment.locale('en');
    return (
        <Card>
            <Card.Body>
                {/* <Card.Title>{props.userData[props.uid].profile.uname}</Card.Title> */}
                <Card.Subtitle> 
                    <p style={{display: "inline-block"}}> 
                        {props.userData[props.uid].profile.uname}
                    </p>
                    <FontAwesomeIcon className={"mx-2"}  size="xs" style={{display: "inline-block"}} icon={faDotCircle} /> 
                    <p style={{display: "inline-block", color: "secondary"}}> {Moment(props.postData[props.pid].createdDate).format('LL')} </p>
                </Card.Subtitle>
                <Card.Text>
                    {props.postData[props.pid].content}
                </Card.Text>
            </Card.Body>
            <Card.Footer>
                <Row fluid>
                    <Col fluid>
                        <FontAwesomeIcon  size="xs" style={{display: "inline-block"}} icon={faHeart} /> <i style={{display: "inline-block"}}>{props.postData[props.pid].likes}</i>
                    </Col>
                </Row>
            </Card.Footer>
        </Card>
    );
};

export default Post;