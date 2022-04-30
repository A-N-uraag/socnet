import { Container, Row, Col } from "react-bootstrap";
import FeedComponent from "../feedComponent/FeedComponent";
import NavComponent from "../navComponent/navComponent";

const Homepage = () => {
    
    return(
        <>
            <NavComponent />
            <Container className="mt-3 justify-content-center" fluid="true">
                <Row fluid="true">
                    <Col xs={0} md={3}></Col>
                    <Col fluid="true" xs={12} md={6}>
                        <FeedComponent />
                    </Col>
                    <Col xs={0} md={3}></Col>
                </Row>
            </Container>
        </>
    );
};

export default Homepage;
