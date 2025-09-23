import React from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useT } from "../translations";

const Home: React.FC = () => {
	const { t } = useT();
	const navigate = useNavigate();

	const handleNavigateToQuiz = () => {
		navigate("/quiz");
	};

	return (
		<Container className="py-4" style={{ maxWidth: "800px" }}>
			<div className="text-center mb-4">
				<h1 className="mb-3">{t.home.welcome}</h1>
				<p className="text-muted">{t.home.subtitle}</p>
			</div>

			<Row className="g-4 mb-4">
				{/* Quick Quiz Card */}
				<Col xs={12} md={6} className="mx-auto">
					<Card className="h-100 d-flex flex-column">
						<Card.Body className="flex-grow-1 text-center">
							<div className="text-primary mb-3" style={{ fontSize: "3rem" }}>
								<FontAwesomeIcon icon="clipboard-question" />
							</div>
							<Card.Title as="h5">{t.home.quickQuiz.title}</Card.Title>
							<Card.Text className="text-muted">{t.home.quickQuiz.description}</Card.Text>
						</Card.Body>
						<div className="text-center pb-3">
							<Button variant="primary" onClick={handleNavigateToQuiz}>
								<FontAwesomeIcon icon="clipboard-question" className="me-2" />
								{t.home.quickQuiz.button}
							</Button>
						</div>
					</Card>
				</Col>
			</Row>
		</Container>
	);
};

export default Home;
