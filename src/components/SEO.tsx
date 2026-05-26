import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  schema?: Record<string, any> | Record<string, any>[];
}

const SITE_URL = "https://matfurniture.in";
const DEFAULT_TITLE = "M.A.T. Furniture Showroom — Premium Furniture in Chidambaram & Kattumannarkoil";
const DEFAULT_DESC = "M.A.T.Furniture — Best furniture shop in Chidambaram & Kattumannarkoil, Tamil Nadu. Shop wooden cots, sofas, wardrobes, dining tables, dressing tables, TV units, office furniture & more. Premium quality at affordable prices.";
const DEFAULT_KEYWORDS = "furniture shop Chidambaram, furniture store Kattumannarkoil, wooden cot Chidambaram, sofa Chidambaram, wardrobe Kattumannarkoil, dining table Tamil Nadu, M.A.T Furniture, MAT Furniture, furniture showroom Chidambaram, best furniture Kattumannarkoil, dressing table, TV unit, office furniture, pooja unit, shoe rack, affordable furniture Tamil Nadu";

export function SEO({ title, description, keywords, image, url, schema }: SEOProps) {
  const currentTitle = title ? `${title} — M.A.T. Furniture` : DEFAULT_TITLE;
  const currentDesc = description || DEFAULT_DESC;
  const currentKeywords = keywords || DEFAULT_KEYWORDS;
  const currentUrl = url ? `${SITE_URL}${url}` : window.location.origin + window.location.pathname;
  const currentImage = image || `${SITE_URL}/og-image.jpg`;

  useEffect(() => {
    // 1. Update Title
    document.title = currentTitle;

    // Helper function to update or create meta tags
    const updateMetaTag = (attr: string, value: string, content: string) => {
      let element = document.querySelector(`meta[${attr}="${value}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attr, value);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // 2. Update Meta Tags
    updateMetaTag("name", "description", currentDesc);
    updateMetaTag("name", "keywords", currentKeywords);
    
    // Open Graph
    updateMetaTag("property", "og:title", currentTitle);
    updateMetaTag("property", "og:description", currentDesc);
    updateMetaTag("property", "og:url", currentUrl);
    updateMetaTag("property", "og:image", currentImage);
    updateMetaTag("property", "og:type", "website");

    // Twitter
    updateMetaTag("name", "twitter:title", currentTitle);
    updateMetaTag("name", "twitter:description", currentDesc);
    updateMetaTag("name", "twitter:image", currentImage);
    updateMetaTag("name", "twitter:card", "summary_large_image");

    // 3. Update Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", currentUrl);

    // 4. Update JSON-LD Script tag
    const scriptId = "seo-jsonld";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (schema) {
      if (!script) {
        script = document.createElement("script");
        script.id = scriptId;
        script.type = "application/ld+json";
        document.head.appendChild(script);
      }
      script.text = JSON.stringify(schema);
    } else {
      if (script) {
        script.remove();
      }
    }
  }, [currentTitle, currentDesc, currentKeywords, currentUrl, currentImage, schema]);

  return null;
}
