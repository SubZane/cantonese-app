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
				px: { xs: 2, sm: 3 },
				py: { xs: 1.5, sm: 2 },
				backgroundColor: "#292A37",
				borderBottom: "1px solid var(--joy-palette-divider)",
				minHeight: { xs: "60px", sm: "70px" },
			}}
		>
			<Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 2 } }}>
				{/* Hamburger Menu */}
				<IconButton
					onClick={handleDrawerToggle}
					aria-label="Öppna meny"
					size="sm"
					sx={{
						color: "white",
						minWidth: { xs: "40px", sm: "44px" },
						minHeight: { xs: "40px", sm: "44px" },
						"&:hover": {
							backgroundColor: "rgba(255, 255, 255, 0.1)",
						},
					}}
				>
					{/* Force icon color to white to avoid inheriting default grey */}
					<MenuIcon
						sx={{
							color: "#FFFFFF",
							fontSize: { xs: "1.2rem", sm: "1.5rem" },
						}}
					/>
				</IconButton>

				{/* Logo */}
				<Box
					sx={{
						width: { xs: 40, sm: 48 },
						height: { xs: 40, sm: 48 },
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
