import React, { useMemo, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Chip, FormControl, FormLabel, Input, Sheet, Stack, Table, Typography } from "@mui/joy";

import { getDisplayCantonese, useCantoneseVariant } from "../context/CantoneseVariantContext";
// Import all vocabulary data
import actionsData from "../data/actions.json";
import animalsData from "../data/animals.json";
import familyData from "../data/family.json";
import foodData from "../data/food.json";
import funPlayData from "../data/fun-play.json";
import itemsData from "../data/items.json";
import movementDirectionsData from "../data/movement-directions.json";
import timeData from "../data/time.json";
import { useT } from "../translations";
import IconsRadio from "./form/IconsRadio";

interface VocabularyItem {
	swedish: string;
	mainland_cantonese: string;
	hongkong_cantonese: string;
	jyutping: string;
	difficulty: number;
	has_hk_variant?: boolean;
	category?: string; // We'll add this for display
}

interface VocabularyListProps {
	showJyutping?: boolean;
}

const VocabularyList: React.FC<VocabularyListProps> = ({ showJyutping = false }) => {
	const { useHongKong } = useCantoneseVariant();
	const { t } = useT();
	const [selectedCategory, setSelectedCategory] = useState<string>("all");
	const [searchTerm, setSearchTerm] = useState<string>("");

	// Category options with icons
	const categoryOptions = [
		{ value: "all", label: t.filters.category.all, icon: "globe" },
		{ value: "animals", label: t.filters.category.animals, icon: "dog" },
		{ value: "food", label: t.filters.category.food, icon: "utensils" },
		{ value: "family", label: t.filters.category.family, icon: "users" },
		{ value: "actions", label: t.filters.category.actions, icon: "running" },
		{ value: "items", label: t.filters.category.items, icon: "cube" },
		{ value: "fun-play", label: t.filters.category.funPlay, icon: "gamepad" },
		{ value: "time", label: t.filters.category.time, icon: "clock" },
		{ value: "movement-directions", label: t.filters.category.movementDirections, icon: "compass" },
	];

	// Combine all vocabulary data with category labels
	const allVocabulary = useMemo(() => {
		const addCategory = (items: any[], category: string) => items.map((item) => ({ ...item, category }));

		return [
			...addCategory(animalsData, "animals"),
			...addCategory(foodData, "food"),
			...addCategory(familyData, "family"),
			...addCategory(actionsData, "actions"),
			...addCategory(itemsData, "items"),
			...addCategory(funPlayData, "fun-play"),
			...addCategory(timeData, "time"),
			...addCategory(movementDirectionsData, "movement-directions"),
		] as VocabularyItem[];
	}, []);

	// Filter vocabulary based on category and search term
	const filteredVocabulary = useMemo(() => {
		let filtered = allVocabulary;

		// Filter by category
		if (selectedCategory !== "all") {
			filtered = filtered.filter((item) => item.category === selectedCategory);
		}

		// Filter by search term
		if (searchTerm) {
			const searchLower = searchTerm.toLowerCase();
			filtered = filtered.filter(
				(item) => item.swedish.toLowerCase().includes(searchLower) || item.mainland_cantonese.includes(searchTerm) || item.hongkong_cantonese.includes(searchTerm) || item.jyutping.toLowerCase().includes(searchLower)
			);
		}

		// Sort by Swedish alphabetically
		return filtered.sort((a, b) => a.swedish.localeCompare(b.swedish, "sv"));
	}, [allVocabulary, selectedCategory, searchTerm]);

	const getDifficultyColor = (difficulty: number) => {
		switch (difficulty) {
			case 1:
				return "success";
			case 2:
				return "warning";
			case 3:
				return "danger";
			default:
				return "neutral";
		}
	};

	const getDifficultyLabel = (difficulty: number) => {
		switch (difficulty) {
			case 1:
				return t.filters.difficulty.easy;
			case 2:
				return t.filters.difficulty.medium;
			case 3:
				return t.filters.difficulty.hard;
			default:
				return "Unknown";
		}
	};

	return (
		<Box sx={{ p: 3 }}>
			<Typography level="h1" sx={{ mb: 3 }}>
				{t.vocabulary.title}
			</Typography>

			{/* Category Filter */}
			<Box sx={{ mb: 3 }}>
				<FormControl>
					<FormLabel>{t.vocabulary.filterByCategory}</FormLabel>
					<IconsRadio value={selectedCategory} onChange={setSelectedCategory} options={categoryOptions} />
				</FormControl>
			</Box>

			{/* Search Filter */}
			<Box sx={{ mb: 3 }}>
				<FormControl>
					<FormLabel>{t.vocabulary.searchPlaceholder}</FormLabel>
					<Input placeholder={t.vocabulary.searchDescription} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} startDecorator={<FontAwesomeIcon icon="search" />} sx={{ maxWidth: 400 }} />
				</FormControl>
			</Box>

			{/* Results Count */}
			<Typography level="body-sm" sx={{ mb: 2, color: "text.secondary" }}>
				{t.vocabulary.showingResults.replace("{count}", filteredVocabulary.length.toString())}
			</Typography>

			{/* Vocabulary Table */}
			<Sheet variant="outlined" sx={{ borderRadius: "sm", overflow: "auto" }}>
				<Table
					hoverRow
					size="md"
					sx={{
						"--TableCell-headBackground": "var(--joy-palette-background-level1)",
						"--Table-headerUnderlineThickness": "1px",
						"--TableRow-hoverBackground": "var(--joy-palette-background-level1)",
					}}
				>
					<thead>
						<tr>
							<th style={{ width: "20%" }}>{t.vocabulary.swedish}</th>
							<th style={{ width: "25%" }}>{t.vocabulary.cantonese}</th>
							{showJyutping && <th style={{ width: "20%" }}>{t.vocabulary.pronunciation}</th>}
							<th style={{ width: "15%" }}>{t.vocabulary.difficulty}</th>
							<th style={{ width: "20%" }}>{t.vocabulary.category}</th>
						</tr>
					</thead>
					<tbody>
						{filteredVocabulary.map((item, index) => (
							<tr key={`${item.category}-${index}`}>
								<td>
									<Typography level="body-md" fontWeight="md">
										{item.swedish}
									</Typography>
								</td>
								<td>
									<Stack direction="row" spacing={1} alignItems="center">
										<Typography level="body-md">{getDisplayCantonese(item, useHongKong)}</Typography>
										{item.has_hk_variant && (
											<Chip size="sm" variant="soft" color="primary" startDecorator={<FontAwesomeIcon icon="flag" />}>
												HK
											</Chip>
										)}
									</Stack>
								</td>
								{showJyutping && (
									<td>
										<Typography level="body-sm" fontFamily="monospace" sx={{ color: "text.secondary" }}>
											{item.jyutping}
										</Typography>
									</td>
								)}
								<td>
									<Chip size="sm" variant="soft" color={getDifficultyColor(item.difficulty)}>
										{getDifficultyLabel(item.difficulty)}
									</Chip>
								</td>
								<td>
									<Typography level="body-sm" sx={{ color: "text.secondary" }}>
										{categoryOptions.find((cat) => cat.value === item.category)?.label || item.category}
									</Typography>
								</td>
							</tr>
						))}
					</tbody>
				</Table>
			</Sheet>

			{filteredVocabulary.length === 0 && (
				<Box sx={{ textAlign: "center", py: 4 }}>
					<Typography level="body-lg" sx={{ color: "text.secondary" }}>
						{t.vocabulary.noResults}
					</Typography>
				</Box>
			)}
		</Box>
	);
};

export default VocabularyList;
