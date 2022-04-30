import { useEffect, useState } from "react";
import { Card, Container, Row, Col, Button } from "react-bootstrap";
import { auth } from "../../firebase/firebase";

const UserList = (props: any) => {
    return (
        <>
            <Container fluid="true">
                {props.userIds.map((uid: string) => {
                    return (
                       <UserListItem key={uid} uid={uid}/> 
                    );
                })}
            </Container>
        </>
    );
};

const UserListItem = (props: any) => {
    const [user, setUser] = useState<any>({});
    const [following, setFollowing] = useState<boolean>(user.followers ? user.followers.includes(auth.currentUser?.email) : false);
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
    useEffect(() => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        };
        // console.log('https://socnet-swe.herokuapp.com/getUser?email=' + props.uid)
        fetch('https://socnet-swe.herokuapp.com/getUser?email=' + props.uid, requestOptions)
                    .then(response => response.json())
                    .then(data => {
                        console.log(data);
                        // setUser(data);
                        setFollowing(data.followers.includes(auth.currentUser?.email));
                        setUser(data);
                    });
    }, []);

    return(
        <Row fluid="true">
            <Card>
                <Card.Body>
                    <Container fluid="true">
                        <Row fluid="true">
                            <Col md={4}>
                                <p><strong>{user.uname}</strong></p> <p className="text-secondary">{props.uid}</p>
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