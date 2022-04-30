import { useState } from "react";
import { Card, Container, Row, Col, Button } from "react-bootstrap";
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
                            <Col md={4}>
                                <p><strong>{props.uname}</strong></p> <p className="text-secondary">{props.uid}</p>
                            </Col>
                            <Col md={{ span: 4, offset: 4 }}>
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