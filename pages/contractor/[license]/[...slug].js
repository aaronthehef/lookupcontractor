// This file handles SEO-friendly URLs like /contractor/1234567/business-name-slug
// It redirects to the main contractor page with the license number

import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function ContractorWithSlug() {
  const router = useRouter()
  const { license } = router.query

  useEffect(() => {
    if (license) {
      // Redirect to the main contractor page
      router.replace(`/contractor/${license}`)
    }
  }, [license, router])

  return null // This component just handles redirects
}

// This is a client-side redirect component
// The main contractor page will handle the actual SEO optimization