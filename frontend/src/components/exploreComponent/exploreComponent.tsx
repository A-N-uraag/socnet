import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import UserList from "../userListComponent/userList";



const ExploreComponent = () => {
    
    const [users, setUsers] = useState<any>({});
    useEffect(() => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        };
        fetch('https://socnet-swe.herokuapp.com/getAllUsers', requestOptions)
                    .then(response => response.json())
                    .then(data => {
                        console.log(data);
                        setUsers(data);
                    });
    }, []);

    
    return (
        <>
            <Container fluid="true">
                <Row fluid="true">
                    <Col md={{ span: 4, offset: 4 }}>
                        <UserList userIds={users}/>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default ExploreComponent;