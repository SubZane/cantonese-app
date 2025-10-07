export interface VocabEntry {
	swedish: string;
	mainland_cantonese: string; // Simplified (Mainland-standard) form
	hongkong_cantonese: string; // Hybrid HK variant (may include Traditional/Cantonese-only chars)
	jyutping: string; // Mainland / generic Jyutping romanization
	hongkong_jyutping?: string; // Optional HK-specific Jyutping if it differs
	difficulty: number; // 1 (basic) - 3 (advanced)
	has_hk_variant?: boolean; // Present only when hongkong_cantonese differs from mainland_cantonese
}

export type VocabList = VocabEntry[];

export function hasHongKongVariant(entry: VocabEntry): boolean {
	if (entry.has_hk_variant) return true;
	return entry.mainland_cantonese !== entry.hongkong_cantonese;
}
