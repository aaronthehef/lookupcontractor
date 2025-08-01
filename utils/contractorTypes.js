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
  },
  'c-35': {
    name: 'Lathing and Plastering Contractor',
    description: 'Lathing and Plastering Contractors specialize in installing lath systems and applying plaster to walls and ceilings. They work with traditional plaster, stucco, and modern gypsum-based systems.',
    icon: '🏠',
    commonProjects: [
      'Interior wall plastering',
      'Exterior stucco application',
      'Lath installation',
      'Plaster repair and restoration',
      'Decorative plaster work',
      'EIFS (synthetic stucco) systems',
      'Fire-resistant plaster systems',
      'Historic building restoration'
    ],
    requiredBond: 'Yes, minimum $25,000',
    averageProjectSize: '$5K - $200K',
    keywords: 'plaster contractor, stucco contractor, lathing, wall finishing, EIFS'
  },
  'c-51': {
    name: 'Structural Steel Contractor', 
    description: 'Structural Steel Contractors specialize in the fabrication, erection, and installation of structural steel frameworks for buildings, bridges, and other structures.',
    icon: '🏗️',
    commonProjects: [
      'Steel building frameworks',
      'Bridge steel structures',
      'Industrial steel fabrication',
      'Steel beam installation',
      'High-rise construction steel',
      'Warehouse steel structures',
      'Steel stairways and railings',
      'Miscellaneous metal work'
    ],
    requiredBond: 'Yes, minimum $25,000',
    averageProjectSize: '$50K - $5M+',
    keywords: 'steel contractor, structural steel, steel fabrication, steel erection, metal work'
  },
  // Complete California contractor classification mappings
  'b-2': {
    name: 'Residential Remodeling Contractor',
    description: 'Residential Remodeling Contractors specialize in making improvements to existing residential wood-frame structures.',
    icon: '🏠',
    commonProjects: ['Home renovations', 'Kitchen remodeling', 'Bathroom remodeling', 'Room additions'],
    requiredBond: 'Yes, minimum $25,000',
    averageProjectSize: '$5K - $500K',
    keywords: 'residential remodeling, home renovation, kitchen remodel, bathroom remodel'
  },
  'c-2': {
    name: 'Insulation and Acoustical Contractor',
    description: 'Insulation and Acoustical Contractors install insulation materials and sound control systems.',
    icon: '🔇',
    commonProjects: ['Wall insulation', 'Attic insulation', 'Sound proofing', 'Acoustic panels'],
    requiredBond: 'Yes, minimum $25,000',
    averageProjectSize: '$2K - $100K',
    keywords: 'insulation contractor, acoustical, soundproofing, thermal insulation'
  },
  'c-4': {
    name: 'Boiler, Hot Water Heating and Steam Fitting Contractor',
    description: 'Boiler and Steam Fitting Contractors install and maintain heating systems, boilers, and related equipment.',
    icon: '🔥',
    commonProjects: ['Boiler installation', 'Steam systems', 'Hot water heating', 'Radiant heating'],
    requiredBond: 'Yes, minimum $25,000',
    averageProjectSize: '$5K - $200K',
    keywords: 'boiler contractor, steam fitting, hot water heating, radiant heating'
  },
  'c-5': {
    name: 'Framing and Rough Carpentry Contractor',
    description: 'Framing and Rough Carpentry Contractors build the structural framework of buildings.',
    icon: '🔨',
    commonProjects: ['House framing', 'Structural framing', 'Rough carpentry', 'Wood frame construction'],
    requiredBond: 'Yes, minimum $25,000',
    averageProjectSize: '$10K - $500K',
    keywords: 'framing contractor, rough carpentry, structural framing, wood frame'
  },
  'c-6': {
    name: 'Cabinet, Millwork and Finish Carpentry Contractor',
    description: 'Cabinet and Finish Carpentry Contractors create custom cabinets, millwork, and detailed woodwork.',
    icon: '🪚',
    commonProjects: ['Custom cabinets', 'Built-in furniture', 'Crown molding', 'Finish carpentry'],
    requiredBond: 'Yes, minimum $25,000',
    averageProjectSize: '$3K - $150K',
    keywords: 'cabinet contractor, finish carpentry, millwork, custom cabinets'
  },
  'c-7': {
    name: 'Low Voltage Systems Contractor',
    description: 'Low Voltage Systems Contractors install and maintain communication, security, and control systems.',
    icon: '📡',
    commonProjects: ['Security systems', 'Fire alarms', 'Data networks', 'Audio/video systems'],
    requiredBond: 'Yes, minimum $25,000',
    averageProjectSize: '$2K - $100K',
    keywords: 'low voltage contractor, security systems, fire alarm, data networks'
  },
  'c-8': {
    name: 'Concrete Contractor',
    description: 'Concrete Contractors pour, place, and finish concrete for various construction projects.',
    icon: '🏗️',
    commonProjects: ['Concrete foundations', 'Driveways', 'Sidewalks', 'Concrete slabs'],
    requiredBond: 'Yes, minimum $25,000',
    averageProjectSize: '$5K - $1M+',
    keywords: 'concrete contractor, concrete pour, foundations, driveways, sidewalks'
  },
  'c-9': {
    name: 'Drywall Contractor',
    description: 'Drywall Contractors install, tape, and finish drywall and related wall systems.',
    icon: '🧱',
    commonProjects: ['Drywall installation', 'Wall finishing', 'Taping and mudding', 'Texture application'],
    requiredBond: 'Yes, minimum $25,000',
    averageProjectSize: '$3K - $200K',
    keywords: 'drywall contractor, wall finishing, taping, texture, sheetrock'
  },
  'c-11': {
    name: 'Elevator Contractor',
    description: 'Elevator Contractors install, maintain, and repair elevators, escalators, and related equipment.',
    icon: '🛗',
    commonProjects: ['Elevator installation', 'Elevator maintenance', 'Escalator repair', 'Lift systems'],
    requiredBond: 'Yes, minimum $25,000',
    averageProjectSize: '$50K - $1M+',
    keywords: 'elevator contractor, escalator, lift systems, vertical transportation'
  },
  'c-12': {
    name: 'Earthwork and Paving Contractor',
    description: 'Earthwork and Paving Contractors perform excavation, grading, and paving work.',
    icon: '🚧',
    commonProjects: ['Excavation', 'Grading', 'Asphalt paving', 'Site preparation'],
    requiredBond: 'Yes, minimum $25,000',
    averageProjectSize: '$10K - $2M+',
    keywords: 'earthwork contractor, paving, excavation, grading, asphalt'
  },
  'c-13': {
    name: 'Fencing Contractor',
    description: 'Fencing Contractors install and repair fences, gates, and related security barriers.',
    icon: '🚧',
    commonProjects: ['Fence installation', 'Gate installation', 'Security fencing', 'Decorative fencing'],
    requiredBond: 'Yes, minimum $25,000',
    averageProjectSize: '$2K - $50K',
    keywords: 'fencing contractor, fence installation, gates, security fencing'
  },
  'c-15': {
    name: 'Flooring and Floor Covering Contractor',
    description: 'Flooring Contractors install various types of floor coverings and flooring systems.',
    icon: '🏠',
    commonProjects: ['Hardwood flooring', 'Carpet installation', 'Tile flooring', 'Vinyl flooring'],
    requiredBond: 'Yes, minimum $25,000',
    averageProjectSize: '$3K - $100K',
    keywords: 'flooring contractor, hardwood floors, carpet, tile, vinyl flooring'
  },
  'c-16': {
    name: 'Fire Protection Contractor',
    description: 'Fire Protection Contractors install and maintain fire sprinkler systems and related safety equipment.',
    icon: '🔥',
    commonProjects: ['Fire sprinklers', 'Fire suppression systems', 'Fire alarms', 'Safety systems'],
    requiredBond: 'Yes, minimum $25,000',
    averageProjectSize: '$10K - $500K',
    keywords: 'fire protection contractor, sprinkler systems, fire suppression, fire safety'
  },
  'c-17': {
    name: 'Glazing Contractor',
    description: 'Glazing Contractors install glass, windows, mirrors, and related glazing materials.',
    icon: '🪟',
    commonProjects: ['Window installation', 'Glass replacement', 'Storefronts', 'Curtain walls'],
    requiredBond: 'Yes, minimum $25,000',
    averageProjectSize: '$3K - $200K',
    keywords: 'glazing contractor, window installation, glass, storefronts, curtain walls'
  },
  'c-21': {
    name: 'Building Moving/Demolition Contractor',
    description: 'Building Moving/Demolition Contractors move structures and perform controlled demolition.',
    icon: '🏗️',
    commonProjects: ['Building demolition', 'Structure moving', 'Site clearing', 'Selective demolition'],
    requiredBond: 'Yes, minimum $25,000',
    averageProjectSize: '$15K - $1M+',
    keywords: 'demolition contractor, building moving, site clearing, structure demolition'
  },
  'c-22': {
    name: 'Asbestos Abatement Contractor',
    description: 'Asbestos Abatement Contractors safely remove asbestos and other hazardous materials.',
    icon: '☣️',
    commonProjects: ['Asbestos removal', 'Hazmat cleanup', 'Environmental remediation', 'Safety compliance'],
    requiredBond: 'Yes, minimum $25,000',
    averageProjectSize: '$10K - $500K',
    keywords: 'asbestos abatement, hazmat removal, environmental cleanup, asbestos removal'
  },
  'c-23': {
    name: 'Ornamental Metal Contractor',
    description: 'Ornamental Metal Contractors fabricate and install decorative metalwork and structural metals.',
    icon: '🔗',
    commonProjects: ['Railings', 'Gates', 'Decorative metalwork', 'Structural metals'],
    requiredBond: 'Yes, minimum $25,000',
    averageProjectSize: '$5K - $200K',
    keywords: 'ornamental metal contractor, railings, gates, decorative metalwork'
  },
  'c-28': {
    name: 'Lock and Security Equipment Contractor',
    description: 'Lock and Security Equipment Contractors install and maintain security systems and locks.',
    icon: '🔒',
    commonProjects: ['Lock installation', 'Security systems', 'Access control', 'Safes'],
    requiredBond: 'Yes, minimum $25,000',
    averageProjectSize: '$1K - $50K',
    keywords: 'locksmith contractor, security systems, locks, access control, safes'
  },
  'c-29': {
    name: 'Masonry Contractor',
    description: 'Masonry Contractors work with brick, stone, concrete block, and other masonry materials.',
    icon: '🧱',
    commonProjects: ['Brick work', 'Stone work', 'Block walls', 'Masonry repair'],
    requiredBond: 'Yes, minimum $25,000',
    averageProjectSize: '$5K - $300K',
    keywords: 'masonry contractor, brick work, stone work, block walls, masonry repair'
  },
  'c-31': {
    name: 'Construction Zone Traffic Control Contractor',
    description: 'Construction Zone Traffic Control Contractors manage traffic safety in construction areas.',
    icon: '🚧',
    commonProjects: ['Traffic control', 'Construction signage', 'Safety barriers', 'Flagging services'],
    requiredBond: 'Yes, minimum $25,000',
    averageProjectSize: '$2K - $100K',
    keywords: 'traffic control contractor, construction zone safety, flagging, traffic management'
  },
  'c-32': {
    name: 'Parking and Highway Improvement Contractor',
    description: 'Parking and Highway Improvement Contractors work on roadways, parking lots, and related infrastructure.',
    icon: '🛣️',
    commonProjects: ['Parking lots', 'Road striping', 'Highway improvements', 'Pavement marking'],
    requiredBond: 'Yes, minimum $25,000',
    averageProjectSize: '$10K - $2M+',
    keywords: 'parking contractor, highway improvement, road striping, pavement marking'
  },
  'c-34': {
    name: 'Pipeline Contractor',
    description: 'Pipeline Contractors install and maintain pipelines for water, gas, oil, and other utilities.',
    icon: '🚰',
    commonProjects: ['Water pipelines', 'Gas lines', 'Sewer lines', 'Utility pipelines'],
    requiredBond: 'Yes, minimum $25,000',
    averageProjectSize: '$25K - $5M+',
    keywords: 'pipeline contractor, water lines, gas lines, sewer lines, utility installation'
  },
  'c-38': {
    name: 'Refrigeration Contractor',
    description: 'Refrigeration Contractors install and maintain commercial and industrial refrigeration systems.',
    icon: '❄️',
    commonProjects: ['Commercial refrigeration', 'Walk-in coolers', 'Ice machines', 'Refrigeration repair'],
    requiredBond: 'Yes, minimum $25,000',
    averageProjectSize: '$3K - $200K',
    keywords: 'refrigeration contractor, commercial refrigeration, walk-in coolers, ice machines'
  },
  'c-42': {
    name: 'Sanitation System Contractor',
    description: 'Sanitation System Contractors install and maintain septic systems and waste treatment facilities.',
    icon: '🚽',
    commonProjects: ['Septic systems', 'Waste treatment', 'Sewer connections', 'Pumping stations'],
    requiredBond: 'Yes, minimum $25,000',
    averageProjectSize: '$10K - $500K',
    keywords: 'sanitation contractor, septic systems, waste treatment, sewer systems'
  },
  'c-43': {
    name: 'Sheet Metal Contractor',
    description: 'Sheet Metal Contractors fabricate and install sheet metal products and systems.',
    icon: '🔧',
    commonProjects: ['HVAC ductwork', 'Metal roofing', 'Gutters', 'Custom sheet metal'],
    requiredBond: 'Yes, minimum $25,000',
    averageProjectSize: '$5K - $300K',
    keywords: 'sheet metal contractor, ductwork, metal roofing, gutters, custom metalwork'
  },
  'c-45': {
    name: 'Sign Contractor',
    description: 'Sign Contractors design, fabricate, and install various types of signs and displays.',
    icon: '🪧',
    commonProjects: ['Business signs', 'Neon signs', 'Digital displays', 'Sign maintenance'],
    requiredBond: 'Yes, minimum $25,000',
    averageProjectSize: '$2K - $100K',
    keywords: 'sign contractor, business signs, neon signs, digital displays, signage'
  },
  'c-46': {
    name: 'Solar Contractor',
    description: 'Solar Contractors install and maintain solar energy systems and related equipment.',
    icon: '☀️',
    commonProjects: ['Solar panels', 'Solar water heating', 'Grid-tie systems', 'Battery storage'],
    requiredBond: 'Yes, minimum $25,000',
    averageProjectSize: '$10K - $500K',
    keywords: 'solar contractor, solar panels, solar installation, renewable energy, photovoltaic'
  },
  'c-47': {
    name: 'General Manufactured Housing Contractor',
    description: 'General Manufactured Housing Contractors install and set up manufactured homes.',
    icon: '🏠',
    commonProjects: ['Mobile home setup', 'Manufactured home installation', 'Foundation work', 'Utility connections'],
    requiredBond: 'Yes, minimum $25,000',
    averageProjectSize: '$5K - $100K',
    keywords: 'manufactured housing contractor, mobile home setup, modular homes'
  },
  'c-49': {
    name: 'Tree Service Contractor',
    description: 'Tree Service Contractors provide tree care, removal, and related arboricultural services.',
    icon: '🌳',
    commonProjects: ['Tree removal', 'Tree trimming', 'Stump grinding', 'Tree health care'],
    requiredBond: 'Yes, minimum $25,000',
    averageProjectSize: '$500 - $50K',
    keywords: 'tree service contractor, tree removal, tree trimming, arborist, stump grinding'
  },
  'c-50': {
    name: 'Reinforcing Steel Contractor',
    description: 'Reinforcing Steel Contractors place and install reinforcing steel (rebar) in concrete structures.',
    icon: '🏗️',
    commonProjects: ['Rebar installation', 'Concrete reinforcement', 'Structural steel', 'Foundation reinforcement'],
    requiredBond: 'Yes, minimum $25,000',
    averageProjectSize: '$10K - $1M+',
    keywords: 'reinforcing steel contractor, rebar, concrete reinforcement, structural steel'
  },
  'c-53': {
    name: 'Swimming Pool Contractor',
    description: 'Swimming Pool Contractors build, install, and maintain swimming pools and spas.',
    icon: '🏊',
    commonProjects: ['Pool construction', 'Spa installation', 'Pool equipment', 'Pool renovation'],
    requiredBond: 'Yes, minimum $25,000',
    averageProjectSize: '$20K - $500K',
    keywords: 'swimming pool contractor, pool construction, spa installation, pool equipment'
  },
  'c-54': {
    name: 'Ceramic and Mosaic Tile Contractor',
    description: 'Ceramic and Mosaic Tile Contractors install ceramic, porcelain, and mosaic tile surfaces.',
    icon: '🏠',
    commonProjects: ['Tile installation', 'Bathroom tiles', 'Kitchen backsplashes', 'Floor tiling'],
    requiredBond: 'Yes, minimum $25,000',
    averageProjectSize: '$3K - $100K',
    keywords: 'tile contractor, ceramic tile, mosaic tile, bathroom tiles, kitchen backsplash'
  },
  'c-55': {
    name: 'Water Conditioning Contractor',
    description: 'Water Conditioning Contractors install and maintain water treatment and conditioning systems.',
    icon: '💧',
    commonProjects: ['Water softeners', 'Water filters', 'Reverse osmosis', 'Water treatment systems'],
    requiredBond: 'Yes, minimum $25,000',
    averageProjectSize: '$2K - $50K',
    keywords: 'water conditioning contractor, water softeners, water filters, water treatment'
  },
  'c-57': {
    name: 'Water Well Drilling Contractor',
    description: 'Water Well Drilling Contractors drill and install water wells and related equipment.',
    icon: '🕳️',
    commonProjects: ['Water well drilling', 'Well pump installation', 'Well maintenance', 'Water testing'],
    requiredBond: 'Yes, minimum $25,000',
    averageProjectSize: '$5K - $100K',
    keywords: 'water well drilling contractor, well drilling, well pumps, water wells'
  },
  'c-60': {
    name: 'Welding Contractor',
    description: 'Welding Contractors provide specialized welding services for various construction and repair projects.',
    icon: '🔥',
    commonProjects: ['Structural welding', 'Pipe welding', 'Repair welding', 'Custom fabrication'],
    requiredBond: 'Yes, minimum $25,000',
    averageProjectSize: '$2K - $200K',
    keywords: 'welding contractor, structural welding, pipe welding, metal fabrication'
  },
  'c-61': {
    name: 'Limited Specialty Contractor',
    description: 'Limited Specialty Contractors perform specialized trades not covered by other classifications.',
    icon: '🔧',
    commonProjects: ['Specialized services', 'Custom installations', 'Unique trades', 'Limited scope work'],
    requiredBond: 'Yes, minimum $25,000',
    averageProjectSize: '$1K - $100K',
    keywords: 'limited specialty contractor, specialized services, custom work'
  },
  // D-class subcategories (under C-61)
  'd-03': {
    name: 'Awning Contractor',
    description: 'Awning Contractors install and maintain awnings and shade structures.',
    icon: '⛱️',
    commonProjects: ['Awning installation', 'Canopy systems', 'Shade structures', 'Retractable awnings'],
    requiredBond: 'Yes, minimum $25,000',
    averageProjectSize: '$2K - $50K',
    keywords: 'awning contractor, canopies, shade structures, retractable awnings'
  },
  'd-04': {
    name: 'Central Vacuum Systems Contractor',
    description: 'Central Vacuum Systems Contractors install and maintain built-in vacuum systems.',
    icon: '🏠',
    commonProjects: ['Central vacuum installation', 'Vacuum system maintenance', 'Built-in cleaning systems'],
    requiredBond: 'Yes, minimum $25,000',
    averageProjectSize: '$2K - $25K',
    keywords: 'central vacuum contractor, built-in vacuum systems, cleaning systems'
  },
  'd-06': {
    name: 'Concrete Related Services Contractor',
    description: 'Concrete Related Services Contractors provide specialized concrete services and repairs.',
    icon: '🏗️',
    commonProjects: ['Concrete repair', 'Concrete cutting', 'Surface preparation', 'Concrete restoration'],
    requiredBond: 'Yes, minimum $25,000',
    averageProjectSize: '$3K - $100K',
    keywords: 'concrete services, concrete repair, concrete cutting, concrete restoration'
  },
  'd-09': {
    name: 'Drilling, Blasting and Oil Field Work Contractor',
    description: 'Drilling and Blasting Contractors perform specialized drilling and controlled blasting operations.',
    icon: '💥',
    commonProjects: ['Rock drilling', 'Controlled blasting', 'Oil field services', 'Site preparation'],
    requiredBond: 'Yes, minimum $25,000',
    averageProjectSize: '$10K - $1M+',
    keywords: 'drilling contractor, blasting, oil field work, rock drilling'
  },
  'd-10': {
    name: 'Elevated Floors Contractor',
    description: 'Elevated Floors Contractors install raised flooring systems and access floors.',
    icon: '🏢',
    commonProjects: ['Raised floors', 'Access flooring', 'Computer room floors', 'Elevated platforms'],
    requiredBond: 'Yes, minimum $25,000',
    averageProjectSize: '$5K - $200K',
    keywords: 'elevated floors contractor, raised floors, access flooring, computer room floors'
  },
  'd-12': {
    name: 'Synthetic Products Contractor',
    description: 'Synthetic Products Contractors work with various synthetic materials and products.',
    icon: '🧪',
    commonProjects: ['Synthetic surfaces', 'Plastic fabrication', 'Composite materials', 'Synthetic installations'],
    requiredBond: 'Yes, minimum $25,000',
    averageProjectSize: '$3K - $150K',
    keywords: 'synthetic products contractor, synthetic surfaces, plastic fabrication, composites'
  },
  'd-16': {
    name: 'Hardware, Locks and Safes Contractor',
    description: 'Hardware, Locks and Safes Contractors install and maintain security hardware and safe systems.',
    icon: '🔒',
    commonProjects: ['Lock installation', 'Safe installation', 'Security hardware', 'Key systems'],
    requiredBond: 'Yes, minimum $25,000',
    averageProjectSize: '$1K - $50K',
    keywords: 'hardware contractor, locks, safes, security hardware, locksmith'
  },
  'd-21': {
    name: 'Machinery and Pumps Contractor',
    description: 'Machinery and Pumps Contractors install and maintain industrial machinery and pump systems.',
    icon: '⚙️',
    commonProjects: ['Pump installation', 'Machinery setup', 'Industrial equipment', 'Mechanical systems'],
    requiredBond: 'Yes, minimum $25,000',
    averageProjectSize: '$5K - $500K',
    keywords: 'machinery contractor, pumps, industrial equipment, mechanical systems'
  },
  'd-24': {
    name: 'Metal Products Contractor',
    description: 'Metal Products Contractors fabricate and install various metal products and components.',
    icon: '🔧',
    commonProjects: ['Metal fabrication', 'Custom metalwork', 'Metal installations', 'Metal repair'],
    requiredBond: 'Yes, minimum $25,000',
    averageProjectSize: '$3K - $200K',
    keywords: 'metal products contractor, metal fabrication, custom metalwork, metal installation'
  },
  'd-28': {
    name: 'Doors, Gates and Activating Devices Contractor',
    description: 'Doors, Gates and Activating Devices Contractors install and maintain automated door and gate systems.',
    icon: '🚪',
    commonProjects: ['Automatic doors', 'Gate operators', 'Door hardware', 'Access control systems'],
    requiredBond: 'Yes, minimum $25,000',
    averageProjectSize: '$3K - $100K',
    keywords: 'door contractor, gates, automatic doors, gate operators, access control'
  },
  'd-29': {
    name: 'Paperhanging Contractor',
    description: 'Paperhanging Contractors specialize in wallpaper installation and wall covering services.',
    icon: '🎨',
    commonProjects: ['Wallpaper installation', 'Wall coverings', 'Decorative papers', 'Specialty wall finishes'],
    requiredBond: 'Yes, minimum $25,000',
    averageProjectSize: '$1K - $25K',
    keywords: 'paperhanging contractor, wallpaper, wall coverings, decorative papers'
  },
  'd-30': {
    name: 'Pile Driving and Pressure Foundation Jacking Contractor',
    description: 'Pile Driving Contractors install foundation piles and perform foundation stabilization work.',
    icon: '🏗️',
    commonProjects: ['Pile driving', 'Foundation piles', 'Foundation repair', 'Underpinning'],
    requiredBond: 'Yes, minimum $25,000',
    averageProjectSize: '$25K - $1M+',
    keywords: 'pile driving contractor, foundation piles, foundation repair, underpinning'
  },
  'd-31': {
    name: 'Pole Installation and Maintenance Contractor',
    description: 'Pole Installation Contractors install and maintain utility poles, light poles, and similar structures.',
    icon: '⚡',
    commonProjects: ['Utility poles', 'Light poles', 'Flag poles', 'Pole maintenance'],
    requiredBond: 'Yes, minimum $25,000',
    averageProjectSize: '$2K - $100K',
    keywords: 'pole installation contractor, utility poles, light poles, pole maintenance'
  },
  'd-34': {
    name: 'Prefabricated Equipment Contractor',
    description: 'Prefabricated Equipment Contractors install and maintain prefabricated structures and equipment.',
    icon: '🏭',
    commonProjects: ['Prefab buildings', 'Modular equipment', 'Pre-engineered structures', 'Equipment installation'],
    requiredBond: 'Yes, minimum $25,000',
    averageProjectSize: '$10K - $500K',
    keywords: 'prefabricated equipment contractor, prefab buildings, modular equipment'
  },
  'd-35': {
    name: 'Pool and Spa Maintenance Contractor',
    description: 'Pool and Spa Maintenance Contractors provide ongoing maintenance and repair services for pools and spas.',
    icon: '🏊',
    commonProjects: ['Pool cleaning', 'Spa maintenance', 'Pool repairs', 'Water treatment'],
    requiredBond: 'Yes, minimum $25,000',
    averageProjectSize: '$500 - $25K',
    keywords: 'pool maintenance contractor, spa maintenance, pool cleaning, pool repair'
  },
  'd-38': {
    name: 'Sand and Water Blasting Contractor',
    description: 'Sand and Water Blasting Contractors provide surface cleaning and preparation services.',
    icon: '💨',
    commonProjects: ['Sandblasting', 'Water blasting', 'Surface cleaning', 'Paint removal'],
    requiredBond: 'Yes, minimum $25,000',
    averageProjectSize: '$3K - $100K',
    keywords: 'sandblasting contractor, water blasting, surface cleaning, paint removal'
  },
  'd-39': {
    name: 'Scaffolding Contractor',
    description: 'Scaffolding Contractors erect and maintain scaffolding systems for construction and maintenance work.',
    icon: '🏗️',
    commonProjects: ['Scaffolding erection', 'Scaffold rental', 'Safety platforms', 'Construction support'],
    requiredBond: 'Yes, minimum $25,000',
    averageProjectSize: '$2K - $200K',
    keywords: 'scaffolding contractor, scaffold erection, safety platforms, construction support'
  },
  'd-40': {
    name: 'Service Station Equipment and Maintenance Contractor',
    description: 'Service Station Equipment Contractors install and maintain gas station and automotive service equipment.',
    icon: '⛽',
    commonProjects: ['Gas pumps', 'Fuel systems', 'Car wash equipment', 'Station maintenance'],
    requiredBond: 'Yes, minimum $25,000',
    averageProjectSize: '$10K - $500K',
    keywords: 'service station contractor, gas pumps, fuel systems, car wash equipment'
  },
  'd-41': {
    name: 'Siding and Decking Contractor',
    description: 'Siding and Decking Contractors install and maintain exterior siding and deck systems.',
    icon: '🏠',
    commonProjects: ['Siding installation', 'Deck construction', 'Exterior cladding', 'Deck repair'],
    requiredBond: 'Yes, minimum $25,000',
    averageProjectSize: '$5K - $200K',
    keywords: 'siding contractor, decking contractor, exterior siding, deck construction'
  },
  'd-42': {
    name: 'Non-Electrical Sign Installation Contractor',
    description: 'Non-Electrical Sign Installation Contractors install signs that do not require electrical connections.',
    icon: '🪧',
    commonProjects: ['Non-electric signs', 'Banner installation', 'Way-finding signs', 'Monument signs'],
    requiredBond: 'Yes, minimum $25,000',
    averageProjectSize: '$1K - $50K',
    keywords: 'non-electrical sign contractor, banner installation, way-finding signs, monument signs'
  },
  'd-49': {
    name: 'Tree Service Contractor (Legacy)',
    description: 'Legacy Tree Service classification (converted to C-49 as of January 1, 2024).',
    icon: '🌳',
    commonProjects: ['Tree removal', 'Tree trimming', 'Stump grinding', 'Tree health care'],
    requiredBond: 'Yes, minimum $25,000',
    averageProjectSize: '$500 - $50K',
    keywords: 'tree service contractor, tree removal, tree trimming, arborist, stump grinding'
  }
}

export function getContractorTypeInfo(classification) {
  let key = classification.toLowerCase()
  
  // Handle both C35/D12 and C-35/D-12 formats by trying both
  let typeInfo = contractorTypeDetails[key]
  
  // If not found and it's a letter+number classification without hyphen, try with hyphen
  if (!typeInfo && key.match(/^[a-z]\d+$/)) {
    const keyWithHyphen = key.replace(/^([a-z])(\d+)$/, '$1-$2')
    typeInfo = contractorTypeDetails[keyWithHyphen]
  }
  
  return typeInfo || {
    name: classification,
    description: `Licensed ${classification} contractors providing specialized construction and contracting services.`,
    icon: '🔧',
    commonProjects: ['Specialized contracting services'],
    requiredBond: 'Varies by classification',
    averageProjectSize: 'Varies',
    keywords: `${classification} contractor, licensed contractor`
  }
}