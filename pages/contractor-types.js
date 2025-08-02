import { useState } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { contractorTypeDetails } from '../utils/contractorTypes'

export default function ContractorTypesPage() {
  const [searchFilter, setSearchFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  // Sort contractor types by popularity (common ones first)
  const popularTypes = ['b', 'c-10', 'a', 'c-33', 'c-36', 'c-27', 'c-20', 'c-39']
  const allTypes = Object.keys(contractorTypeDetails)
  
  const sortedTypes = [
    ...popularTypes.filter(type => contractorTypeDetails[type]),
    ...allTypes.filter(type => !popularTypes.includes(type)).sort()
  ]

  // Filter types based on search and category
  const filteredTypes = sortedTypes.filter(key => {
    const typeInfo = contractorTypeDetails[key]
    const matchesSearch = !searchFilter || 
      typeInfo.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      typeInfo.description.toLowerCase().includes(searchFilter.toLowerCase()) ||
      typeInfo.keywords.toLowerCase().includes(searchFilter.toLowerCase()) ||
      key.toLowerCase().includes(searchFilter.toLowerCase())
    
    const matchesCategory = categoryFilter === 'all' || 
      (categoryFilter === 'popular' && popularTypes.includes(key)) ||
      (categoryFilter === 'general' && ['a', 'b', 'b-2'].includes(key)) ||
      (categoryFilter === 'specialty' && key.startsWith('c-')) ||
      (categoryFilter === 'limited' && key.startsWith('d-'))
    
    return matchesSearch && matchesCategory
  })

  const pageTitle = "California Contractor Types & Classifications - Complete Guide"
  const metaDescription = "Complete guide to California contractor license classifications. Find detailed information about services, project types, and requirements for all contractor types from A to D-49."

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content="California contractor types, contractor classifications, CSLB license types, contractor services, contractor guide" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://lookupcontractor.com/contractor-types" />
        <link rel="canonical" href="https://lookupcontractor.com/contractor-types" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "California Contractor Types & Classifications",
              "description": metaDescription,
              "url": "https://lookupcontractor.com/contractor-types",
              "mainEntity": {
                "@type": "ItemList",
                "name": "California Contractor Classifications",
                "numberOfItems": Object.keys(contractorTypeDetails).length,
                "itemListElement": Object.keys(contractorTypeDetails).slice(0, 10).map((key, index) => ({
                  "@type": "ListItem",
                  "position": index + 1,
                  "name": contractorTypeDetails[key].name,
                  "description": contractorTypeDetails[key].description
                }))
              }
            })
          }}
        />
      </Head>

      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        {/* Header */}
        <header style={{ padding: '2rem 0', textAlign: 'center', color: 'white' }}>
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem', margin: 0 }}>
              L<span style={{ 
                display: 'inline-block',
                fontSize: '2rem',
                filter: 'hue-rotate(200deg) saturate(1.5)',
                transform: 'scale(1.05)',
                marginLeft: '2px',
                marginRight: '2px'
              }}>👀</span>kup Contractor
            </h1>
          </Link>
          <p style={{ fontSize: '1.2rem', opacity: 0.9, margin: '0.5rem 0 0 0' }}>
            California Contractor Types & Classifications
          </p>
        </header>

        {/* Main Content */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          
          {/* Introduction */}
          <div style={{ 
            background: 'white', 
            borderRadius: '12px', 
            padding: '2rem', 
            marginBottom: '2rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#333' }}>
              🏗️ California Contractor Classifications
            </h1>
            <p style={{ fontSize: '1.1rem', color: '#666', maxWidth: '800px', margin: '0 auto 1.5rem auto', lineHeight: 1.6 }}>
              California has {Object.keys(contractorTypeDetails).length} different contractor license classifications, each specialized for specific types of construction work. Learn about services, project types, bonding requirements, and typical project costs.
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ textAlign: 'center', padding: '1rem', background: '#f0fdf4', borderRadius: '8px' }}>
                <div style={{ fontSize: '2rem', color: '#059669', fontWeight: 'bold' }}>
                  {Object.keys(contractorTypeDetails).length}
                </div>
                <div style={{ color: '#666', fontSize: '0.9rem' }}>License Types</div>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
                <div style={{ fontSize: '2rem', color: '#3b82f6', fontWeight: 'bold' }}>
                  240K+
                </div>
                <div style={{ color: '#666', fontSize: '0.9rem' }}>Active Contractors</div>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem', background: '#fef3c7', borderRadius: '8px' }}>
                <div style={{ fontSize: '2rem', color: '#d97706', fontWeight: 'bold' }}>
                  $25K+
                </div>
                <div style={{ color: '#666', fontSize: '0.9rem' }}>Minimum Bond</div>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div style={{ 
            background: 'white', 
            borderRadius: '12px', 
            padding: '1.5rem', 
            marginBottom: '2rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Search contractor types... (e.g., 'electrical', 'plumber', 'C-10')"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                style={{
                  padding: '0.75rem 1rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
              
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                style={{
                  padding: '0.75rem 1rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  background: 'white',
                  cursor: 'pointer'
                }}
              >
                <option value="all">All Types ({Object.keys(contractorTypeDetails).length})</option>
                <option value="popular">Popular Types ({popularTypes.length})</option>
                <option value="general">General Contractors</option>
                <option value="specialty">Specialty Contractors</option>
                <option value="limited">Limited Specialty</option>
              </select>
            </div>
            
            {searchFilter && (
              <div style={{ marginTop: '1rem', color: '#666', fontSize: '0.9rem' }}>
                Showing {filteredTypes.length} of {Object.keys(contractorTypeDetails).length} contractor types
              </div>
            )}
          </div>

          {/* Contractor Types Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
            gap: '1.5rem',
            marginBottom: '3rem'
          }}>
            {filteredTypes.map((key) => {
              const typeInfo = contractorTypeDetails[key]
              const isPopular = popularTypes.includes(key)
              
              return (
                <div key={key} style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '0',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s ease',
                  overflow: 'hidden',
                  border: isPopular ? '2px solid #059669' : '1px solid #e5e7eb'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.15)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'
                }}
                >
                  {/* Header */}
                  <div style={{
                    background: isPopular ? 'linear-gradient(135deg, #059669 0%, #047857 100%)' : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                    color: isPopular ? 'white' : '#334155',
                    padding: '1.5rem',
                    position: 'relative'
                  }}>
                    {isPopular && (
                      <div style={{
                        position: 'absolute',
                        top: '0.5rem',
                        right: '0.5rem',
                        background: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '12px',
                        fontSize: '0.7rem',
                        fontWeight: 'bold'
                      }}>
                        POPULAR
                      </div>
                    )}
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                      <div style={{ fontSize: '2.5rem' }}>{typeInfo.icon}</div>
                      <div>
                        <h3 style={{ 
                          fontSize: '1.3rem', 
                          fontWeight: 'bold', 
                          margin: 0,
                          marginBottom: '0.25rem'
                        }}>
                          {typeInfo.name}
                        </h3>
                        <div style={{ 
                          fontSize: '1rem', 
                          fontWeight: 'bold',
                          opacity: 0.8
                        }}>
                          ({key.toUpperCase()})
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div style={{ padding: '1.5rem' }}>
                    <p style={{ 
                      color: '#4b5563', 
                      fontSize: '0.95rem', 
                      lineHeight: 1.5,
                      marginBottom: '1.5rem'
                    }}>
                      {typeInfo.description}
                    </p>

                    {/* Project Types */}
                    <div style={{ marginBottom: '1.5rem' }}>
                      <h4 style={{ 
                        fontSize: '1rem', 
                        fontWeight: 'bold', 
                        color: '#374151',
                        marginBottom: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        🛠️ Common Projects
                      </h4>
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
                        gap: '0.5rem' 
                      }}>
                        {typeInfo.commonProjects.slice(0, 6).map((project, index) => (
                          <div key={index} style={{
                            background: '#f8fafc',
                            padding: '0.5rem 0.75rem',
                            borderRadius: '6px',
                            fontSize: '0.85rem',
                            color: '#4b5563',
                            border: '1px solid #e2e8f0'
                          }}>
                            {project}
                          </div>
                        ))}
                        {typeInfo.commonProjects.length > 6 && (
                          <div style={{
                            background: '#f3f4f6',
                            padding: '0.5rem 0.75rem',
                            borderRadius: '6px',
                            fontSize: '0.85rem',
                            color: '#6b7280',
                            border: '1px solid #d1d5db',
                            fontStyle: 'italic'
                          }}>
                            +{typeInfo.commonProjects.length - 6} more...
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Project Details */}
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: '1fr 1fr', 
                      gap: '1rem',
                      marginBottom: '1.5rem',
                      padding: '1rem',
                      background: '#f8fafc',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <div>
                        <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                          Bond Requirement
                        </div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#374151' }}>
                          {typeInfo.requiredBond}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                          Project Size Range
                        </div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#374151' }}>
                          {typeInfo.averageProjectSize}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <Link href={`/contractors/california/type/${key}`} style={{
                        flex: 1,
                        background: '#3b82f6',
                        color: 'white',
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.background = '#2563eb'}
                      onMouseLeave={(e) => e.target.style.background = '#3b82f6'}
                      >
                        Find {key.toUpperCase()} Contractors
                      </Link>
                      <Link href={`/?search=${key.toUpperCase()}%20contractors%20california`} style={{
                        background: '#059669',
                        color: 'white',
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: '80px',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.background = '#047857'}
                      onMouseLeave={(e) => e.target.style.background = '#059669'}
                      >
                        🔍
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {filteredTypes.length === 0 && (
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '3rem',
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
              <h3 style={{ fontSize: '1.5rem', color: '#374151', marginBottom: '0.5rem' }}>
                No contractor types found
              </h3>
              <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
                Try adjusting your search terms or filter settings.
              </p>
              <button
                onClick={() => {
                  setSearchFilter('')
                  setCategoryFilter('all')
                }}
                style={{
                  background: '#3b82f6',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Clear Filters
              </button>
            </div>
          )}

        </div>

        {/* Footer */}
        <footer style={{ 
          background: 'rgba(255,255,255,0.1)', 
          color: 'white', 
          textAlign: 'center', 
          padding: '2rem',
          marginTop: '3rem'
        }}>
          <p style={{ margin: 0, opacity: 0.8 }}>
            Lookup Contractor - Complete Guide to California Contractor Classifications
          </p>
        </footer>
      </div>
    </>
  )
}