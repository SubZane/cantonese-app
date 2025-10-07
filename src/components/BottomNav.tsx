import React from "react";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Typography } from "@mui/joy";

import { useT } from "../translations";

interface BottomNavProps {
	currentView: string;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView }) => {
	const { t } = useT();

	const navItems = [
		{ key: "home", label: t.navigation.home, icon: "home", path: "/" },
		{ key: "vocabulary", label: t.navigation.vocabulary, icon: "book", path: "/vocabulary" },
		{ key: "quiz", label: t.navigation.quiz, icon: "clipboard-question", path: "/quiz" },
	];

	return (
		<Box
			sx={{
				position: "relative",
				backgroundColor: "var(--bg-color)",
				borderTop: "1px solid",
				borderColor: "var(--border-color)",
				boxShadow: "sm",
				zIndex: 1000,
				height: "70px",
				py: "6px",
				px: 1,
				display: "flex",
				justifyContent: "space-around",
				alignItems: "center",
			}}
		>
			{navItems.map((item) => (
				<Box
					key={item.key}
					component={Link}
					to={item.path}
					sx={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						textAlign: "center",
						px: 2,
						textDecoration: "none",
						color: currentView === item.key ? "primary.500" : "text.secondary",
						"&:hover": {
							textDecoration: "none",
							color: currentView === item.key ? "primary.600" : "text.primary",
						},
					}}
				>
					<Box sx={{ fontSize: "1.2rem", mb: "2px" }}>
						<FontAwesomeIcon icon={item.icon as any} />
					</Box>
					<Typography fontSize="xs">{item.label}</Typography>
				</Box>
			))}
		</Box>
	);
};

export default BottomNav;
