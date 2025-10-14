/**
 * Meta tags component for SEO and social sharing
 */

import React, { useEffect } from "react";

import { getAbsoluteUrl, getAppUrl } from "../utils/urlUtils";

interface MetaTagsProps {
	title?: string;
	description?: string;
	image?: string;
	url?: string;
	type?: "website" | "article";
	noIndex?: boolean;
}

const MetaTags: React.FC<MetaTagsProps> = ({ title = "Cantonese Learning App", description = "Lär dig kantonesiska med interaktiva övningar och frågor", image = "/logo.png", url, type = "website", noIndex = false }) => {
	const fullTitle = title === "Cantonese Learning App" ? title : `${title} | Cantonese Learning App`;
	const fullUrl = url ? getAbsoluteUrl(url) : getAppUrl();
	const fullImageUrl = image.startsWith("http") ? image : getAbsoluteUrl(image);

	useEffect(() => {
		// Update document title
		document.title = fullTitle;

		// Helper function to set or update meta tag
		const setMetaTag = (property: string, content: string, isProperty = false) => {
			const selector = isProperty ? `meta[property="${property}"]` : `meta[name="${property}"]`;
			let meta = document.querySelector(selector) as HTMLMetaElement;

			if (!meta) {
				meta = document.createElement("meta");
				if (isProperty) {
					meta.setAttribute("property", property);
				} else {
					meta.setAttribute("name", property);
				}
				document.head.appendChild(meta);
			}

			meta.setAttribute("content", content);
		};

		// Helper function to set link tag
		const setLinkTag = (rel: string, href: string) => {
			let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;

			if (!link) {
				link = document.createElement("link");
				link.setAttribute("rel", rel);
				document.head.appendChild(link);
			}

			link.setAttribute("href", href);
		};

		// Set basic meta tags
		setMetaTag("description", description);
		if (noIndex) {
			setMetaTag("robots", "noindex, nofollow");
		}

		// Set canonical URL
		setLinkTag("canonical", fullUrl);

		// Set Open Graph meta tags
		setMetaTag("og:title", fullTitle, true);
		setMetaTag("og:description", description, true);
		setMetaTag("og:image", fullImageUrl, true);
		setMetaTag("og:url", fullUrl, true);
		setMetaTag("og:type", type, true);
		setMetaTag("og:site_name", "Cantonese Learning App", true);

		// Set Twitter Card meta tags
		setMetaTag("twitter:card", "summary_large_image");
		setMetaTag("twitter:title", fullTitle);
		setMetaTag("twitter:description", description);
		setMetaTag("twitter:image", fullImageUrl);

		// Set theme color and app meta tags
		setMetaTag("theme-color", "#292A37");
		setMetaTag("apple-mobile-web-app-capable", "yes");
		setMetaTag("apple-mobile-web-app-status-bar-style", "default");
		setMetaTag("apple-mobile-web-app-title", "Cantonese App");
	}, [fullTitle, description, fullImageUrl, fullUrl, type, noIndex]);

	return null; // This component doesn't render anything
};

export default MetaTags;
