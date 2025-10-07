import React, { useState } from "react";

import MenuIcon from "@mui/icons-material/Menu";
import { Box, IconButton } from "@mui/joy";

import NavigationDrawer from "./NavigationDrawer";

interface HeaderProps {
	showJyutping?: boolean;
	onJyutpingToggle?: () => void;
	showToggle?: boolean;
}

const Header: React.FC<HeaderProps> = ({ showJyutping = false, onJyutpingToggle, showToggle = false }) => {
	const [drawerOpen, setDrawerOpen] = useState(false);

	const handleDrawerToggle = () => {
		setDrawerOpen(!drawerOpen);
	};

	return (
		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				px: 3,
				py: 2,
				backgroundColor: "#292A37",
				borderBottom: "1px solid var(--joy-palette-divider)",
			}}
		>
			<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
				{/* Hamburger Menu */}
				<IconButton
					onClick={handleDrawerToggle}
					aria-label="Öppna meny"
					sx={{
						color: "white",
						"&:hover": {
							backgroundColor: "rgba(255, 255, 255, 0.1)",
						},
					}}
				>
					{/* Force icon color to white to avoid inheriting default grey */}
					<MenuIcon sx={{ color: "#FFFFFF" }} />
				</IconButton>

				{/* Logo */}
				<Box
					sx={{
						width: 48,
						height: 48,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						overflow: "hidden",
					}}
				>
					<img
						src="/logo.png"
						alt="Logo"
						style={{
							width: "100%",
							height: "100%",
							objectFit: "cover",
						}}
					/>
				</Box>
			</Box>

			{/* Navigation Drawer */}
			<NavigationDrawer open={drawerOpen} onClose={handleDrawerToggle} showJyutping={showJyutping} onJyutpingToggle={showToggle && onJyutpingToggle ? onJyutpingToggle : undefined} />
		</Box>
	);
};

export default Header;
