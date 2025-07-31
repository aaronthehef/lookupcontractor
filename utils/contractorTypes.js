export const contractorTypeDetails = {
  'a': {
    name: 'General Engineering Contractor',
    description: 'General Engineering Contractors handle major infrastructure projects including highways, bridges, dams, water systems, and other large-scale engineering works. They are qualified to perform any engineering construction project.',
    icon: '🌉',
    commonProjects: [
      'Highway and road construction',
      'Bridge construction and repair',
      'Water treatment facilities',
      'Sewer systems and pipelines',
      'Dam construction',
      'Airport runway construction',
      'Large excavation projects',
      'Utility infrastructure'
    ],
    requiredBond: 'Yes, varies by project size',
    averageProjectSize: '$500K - $50M+',
    keywords: 'engineering contractor, infrastructure, highways, bridges, water systems'
  },
  'b': {
    name: 'General Building Contractor',
    description: 'General Building Contractors are the most common type of contractor, qualified to build residential and commercial structures. They typically serve as the primary contractor coordinating all aspects of building construction.',
    icon: '🏗️',
    commonProjects: [
      'Single and multi-family homes',
      'Commercial buildings',
      'Office complexes',
      'Retail structures',
      'Warehouses',
      'Schools and hospitals',
      'Apartment complexes',
      'Mixed-use developments'
    ],
    requiredBond: 'Yes, minimum $25,000',
    averageProjectSize: '$50K - $10M+',
    keywords: 'building contractor, construction, residential, commercial, general contractor'
  },
  'c-10': {
    name: 'Electrical Contractor',
    description: 'Electrical Contractors install, maintain, and repair electrical systems in residential, commercial, and industrial settings. They ensure all electrical work meets safety codes and regulations.',
    icon: '⚡',
    commonProjects: [
      'Home electrical rewiring',
      'Commercial electrical systems',
      'Panel upgrades and installations',
      'Lighting installation',
      'Electrical troubleshooting',
      'Solar panel electrical connections',
      'Electric vehicle charging stations',
      'Smart home automation systems'
    ],
    requiredBond: 'Yes, minimum $25,000',
    averageProjectSize: '$500 - $100K+',
    keywords: 'electrician, electrical contractor, wiring, panels, lighting, electrical repair'
  },
  'c-36': {
    name: 'Plumbing Contractor',
    description: 'Plumbing Contractors install, repair, and maintain water supply systems, drainage systems, and related fixtures in residential, commercial, and industrial buildings.',
    icon: '🔧',
    commonProjects: [
      'Pipe installation and repair',
      'Water heater installation',
      'Drain cleaning and repair',
      'Bathroom and kitchen plumbing',
      'Sewer line repair',
      'Leak detection and repair',
      'Plumbing fixture installation',
      'Gas line installation'
    ],
    requiredBond: 'Yes, minimum $25,000',
    averageProjectSize: '$200 - $50K+',
    keywords: 'plumber, plumbing contractor, pipes, water heater, drain cleaning, leak repair'
  },
  'c-39': {
    name: 'Roofing Contractor',
    description: 'Roofing Contractors specialize in the installation, repair, and maintenance of roofing systems for residential, commercial, and industrial buildings.',
    icon: '🏠',
    commonProjects: [
      'Roof replacement and installation',
      'Roof repair and maintenance',
      'Gutter installation and repair',
      'Skylight installation',
      'Waterproofing and sealing',
      'Solar panel roof preparation',
      'Emergency roof repairs',
      'Roof inspections'
    ],
    requiredBond: 'Yes, minimum $25,000',
    averageProjectSize: '$3K - $100K+',
    keywords: 'roofer, roofing contractor, roof repair, roof replacement, gutters, roof leak'
  },
  'c-20': {
    name: 'HVAC Contractor',
    description: 'HVAC (Heating, Ventilation, and Air Conditioning) Contractors install, maintain, and repair climate control systems for residential and commercial properties.',
    icon: '❄️',
    commonProjects: [
      'Air conditioning installation',
      'Heating system installation',
      'HVAC system maintenance',
      'Ductwork installation and repair',
      'Thermostat installation',
      'Air quality improvement systems',
      'Energy-efficient system upgrades',
      'Commercial HVAC systems'
    ],
    requiredBond: 'Yes, minimum $25,000',
    averageProjectSize: '$1K - $75K+',
    keywords: 'HVAC contractor, air conditioning, heating, ventilation, AC repair, furnace'
  },
  'c-33': {
    name: 'Painting and Decorating Contractor',
    description: 'Painting and Decorating Contractors provide interior and exterior painting services, surface preparation, and decorative finishes for residential and commercial properties.',
    icon: '🎨',
    commonProjects: [
      'Interior and exterior painting',
      'Surface preparation and priming',
      'Decorative finishes',
      'Wallpaper installation',
      'Staining and sealing',
      'Commercial painting projects',
      'Specialty coatings',
      'Color consultation'
    ],
    requiredBond: 'Yes, minimum $25,000',
    averageProjectSize: '$500 - $25K+',
    keywords: 'painter, painting contractor, interior painting, exterior painting, house painting'
  },
  'c-27': {
    name: 'Landscaping Contractor',
    description: 'Landscaping Contractors design, install, and maintain outdoor spaces including gardens, lawns, irrigation systems, and hardscape features.',
    icon: '🌿',
    commonProjects: [
      'Landscape design and installation',
      'Irrigation system installation',
      'Lawn installation and maintenance',
      'Tree and shrub planting',
      'Hardscape installation (patios, walkways)',
      'Garden maintenance',
      'Outdoor lighting',
      'Sprinkler system repair'
    ],
    requiredBond: 'Yes, minimum $25,000',
    averageProjectSize: '$1K - $100K+',
    keywords: 'landscaper, landscaping contractor, irrigation, lawn care, garden design, hardscape'
  }
}

export function getContractorTypeInfo(classification) {
  const key = classification.toLowerCase()
  return contractorTypeDetails[key] || {
    name: classification,
    description: `Licensed ${classification} contractors providing specialized construction and contracting services.`,
    icon: '🔧',
    commonProjects: ['Specialized contracting services'],
    requiredBond: 'Varies by classification',
    averageProjectSize: 'Varies',
    keywords: `${classification} contractor, licensed contractor`
  }
}