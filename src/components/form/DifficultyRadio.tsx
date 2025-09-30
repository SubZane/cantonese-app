import { Box, Radio, RadioGroup, Typography } from "@mui/joy";

interface DifficultyRadioProps {
	value?: string;
	onChange?: (value: string) => void;
	labels: {
		title: string;
		all: string;
		easy: string;
		medium: string;
		hard: string;
	};
}

export default function DifficultyRadio({ value, onChange, labels }: DifficultyRadioProps) {
	return (
		<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
			<Typography id="segmented-controls-example" sx={{ fontWeight: "lg", fontSize: "sm" }}>
				{labels.title}
			</Typography>
			<RadioGroup
				orientation="horizontal"
				aria-labelledby="segmented-controls-example"
				value={value}
				onChange={(event) => onChange?.(event.target.value)}
				sx={{
					minHeight: 48,
					padding: "4px",
					borderRadius: "12px",
					bgcolor: "neutral.softBg",
					"--RadioGroup-gap": "4px",
					"--Radio-actionRadius": "8px",
				}}
			>
				<Radio
					value="all"
					label={labels.all}
					color="neutral"
					disableIcon
					variant="plain"
					sx={{ px: 2, alignItems: "center" }}
					slotProps={{
						action: ({ checked }) => ({
							sx: {
								...(checked && {
									bgcolor: "background.surface",
									boxShadow: "sm",
									"&:hover": {
										bgcolor: "background.surface",
									},
								}),
							},
						}),
					}}
				/>
				<Radio
					value="easy"
					label={labels.easy}
					color="neutral"
					disableIcon
					variant="plain"
					sx={{ px: 2, alignItems: "center" }}
					slotProps={{
						action: ({ checked }) => ({
							sx: {
								...(checked && {
									bgcolor: "background.surface",
									boxShadow: "sm",
									"&:hover": {
										bgcolor: "background.surface",
									},
								}),
							},
						}),
					}}
				/>
				<Radio
					value="medium"
					label={labels.medium}
					color="neutral"
					disableIcon
					variant="plain"
					sx={{ px: 2, alignItems: "center" }}
					slotProps={{
						action: ({ checked }) => ({
							sx: {
								...(checked && {
									bgcolor: "background.surface",
									boxShadow: "sm",
									"&:hover": {
										bgcolor: "background.surface",
									},
								}),
							},
						}),
					}}
				/>
				<Radio
					value="hard"
					label={labels.hard}
					color="neutral"
					disableIcon
					variant="plain"
					sx={{ px: 2, alignItems: "center" }}
					slotProps={{
						action: ({ checked }) => ({
							sx: {
								...(checked && {
									bgcolor: "background.surface",
									boxShadow: "sm",
									"&:hover": {
										bgcolor: "background.surface",
									},
								}),
							},
						}),
					}}
				/>
			</RadioGroup>
		</Box>
	);
}
