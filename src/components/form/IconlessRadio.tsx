import Box from "@mui/joy/Box";
import FormLabel from "@mui/joy/FormLabel";
import Radio from "@mui/joy/Radio";
import RadioGroup from "@mui/joy/RadioGroup";
import Sheet from "@mui/joy/Sheet";

interface IconlessRadioProps {
	value: string;
	onChange: (value: string) => void;
	options: Array<{
		value: string;
		label: string;
		pinyin?: string;
	}>;
	showPinyin?: boolean;
	disabled?: boolean;
	title?: string;
	correctAnswer?: string;
	showResult?: boolean;
}

export default function IconlessRadio({ value, onChange, options, showPinyin = false, disabled = false, title, correctAnswer, showResult = false }: IconlessRadioProps) {
	const getSheetStyles = (optionValue: string, checked: boolean) => {
		let styles: any = {
			p: 2,
			borderRadius: "md",
			boxShadow: "sm",
			transition: "all 0.2s ease",
			border: "2px solid #e0e0e0", // Default border
			minHeight: "60px",
			display: "flex",
			alignItems: "center",
		};

		if (showResult && correctAnswer) {
			if (optionValue === correctAnswer) {
				// Correct answer - green
				styles.backgroundColor = "#c7e1a7";
				styles.borderColor = "#c7e1a7";
				styles.border = "2px solid #c7e1a7";
			} else if (checked && optionValue !== correctAnswer) {
				// Selected wrong answer - red
				styles.backgroundColor = "#e8786e";
				styles.borderColor = "#e8786e";
				styles.border = "2px solid #e8786e";
			} else {
				// Other wrong answers - muted
				styles.opacity = 0.6;
				styles.border = "2px solid #e0e0e0";
			}
		} else if (checked) {
			// Selected but result not shown yet
			styles.border = "2px solid #0d6efd";
			styles.backgroundColor = "rgba(13, 110, 253, 0.1)";
		}

		return styles;
	};

	const getLabelColor = (optionValue: string, checked: boolean) => {
		if (showResult && correctAnswer) {
			if (optionValue === correctAnswer || (checked && optionValue !== correctAnswer)) {
				return "white";
			}
		}
		return checked ? "text.primary" : "text.secondary";
	};

	return (
		<Box sx={{ width: "100%" }}>
			{title && (
				<FormLabel
					sx={{
						mb: 2,
						fontWeight: "xl",
					}}
				>
					{title}
				</FormLabel>
			)}
			<RadioGroup value={value} onChange={(event) => onChange(event.target.value)} size="lg" sx={{ gap: 1.5 }}>
				{options.map((option) => {
					const checked = value === option.value;
					return (
						<Sheet key={option.value} sx={getSheetStyles(option.value, checked)}>
							<Radio
								label={
									<div>
										<div
											style={{
												fontSize: "2.5rem",
												lineHeight: "3rem",
												fontWeight: "normal",
												color: getLabelColor(option.value, checked),
											}}
										>
											{option.label}
										</div>
										{showPinyin && option.pinyin && (
											<div
												style={{
													fontSize: "1rem",
													fontStyle: "italic",
													color: showResult && correctAnswer && (option.value === correctAnswer || checked) ? "white" : "#666",
												}}
											>
												({option.pinyin.toLowerCase()})
											</div>
										)}
									</div>
								}
								overlay
								disableIcon
								value={option.value}
								disabled={disabled}
								slotProps={{
									label: () => ({
										sx: {
											fontWeight: "lg",
											fontSize: "md",
											color: getLabelColor(option.value, checked),
										},
									}),
									action: () => ({
										sx: {
											// Remove default radio border styling since we handle it on Sheet
											border: "none !important",
											"&:hover": {
												backgroundColor: "transparent",
											},
										},
									}),
								}}
							/>
						</Sheet>
					);
				})}
			</RadioGroup>
		</Box>
	);
}
