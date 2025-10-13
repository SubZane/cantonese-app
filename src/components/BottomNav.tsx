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
				height: { xs: "60px", sm: "70px" },
				py: { xs: "4px", sm: "6px" },
				px: { xs: 0.5, sm: 1 },
				display: "flex",
				justifyContent: "space-around",
				alignItems: "center",
				minHeight: { xs: "60px", sm: "70px" },
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
						px: { xs: 1, sm: 2 },
						py: { xs: 0.5, sm: 1 },
						textDecoration: "none",
						color: currentView === item.key ? "primary.500" : "text.secondary",
						flex: 1,
						minWidth: 0,
						transition: "color 0.2s ease",
						"&:hover": {
							textDecoration: "none",
							color: currentView === item.key ? "primary.600" : "text.primary",
						},
					}}
				>
					<Box
						sx={{
							fontSize: { xs: "1.1rem", sm: "1.2rem" },
							mb: { xs: "1px", sm: "2px" },
							lineHeight: 1,
						}}
					>
						<FontAwesomeIcon icon={item.icon as any} />
					</Box>
					<Typography
						fontSize="xs"
						sx={{
							fontSize: { xs: "0.65rem", sm: "0.75rem" },
							lineHeight: 1,
							whiteSpace: "nowrap",
							overflow: "hidden",
							textOverflow: "ellipsis",
							maxWidth: "100%",
						}}
					>
						{item.label}
					</Typography>
				</Box>
			))}
		</Box>
	);
};

export default BottomNav;
