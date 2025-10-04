import { Box, Radio, RadioGroup, Typography } from "@mui/joy";

interface QuestionCountRadioProps {
	value?: number;
	onChange?: (value: number) => void;
	label: string;
	options?: number[];
}

export default function QuestionCountRadio({ value, onChange, label, options = [5, 8, 10, 12, 15, 20] }: QuestionCountRadioProps) {
	return (
		<Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
			<Typography id="question-count-controls" sx={{ fontWeight: "lg", fontSize: "sm" }}>
				{label}
			</Typography>
			<RadioGroup
				orientation="horizontal"
				aria-labelledby="question-count-controls"
				value={value?.toString()}
				onChange={(event) => onChange?.(Number(event.target.value))}
				sx={{
					minHeight: 48,
					padding: "4px",
					borderRadius: "12px",
					bgcolor: "neutral.softBg",
					"--RadioGroup-gap": "4px",
					"--Radio-actionRadius": "8px",
				}}
			>
				{options.map((count) => (
					<Radio
						key={count}
						value={count.toString()}
						label={count.toString()}
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
				))}
			</RadioGroup>
		</Box>
	);
}
