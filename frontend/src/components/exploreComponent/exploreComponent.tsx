import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import UserList from "../userListComponent/userList";
import { auth } from "../../firebase/firebase";
import NavComponent from "../navComponent/navComponent";

const ExploreComponent = () => {
    const [allUsers, setAllUsers] = useState<any>({});
    const [user, setUser] = useState<any>({});
    useEffect(() => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        };
        Promise.all([fetch("https://socnet-swe.herokuapp.com/getUser?email="+auth.currentUser?.email,requestOptions),fetch('https://socnet-swe.herokuapp.com/getAllUsers', requestOptions)])
        .then(([userresp,allusersresp]) => Promise.all([userresp.json(),allusersresp.json()]))
        .then(([user, allusers]) => {
            setAllUsers(allusers);
            setUser(user);
        });
    }, []);

    
    return (
        <>
            <NavComponent />
            <Container fluid="true">
                <Row fluid="true">
                    <Col md={{ span: 4, offset: 4 }}>
                        <UserList allUsers={allUsers} user={user}/>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default ExploreComponent;