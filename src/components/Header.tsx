import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, FormControl, FormLabel, Switch, Typography } from "@mui/joy";

import { useT } from "../translations";

interface HeaderProps {
	showPinyin?: boolean;
	onPinyinToggle?: () => void;
	showToggle?: boolean;
}

const Header: React.FC<HeaderProps> = ({ showPinyin = false, onPinyinToggle, showToggle = false }) => {
	const { t } = useT();

	return (
		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				px: 3,
				py: 2,
			}}
		>
			<Box sx={{ display: "flex", alignItems: "center" }}>
				<FontAwesomeIcon icon="language" style={{ marginRight: "8px", color: "white" }} />
				<Typography level="h4" sx={{ color: "white", fontWeight: "bold" }}>
					{t.appName}
				</Typography>
			</Box>
			{showToggle && onPinyinToggle && (
				<FormControl orientation="horizontal" sx={{ gap: 1 }}>
					<FormLabel sx={{ color: "white", fontSize: "0.9rem", mb: 0 }}>{t.showPinyin}</FormLabel>
					<Switch checked={showPinyin} onChange={onPinyinToggle} />
				</FormControl>
			)}
		</Box>
	);
};

export default Header;
