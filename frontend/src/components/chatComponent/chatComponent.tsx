import { Container, Row, Col } from "react-bootstrap";
import NavComponent from "../navComponent/navComponent";
import "./chatComponent.css";

const ChatComponent = () => {
    return (
        <>
            <NavComponent />
            <Container fluid="true">
                <Row fluid="true" className="gx-0">
                    <Col xs={0} md={3}></Col>
                    <Col fluid xs={12} md={6}>
                        <h1>Coming Soon</h1>
                    </Col>
                    <Col xs={0} md={3}></Col>
                </Row>
            </Container>
        </>
    );
};

export default ChatComponent;