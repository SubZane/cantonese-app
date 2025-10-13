import React from "react";
import { useNavigate } from "react-router-dom";

import { Box, Drawer, FormControl, FormLabel, List, ListItem, ListItemButton, Option, Select, Switch, Typography } from "@mui/joy";

import { useCantoneseVariant } from "../context/CantoneseVariantContext";
import { Language, useT, useTranslation } from "../translations";

interface NavigationDrawerProps {
	open: boolean;
	onClose: () => void;
	showJyutping?: boolean;
	onJyutpingToggle?: () => void;
}

const NavigationDrawer: React.FC<NavigationDrawerProps> = ({ open, onClose, showJyutping = false, onJyutpingToggle }) => {
	const { t } = useT();
	const { language, setLanguage } = useTranslation();
	const { useHongKong, toggleHongKong } = useCantoneseVariant();
	const navigate = useNavigate();

	const handleNavigation = (path: string) => {
		navigate(path);
		onClose();
	};

	const handleLanguageChange = (_event: any, newValue: Language | null) => {
		if (newValue) {
			setLanguage(newValue);
		}
	};

	return (
		<Drawer open={open} onClose={onClose}>
			<Box
				sx={{
					width: { xs: 280, sm: 280 },
					maxWidth: { xs: 280, sm: 280 },
					p: { xs: 2, sm: 2 },
					height: "100vh",
					overflow: "auto",
					display: "flex",
					flexDirection: "column",
				}}
			>
				<Typography
					level="h4"
					sx={{
						mb: 3,
						fontSize: "1.25rem",
						fontWeight: 600,
					}}
				>
					{t.navigation.menu}
				</Typography>
				<List
					sx={{
						py: 0,
						my: 0,
					}}
				>
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

					{/* Settings Divider */}
					<ListItem
						sx={{
							mt: 2,
							mb: 1,
							borderTop: "1px solid",
							borderColor: "divider",
							pt: 2,
						}}
					>
						<Typography
							level="title-md"
							sx={{
								fontSize: "1rem",
								fontWeight: 600,
							}}
						>
							{t.labels.settings}
						</Typography>
					</ListItem>

					{/* Language Switcher */}
					<ListItem>
						<FormControl
							orientation="horizontal"
							sx={{
								justifyContent: "space-between",
								alignItems: "center",
								gap: 1,
								width: "100%",
							}}
						>
							<FormLabel
								sx={{
									fontSize: "0.875rem",
									flex: 1,
									minWidth: 0,
								}}
							>
								{t.labels.language}
							</FormLabel>
							<Select
								value={language}
								onChange={handleLanguageChange}
								size="sm"
								sx={{
									minWidth: 100,
									maxWidth: 120,
									flexShrink: 0,
								}}
							>
								<Option value="sv">{t.labels.swedish}</Option>
								<Option value="en">{t.labels.english}</Option>
							</Select>
						</FormControl>
					</ListItem>

					{/* Jyutping Toggle */}
					{onJyutpingToggle && (
						<ListItem>
							<FormControl
								orientation="horizontal"
								sx={{
									justifyContent: "space-between",
									alignItems: "center",
									width: "100%",
								}}
							>
								<FormLabel
									sx={{
										fontSize: "0.875rem",
										flex: 1,
									}}
								>
									{t.navigation.showJyutping}
								</FormLabel>
								<Switch checked={showJyutping} onChange={onJyutpingToggle} size="sm" />
							</FormControl>
						</ListItem>
					)}

					{/* HK Variant Toggle */}
					<ListItem>
						<FormControl
							orientation="horizontal"
							sx={{
								justifyContent: "space-between",
								alignItems: "center",
								width: "100%",
							}}
						>
							<FormLabel
								sx={{
									fontSize: "0.875rem",
									flex: 1,
								}}
							>
								{t.navigation.hkVariant}
							</FormLabel>
							<Switch checked={useHongKong} onChange={toggleHongKong} size="sm" />
						</FormControl>
					</ListItem>
				</List>
			</Box>
		</Drawer>
	);
};

export default NavigationDrawer;
