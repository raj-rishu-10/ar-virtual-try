export interface Product {
  id: string;
  name: string;
  price: string;
  brand: string;
  thumbnail?: string;
  color?: string;
  colors?: { name: string; hex: string }[];
  modelUrl?: string;
  textureUrl?: string;
  type?: string;
}

export const LIPSTICK_PRODUCTS: Product[] = [
  {
    id: 'lip1',
    name: 'Classic Crimson',
    price: '$24.00',
    brand: 'AR Beauty Matte',
    color: '#be123c',
    colors: [
      { name: 'Crimson Red', hex: '#be123c' },
      { name: 'Velvet Rose', hex: '#e11d48' },
      { name: 'Deep Burgundy', hex: '#881337' },
      { name: 'Coral Pink', hex: '#f43f5e' }
    ]
  },
  {
    id: 'lip2',
    name: 'Satin Nude',
    price: '$26.00',
    brand: 'AR Beauty Satin',
    color: '#ca8a04',
    colors: [
      { name: 'Warm Honey', hex: '#ca8a04' },
      { name: 'Soft Taupe', hex: '#d97706' },
      { name: 'Peach Glaze', hex: '#b45309' }
    ]
  },
  {
    id: 'lip3',
    name: 'Metallic Violet',
    price: '$28.00',
    brand: 'Cosmic Gloss',
    color: '#a21caf',
    colors: [
      { name: 'Cyber Violet', hex: '#a21caf' },
      { name: 'Electric Pink', hex: '#db2777' },
      { name: 'Royal Plum', hex: '#701a75' }
    ]
  }
];

export const MAKEUP_SHAPES_PRODUCTS: Product[] = [
  {
    id: 'shape_eyeshadow',
    name: 'Sunset Palette Eyeshadow',
    price: '$34.00',
    brand: 'Aesthetic Eyes',
    thumbnail: 'eyeshadow',
    color: '#9333ea',
    colors: [
      { name: 'Sunset Purple', hex: '#9333ea' },
      { name: 'Golden Apricot', hex: '#f97316' },
      { name: 'Hot Pink', hex: '#ec4899' },
      { name: 'Emerald', hex: '#10b981' }
    ]
  },
  {
    id: 'shape_blush',
    name: 'Soft Flush Blush',
    price: '$22.00',
    brand: 'Glow Cheek',
    thumbnail: 'blush',
    color: '#f43f5e',
    colors: [
      { name: 'Peach Flush', hex: '#fb7185' },
      { name: 'Berry Glow', hex: '#e11d48' },
      { name: 'Tangerine Dream', hex: '#fb923c' }
    ]
  },
  {
    id: 'shape_eyeliner',
    name: 'Super Precise Eyeliner',
    price: '$18.00',
    brand: 'Liquid Ink',
    thumbnail: 'eyeliner',
    color: '#000000',
    colors: [
      { name: 'Midnight Black', hex: '#000000' },
      { name: 'Choco Brown', hex: '#451a03' },
      { name: 'Electric Blue', hex: '#2563eb' }
    ]
  }
];

export const GLASSES_PRODUCTS: Product[] = [
  {
    id: 'glasses1',
    name: 'Aviator Classic',
    price: '$150.00',
    brand: 'Ray-Ban',
    thumbnail: 'glasses1',
    modelUrl: '/assets/VTOGlasses/models3D/glasses1.glb'
  },
  {
    id: 'glasses2',
    name: 'Urban Wayfarer',
    price: '$180.00',
    brand: 'Oakley',
    thumbnail: 'glasses2',
    modelUrl: '/assets/VTOGlasses/models3D/glasses2.glb'
  }
];

export const HELMET_PRODUCTS: Product[] = [
  {
    id: 'helmet1',
    name: 'Motorcycle Helmet',
    price: '$190.00',
    brand: 'Shoei',
    thumbnail: 'helmet1',
    modelUrl: '/assets/VTOHelmet/models3D/motorcycleHelmet.glb'
  }
];

export const HAT_PRODUCTS: Product[] = [
  {
    id: 'hat1',
    name: 'Urban Baseball Cap',
    price: '$45.00',
    brand: 'New Era',
    thumbnail: 'hat1',
    modelUrl: '/assets/VTOHat/models3D/hat.glb'
  }
];

export const NECKLACE_PRODUCTS: Product[] = [
  {
    id: 'necklace1',
    name: 'Black Panther Pendant',
    price: '$390.00',
    brand: 'Wakanda Fine Jewelry',
    thumbnail: 'necklace1',
    modelUrl: '/assets/VTONecklace/models3D/blackPanther.glb'
  },
  {
    id: 'necklace2',
    name: 'Native American Choker',
    price: '$290.00',
    brand: 'Tribal Arts',
    thumbnail: 'necklace2',
    modelUrl: '/assets/VTONecklace/models3D/nativeAmerican.glb'
  }
];

export const EARRINGS_PRODUCTS: Product[] = [
  {
    id: 'earring1',
    name: 'Chandelier Drop Earrings',
    price: '$85.00',
    brand: 'Pandora',
    thumbnail: 'earring1',
    modelUrl: '/assets/earrings3D/models3D/earrings.glb'
  }
];

export const EARRINGS_2D_PRODUCTS: Product[] = [
  {
    id: 'earring2d_1',
    name: 'Silver Pearl Drop',
    price: '$35.00',
    brand: 'Minimalist',
    thumbnail: 'earring2d_1',
    textureUrl: '/textures/earring1.png'
  },
  {
    id: 'earring2d_2',
    name: 'Golden Hoop',
    price: '$29.00',
    brand: 'Minimalist',
    thumbnail: 'earring2d_2',
    textureUrl: '/textures/earring2.png'
  }
];

export const HEADPHONES_PRODUCTS: Product[] = [
  {
    id: 'headphones1',
    name: 'Studio Wireless Over-Ear',
    price: '$349.00',
    brand: 'Sony',
    thumbnail: 'headphones1',
    modelUrl: '/assets/VTOHelmet/models3D/headphones.glb'
  }
];

export const SPORTS_PAINT_PRODUCTS: Product[] = [
  {
    id: 'flag_football',
    name: 'Football Stripes',
    price: '$0.00',
    brand: 'Sports Fan',
    thumbnail: 'football_stripes',
    textureUrl: '/textures/sports_paint.png'
  },
  {
    id: 'flag_usa',
    name: 'USA Flag Paint',
    price: '$0.00',
    brand: 'Patriot Paint',
    thumbnail: 'usa_flag',
    textureUrl: '/textures/usa_flag.png'
  }
];
