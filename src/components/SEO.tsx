import { useEffect } from 'react';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalPath?: string;
  ogImage?: string;
  ogType?: string;
  schema?: object | object[];
}

export function SEO({
  title = "Quorik - Custom Web Engineering & Website AI Voice Agents",
  description = "Quorik engineers high-converting custom websites, 24/7 in-browser website AI voice agents, and smart workflow automation to convert visitors and scale operations.",
  keywords = "website AI voice agent, custom web development, on-site voice AI, web engineering agency, AI chatbots, conversion rate optimization, Quorik",
  canonicalPath = "",
  ogImage = "/og-image.svg",
  ogType = "website",
  schema,
}: SEOProps) {
  useEffect(() => {
    // 1. Update Title
    const fullTitle = title.includes("Quorik") ? title : `${title} | Quorik AI & Web Engineering`;
    document.title = fullTitle;

    // 2. Helper to set/create meta element
    const setMeta = (nameAttr: 'name' | 'property', attrValue: string, content: string) => {
      let element = document.querySelector(`meta[${nameAttr}="${attrValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(nameAttr, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Standard meta tags
    setMeta('name', 'description', description);
    setMeta('name', 'keywords', keywords);
    setMeta('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    setMeta('name', 'googlebot', 'index, follow, max-snippet:-1, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

    // OpenGraph
    const baseUrl = window.location.origin;
    const fullUrl = `${baseUrl}${canonicalPath}`;
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', fullUrl);
    setMeta('property', 'og:image', ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`);
    setMeta('property', 'og:type', ogType);
    setMeta('property', 'og:site_name', 'Quorik');

    // Twitter
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', ogImage);

    // 3. Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', fullUrl);

    // 4. Dynamic JSON-LD Schema Injection
    let scriptTag = document.getElementById('dynamic-jsonld-schema');
    if (schema) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = 'dynamic-jsonld-schema';
        scriptTag.setAttribute('type', 'application/ld+json');
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(schema);
    } else if (scriptTag) {
      scriptTag.remove();
    }
  }, [title, description, keywords, canonicalPath, ogImage, ogType, schema]);

  return null;
}
