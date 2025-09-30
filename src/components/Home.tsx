import React from "react";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, Card, Container, Typography } from "@mui/joy";

import { useT } from "../translations";

const Home: React.FC = () => {
	const { t } = useT();
	const navigate = useNavigate();

	const handleNavigateToQuiz = () => {
		navigate("/quiz");
	};

	return (
		<Container sx={{ py: 4, maxWidth: "800px" }}>
			<Box sx={{ textAlign: "center", mb: 4 }}>
				<Typography level="h1" sx={{ mb: 3 }}>
					{t.home.welcome}
				</Typography>
				<Typography color="neutral" sx={{ color: "text.secondary" }}>
					{t.home.subtitle}
				</Typography>
			</Box>

			<Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
				{/* Quick Quiz Card */}
				<Box sx={{ width: { xs: "100%", md: "50%" } }}>
					<Card
						sx={{
							height: "100%",
							display: "flex",
							flexDirection: "column",
							textAlign: "center",
						}}
					>
						<Box sx={{ flexGrow: 1, p: 3 }}>
							<Box sx={{ color: "primary.500", mb: 3, fontSize: "3rem" }}>
								<FontAwesomeIcon icon="clipboard-question" />
							</Box>
							<Typography level="title-lg" sx={{ mb: 2 }}>
								{t.home.quickQuiz.title}
							</Typography>
							<Typography color="neutral">{t.home.quickQuiz.description}</Typography>
						</Box>
						<Box sx={{ p: 3, pt: 0 }}>
							<Button variant="solid" color="primary" onClick={handleNavigateToQuiz}>
								<FontAwesomeIcon icon="clipboard-question" style={{ marginRight: "8px" }} />
								{t.home.quickQuiz.button}
							</Button>
						</Box>
					</Card>
				</Box>
			</Box>
		</Container>
	);
};

export default Home;
