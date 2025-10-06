import Script from 'next/script'

export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "formGen",
    "description": "Build beautiful, responsive multi-step forms with our drag-and-drop builder. Custom branding, real-time analytics, and mobile optimization included.",
    "url": "https://formgene.vercel.app",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "author": {
      "@type": "Organization", 
      "name": "formGen Team"
    },
    "provider": {
      "@type": "Organization",
      "name": "formGen",
      "url": "https://formgene.vercel.app"
    },
    "featureList": [
      "Drag and drop form builder",
      "Multi-step forms",
      "Custom branding and theming", 
      "Real-time analytics",
      "Mobile optimization",
      "Form validation",
      "Public form sharing",
      "Auto-save functionality"
    ],
    "screenshot": "https://formgene.vercel.app/og-image.png",
    "softwareVersion": "1.0",
    "datePublished": "2025-01-01",
    "dateModified": new Date().toISOString().split('T')[0],
    "inLanguage": "en-US",
    "copyrightHolder": {
      "@type": "Organization",
      "name": "formGen"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "150",
      "bestRating": "5",
      "worstRating": "1"
    }
  }

  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  )
}