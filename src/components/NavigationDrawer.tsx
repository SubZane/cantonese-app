import React from "react";
import { useNavigate } from "react-router-dom";

import { Box, Drawer, FormControl, FormLabel, List, ListItem, ListItemButton, Switch, Typography } from "@mui/joy";

import { useCantoneseVariant } from "../context/CantoneseVariantContext";
import { useT } from "../translations";

interface NavigationDrawerProps {
	open: boolean;
	onClose: () => void;
	showJyutping?: boolean;
	onJyutpingToggle?: () => void;
}

const NavigationDrawer: React.FC<NavigationDrawerProps> = ({ open, onClose, showJyutping = false, onJyutpingToggle }) => {
	const { t } = useT();
	const { useHongKong, toggleHongKong } = useCantoneseVariant();
	const navigate = useNavigate();

	const handleNavigation = (path: string) => {
		navigate(path);
		onClose();
	};

	return (
		<Drawer open={open} onClose={onClose}>
			<Box sx={{ width: 280, p: 2 }}>
				<Typography level="h4" sx={{ mb: 3 }}>
					{t.navigation.menu}
				</Typography>
				<List>
					<ListItem>
						<ListItemButton onClick={() => handleNavigation("/")}>
							<Typography>{t.navigation.home}</Typography>
						</ListItemButton>
					</ListItem>
					<ListItem>
						<ListItemButton onClick={() => handleNavigation("/vocabulary")}>
							<Typography>{t.navigation.vocabulary}</Typography>
						</ListItemButton>
					</ListItem>
					<ListItem>
						<ListItemButton onClick={() => handleNavigation("/quiz")}>
							<Typography>{t.navigation.quiz}</Typography>
						</ListItemButton>
					</ListItem>
				</List>

				{/* Settings Section */}
				<Box sx={{ mt: 4, borderTop: "1px solid", borderColor: "divider", pt: 3 }}>
					<Typography level="title-md" sx={{ mb: 2 }}>
						Settings
					</Typography>

					{/* Jyutping Toggle */}
					<FormControl orientation="horizontal" sx={{ mb: 2, justifyContent: "space-between" }}>
						<FormLabel sx={{ fontSize: "0.9rem" }}>{t.showJyutping}</FormLabel>
						<Switch checked={showJyutping} onChange={onJyutpingToggle} />
					</FormControl>

					{/* HK Variant Toggle */}
					<FormControl orientation="horizontal" sx={{ justifyContent: "space-between" }}>
						<FormLabel sx={{ fontSize: "0.9rem" }}>HK Variant</FormLabel>
						<Switch checked={useHongKong} onChange={toggleHongKong} />
					</FormControl>
				</Box>
			</Box>
		</Drawer>
	);
};

export default NavigationDrawer;
