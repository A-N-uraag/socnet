import { useState } from "react";
import { Card, Container, Row, Col, Button, Image } from "react-bootstrap";
import { auth } from "../../firebase/firebase";

const UserList = (props: any) => {
    return (
        <>
            <Container fluid="true">
                {Object.keys(props.allUsers).map((uid: string) => {
                    return (
                       <UserListItem key={uid} uid={uid} user={props.user} uname={props.allUsers[uid]}/> 
                    );
                })}
            </Container>
        </>
    );
};

const UserListItem = (props: any) => {
    const [following, setFollowing] = useState<boolean>(props.user ? props.user.following.includes(props.uid) : false);
    const [imgLoaded, setImgLoaded] = useState<boolean>(false);

    const handleEdge = () => {
        if(auth.currentUser !== null){
            if(!following) {
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ "userId":props.uid,"followerId":auth.currentUser?.email })
                };
                fetch('https://socnet-swe.herokuapp.com/followUser', requestOptions);
            }
            else{
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ "userId":props.uid,"followerId":auth.currentUser?.email })
                };
                fetch('https://socnet-swe.herokuapp.com/unfollowUser', requestOptions);
            }
            setFollowing(!following);
        }
    };

    return(
        <Row fluid="true">
            <Card>
                <Card.Body>
                    <Container fluid="true">
                        <Row fluid="true">
                            <Col md={2}>
                                <Image fluid roundedCircle style={imgLoaded ? {margin:"0px auto"} : {display: 'none'}} src={"https://avatars.dicebear.com/api/bottts/"+props.uid+".svg?colorful=1"}  onLoad={() => setImgLoaded(true)}/>
                            </Col>
                            <Col md={4}>
                                <a href={"/user/" + props.uid}><strong>{props.uname}</strong></a> <p className="text-secondary">{props.uid}</p>
                            </Col>
                            <Col md={{ span: 4, offset: 2 }}>
                                {(auth.currentUser === null || auth.currentUser.email === props.uid) ? null : <Button variant={following ? "dark" : "outline-dark"} size="sm" onClick={handleEdge}>{following ? "Unfollow" : "Follow"}</Button>}
                            </Col>
                        </Row>
                    </Container>
                </Card.Body>
            </Card>
        </Row>
    );
};

export default UserList;