import React, { createContext, useContext, useEffect, useState } from "react";

interface CantoneseVariantContextValue {
	useHongKong: boolean;
	toggleHongKong: () => void;
	setUseHongKong: (v: boolean) => void;
}

const CantoneseVariantContext = createContext<CantoneseVariantContextValue | undefined>(undefined);

const STORAGE_KEY = "cantonese-quiz-useHK";

export const CantoneseVariantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [useHongKong, setUseHongKong] = useState<boolean>(() => {
		try {
			const saved = localStorage.getItem(STORAGE_KEY);
			return saved ? JSON.parse(saved) : false;
		} catch {
			return false;
		}
	});

	useEffect(() => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(useHongKong));
		} catch {}
	}, [useHongKong]);

	const toggleHongKong = () => setUseHongKong((v) => !v);

	return <CantoneseVariantContext.Provider value={{ useHongKong, toggleHongKong, setUseHongKong }}>{children}</CantoneseVariantContext.Provider>;
};

export function useCantoneseVariant() {
	const ctx = useContext(CantoneseVariantContext);
	if (!ctx) throw new Error("useCantoneseVariant must be used within CantoneseVariantProvider");
	return ctx;
}

// Helper to pick display string given an entry-like object.
export function getDisplayCantonese<T extends { mainland_cantonese: string; hongkong_cantonese: string; has_hk_variant?: boolean }>(entry: T, useHK: boolean) {
	if (!useHK) return entry.mainland_cantonese;
	if (entry.has_hk_variant && entry.hongkong_cantonese) return entry.hongkong_cantonese;
	return entry.mainland_cantonese; // strict: only switch when flag present
}

export function isHongKongVariantDisplay<T extends { mainland_cantonese: string; hongkong_cantonese: string; has_hk_variant?: boolean }>(entry: T, useHK: boolean) {
	return !!(useHK && entry.has_hk_variant && entry.hongkong_cantonese && entry.hongkong_cantonese !== entry.mainland_cantonese);
}
