// SEO utilities for meta tags and structured data

function generateContractorSchema(contractor) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": contractor.business_name,
    "description": `Licensed ${contractor.trade || 'contractor'} serving ${contractor.city}, California`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": contractor.mailing_address,
      "addressLocality": contractor.city,
      "addressRegion": "CA",
      "postalCode": contractor.zip_code,
      "addressCountry": "US"
    },
    "telephone": contractor.business_phone,
    "url": `https://lookupcontractor.com/contractor/${contractor.license_no}`,
    "priceRange": "$$",
    "serviceArea": {
      "@type": "City",
      "name": contractor.city,
      "addressRegion": "CA"
    },
    "license": {
      "@type": "GovernmentPermit",
      "identifier": contractor.license_no,
      "issuedBy": "California State License Board",
      "validThrough": contractor.expiration_date
    },
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "License Classification",
        "value": contractor.primary_classification
      },
      {
        "@type": "PropertyValue", 
        "name": "Trade Specialty",
        "value": contractor.trade
      },
      {
        "@type": "PropertyValue",
        "name": "License Status",
        "value": contractor.primary_status
      }
    ]
  }
}

function generateCitySchema(cityName, state, stats) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": `Licensed Contractors in ${cityName}, ${state}`,
    "description": `Find ${stats.activeContractors} active licensed contractors in ${cityName}, ${state}. View contact info, license status, and specialties.`,
    "url": `https://lookupcontractor.com/contractors/${state.toLowerCase()}/${cityName.toLowerCase().replace(/\s+/g, '-')}`,
    "mainEntity": {
      "@type": "ItemList",
      "name": `Contractors in ${cityName}, ${state}`,
      "numberOfItems": stats.totalContractors,
      "itemListElement": stats.sampleContractors?.slice(0, 5).map((contractor, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "LocalBusiness",
          "name": contractor.business_name,
          "telephone": contractor.business_phone,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": contractor.city,
            "addressRegion": "CA",
            "postalCode": contractor.zip_code
          }
        }
      })) || []
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://lookupcontractor.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": `${state} Contractors`,
          "item": `https://lookupcontractor.com/contractors/${state.toLowerCase()}`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": `${cityName} Contractors`
        }
      ]
    }
  }
}

function generateStateSchema(state, stats) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": `Licensed Contractors in ${state}`,
    "description": `Directory of ${stats.totalContractors?.toLocaleString()} licensed contractors in ${state}. Search by city, specialty, or license number.`,
    "url": `https://lookupcontractor.com/contractors/${state.toLowerCase()}`,
    "mainEntity": {
      "@type": "ItemList",
      "name": `${state} Licensed Contractors`,
      "numberOfItems": stats.totalContractors
    },
    "about": {
      "@type": "Place",
      "name": state,
      "@id": `https://en.wikipedia.org/wiki/${state}`
    }
  }
}

function generateSearchSchema(searchTerm, results) {
  return {
    "@context": "https://schema.org",
    "@type": "SearchResultsPage",
    "name": `Search Results for "${searchTerm}"`,
    "description": `Found ${results.pagination?.total || 0} contractors matching "${searchTerm}"`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": results.pagination?.total || 0,
      "itemListElement": results.contractors?.slice(0, 10).map((contractor, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "LocalBusiness",
          "name": contractor.business_name,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": contractor.city,
            "addressRegion": "CA"
          }
        }
      })) || []
    }
  }
}

function generateFAQSchema(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }
}

function generateMetaTags({
  title,
  description,
  url,
  type = 'website',
  image = null,
  keywords = '',
  noindex = false
}) {
  const tags = [
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: type },
    { property: 'og:url', content: url },
    { property: 'og:site_name', content: 'Lookup Contractor' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
  ]

  if (image) {
    tags.push(
      { property: 'og:image', content: image },
      { name: 'twitter:image', content: image }
    )
  }

  if (keywords) {
    tags.push({ name: 'keywords', content: keywords })
  }

  if (noindex) {
    tags.push({ name: 'robots', content: 'noindex, nofollow' })
  } else {
    tags.push({ name: 'robots', content: 'index, follow' })
  }

  return tags
}

function truncateDescription(text, maxLength = 160) {
  if (!text || text.length <= maxLength) return text
  
  const truncated = text.substring(0, maxLength)
  const lastSpace = truncated.lastIndexOf(' ')
  
  return lastSpace > 0 
    ? truncated.substring(0, lastSpace) + '...'
    : truncated + '...'
}

export {
  generateContractorSchema,
  generateCitySchema,
  generateStateSchema,
  generateSearchSchema,
  generateFAQSchema,
  generateMetaTags,
  truncateDescription
}