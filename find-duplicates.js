const fs = require("fs");
const path = require("path");

// Load all JSON data files
const animalsData = require("./src/data/animals.json");
const foodData = require("./src/data/food.json");
const familyData = require("./src/data/family.json");
const actionsData = require("./src/data/actions.json");
const itemsData = require("./src/data/items.json");
const funPlayData = require("./src/data/fun-play.json");
const timeData = require("./src/data/time.json");
const movementDirectionsData = require("./src/data/movement-directions.json");

// Combine all data with source information
const allData = [
	...animalsData.map((item) => ({ ...item, source: "animals" })),
	...foodData.map((item) => ({ ...item, source: "food" })),
	...familyData.map((item) => ({ ...item, source: "family" })),
	...actionsData.map((item) => ({ ...item, source: "actions" })),
	...itemsData.map((item) => ({ ...item, source: "items" })),
	...funPlayData.map((item) => ({ ...item, source: "fun-play" })),
	...timeData.map((item) => ({ ...item, source: "time" })),
	...movementDirectionsData.map((item) => ({ ...item, source: "movement-directions" })),
];

console.log("=== DUPLICATE DETECTION REPORT ===\n");
console.log(`Total vocabulary entries: ${allData.length}\n`);

// Check for duplicate Swedish words
const swedishWords = new Map();
const swedishDuplicates = [];

allData.forEach((item, index) => {
	if (swedishWords.has(item.swedish)) {
		swedishDuplicates.push({
			word: item.swedish,
			first: swedishWords.get(item.swedish),
			duplicate: { ...item, index },
		});
	} else {
		swedishWords.set(item.swedish, { ...item, index });
	}
});

console.log("🔍 SWEDISH WORD DUPLICATES:");
if (swedishDuplicates.length === 0) {
	console.log("✅ No duplicate Swedish words found!\n");
} else {
	console.log(`❌ Found ${swedishDuplicates.length} duplicate Swedish words:\n`);
	swedishDuplicates.forEach((dup) => {
		console.log(`"${dup.word}"`);
		console.log(`  First:     ${dup.first.source} → ${dup.first.characters} (${dup.first.pinyin})`);
		console.log(`  Duplicate: ${dup.duplicate.source} → ${dup.duplicate.characters} (${dup.duplicate.pinyin})`);
		console.log("");
	});
}

// Check for duplicate Chinese characters
const chineseChars = new Map();
const charDuplicates = [];

allData.forEach((item, index) => {
	if (chineseChars.has(item.characters)) {
		charDuplicates.push({
			characters: item.characters,
			first: chineseChars.get(item.characters),
			duplicate: { ...item, index },
		});
	} else {
		chineseChars.set(item.characters, { ...item, index });
	}
});

console.log("🔍 CHINESE CHARACTER DUPLICATES:");
if (charDuplicates.length === 0) {
	console.log("✅ No duplicate Chinese characters found!\n");
} else {
	console.log(`❌ Found ${charDuplicates.length} duplicate Chinese characters:\n`);
	charDuplicates.forEach((dup) => {
		console.log(`"${dup.characters}"`);
		console.log(`  First:     ${dup.first.source} → ${dup.first.swedish} (${dup.first.pinyin})`);
		console.log(`  Duplicate: ${dup.duplicate.source} → ${dup.duplicate.swedish} (${dup.duplicate.pinyin})`);
		console.log("");
	});
}

// Summary
console.log("=== SUMMARY ===");
console.log(`Total entries: ${allData.length}`);
console.log(`Unique Swedish words: ${swedishWords.size}`);
console.log(`Unique Chinese characters: ${chineseChars.size}`);
console.log(`Swedish duplicates: ${swedishDuplicates.length}`);
console.log(`Chinese duplicates: ${charDuplicates.length}`);

if (swedishDuplicates.length > 0 || charDuplicates.length > 0) {
	console.log("\n❌ Duplicates found! This explains why you're seeing repeat questions in quizzes.");
	console.log("The quiz fix should now prevent duplicates within a single quiz session.");
} else {
	console.log("\n✅ No duplicates found in the data files.");
}
