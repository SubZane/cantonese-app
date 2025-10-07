#!/usr/bin/env ts-node
/*
  Scans all vocab JSON files under src/data and ensures mainland_cantonese fields contain only Simplified Chinese
  (per our project policy) and no explicitly Traditional-only characters that we intentionally avoid in Mainland forms.

  It also prints a per-file summary and counts HK variants.
*/
import { readdirSync, readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

interface Entry {
	mainland_cantonese: string;
	hongkong_cantonese: string;
	has_hk_variant?: boolean;
}

// Support both CJS and ESM execution contexts
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const __file = typeof __dirname === "undefined" ? fileURLToPath(import.meta.url) : __filename;
const __dir = typeof __dirname === "undefined" ? dirname(__file) : __dirname;
const dataDir = join(__dir, "..", "src", "data");

// A (non-exhaustive) set of Traditional characters we expect NOT to appear in mainland_cantonese.
// This focuses on the characters we actually introduced for HK variants.
const traditionalDisallow = new Set([
	"嚟",
	"喺",
	"呢",
	"嗰",
	"裏",
	"裡",
	"邊",
	"邊",
	"尋",
	"聽",
	"晝",
	"黃",
	"鐘",
	"分鐘",
	"涼",
	"瞓",
	"囊",
	"銀",
	"返",
	"單",
	"車",
	"踩",
	"揸",
	"阵",
	"陣",
	"光",
]);

// Some of these (單, 車, 踩, 揸, etc.) are not strictly Traditional but appear only in HK variant usage for our lists.
// We'll just treat them as warning triggers if they show up in mainland_cantonese.

const files = readdirSync(dataDir).filter((f) => f.endsWith(".json"));
let hadError = false;

for (const file of files) {
	const full = join(dataDir, file);
	const raw = readFileSync(full, "utf8");
	let json: any;
	try {
		json = JSON.parse(raw);
	} catch (e) {
		console.error(`ERROR: Cannot parse ${file}:`, e);
		hadError = true;
		continue;
	}
	if (!Array.isArray(json)) continue;
	let traditionalHits = 0;
	let hkVariants = 0;
	for (const e of json as Entry[]) {
		if (!e || typeof e.mainland_cantonese !== "string") continue;
		// Count HK variants
		if (e.has_hk_variant || (e.hongkong_cantonese && e.hongkong_cantonese !== e.mainland_cantonese)) hkVariants++;
		for (const ch of e.mainland_cantonese) {
			if (traditionalDisallow.has(ch)) {
				traditionalHits++;
			}
		}
	}
	if (traditionalHits > 0) {
		hadError = true;
		console.error(`FAIL ${file}: mainland_cantonese contains ${traditionalHits} disallowed Traditional / HK-only characters.`);
	} else {
		console.log(`OK   ${file}: no disallowed chars; HK variants: ${hkVariants}`);
	}
}

if (hadError) {
	console.error("\nValidation failed.");
	process.exit(1);
} else {
	console.log("\nAll mainland_cantonese fields passed validation.");
}
