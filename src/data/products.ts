export interface Variant {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  benefits: string[];
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  longDescription: string;
  variants: Variant[];
  images: string[];
  ingredients: string[];
  howToUse: string[];
  benefits: string[];
  safetyInfo: string[];
}

// Import product images
import productImage1 from '../assets/83a00bb364b2616a6523d5536a850f3da94a4d73.png';
import productImage2 from '../assets/1bc5f85c823f68013718c4f317566b3c9523b737.png';

export const MAIN_PRODUCT: Product = {
  id: 'ossireliva-oil',
  name: 'Ossireliva Aromatherapy Wellness Oil',
  tagline: 'Nature\'s Embrace, Crafted for Your Well-being',
  description: 'Experience the harmonious blend of nature\'s finest essential oils, meticulously crafted to elevate your daily wellness ritual.',
  longDescription: 'Ossireliva represents the perfect fusion of ancient aromatherapy wisdom and modern wellness science. Each bottle is carefully formulated with premium, sustainably sourced ingredients that work in harmony with your body\'s natural rhythms. Our commitment to purity means zero artificial additives, only the purest botanical extracts nature has to offer.',
  variants: [
    {
      id: 'lavender-calm',
      name: 'Lavender Calm',
      description: 'Soothing lavender blend for relaxation and peaceful sleep',
      price: 49.99,
      stock: 150,
      benefits: [
        'Promotes deep relaxation',
        'Supports restful sleep',
        'Reduces stress and anxiety',
        'Calms nervous system',
        'Enhances meditation practice'
      ]
    },
    {
      id: 'citrus-energy',
      name: 'Citrus Energy',
      description: 'Uplifting citrus blend to invigorate your senses',
      price: 49.99,
      stock: 120,
      benefits: [
        'Boosts mental clarity',
        'Increases energy levels',
        'Uplifts mood naturally',
        'Enhances focus and concentration',
        'Refreshes and revitalizes'
      ]
    },
    {
      id: 'eucalyptus-breath',
      name: 'Eucalyptus Breath',
      description: 'Refreshing eucalyptus for clear breathing and vitality',
      price: 49.99,
      stock: 100,
      benefits: [
        'Supports respiratory health',
        'Clears airways naturally',
        'Invigorating aroma',
        'Reduces congestion',
        'Promotes easier breathing'
      ]
    },
    {
      id: 'rose-harmony',
      name: 'Rose Harmony',
      description: 'Luxurious rose essence for emotional balance',
      price: 54.99,
      stock: 80,
      benefits: [
        'Balances emotions',
        'Nurtures self-love',
        'Promotes skin radiance',
        'Calming and grounding',
        'Encourages positive mindset'
      ]
    },
    {
      id: 'peppermint-focus',
      name: 'Peppermint Focus',
      description: 'Crisp peppermint to sharpen mind and enhance clarity',
      price: 49.99,
      stock: 140,
      benefits: [
        'Enhances mental alertness',
        'Improves concentration',
        'Reduces mental fatigue',
        'Cooling and refreshing',
        'Supports productivity'
      ]
    },
    {
      id: 'sandalwood-ground',
      name: 'Sandalwood Ground',
      description: 'Earthy sandalwood for meditation and inner peace',
      price: 59.99,
      stock: 90,
      benefits: [
        'Deepens meditation',
        'Promotes spiritual awareness',
        'Grounding and centering',
        'Reduces emotional stress',
        'Enhances mindfulness'
      ]
    }
  ],
  images: [productImage1, productImage2], // Will use the provided images + placeholders
  ingredients: [
    'Organic Jojoba Oil - Rich in vitamins E and B complex',
    'Sweet Almond Oil - Deeply nourishing and hypoallergenic',
    'Vitamin E - Powerful antioxidant for skin health',
    'Essential Oil Blend - Pure, therapeutic-grade aromatics',
    'Natural Preservatives - Plant-based, non-toxic',
    'Rosehip Seed Oil - Promotes skin regeneration',
    'Grapeseed Oil - Light, non-comedogenic carrier',
    'Botanical Extracts - Sustainably sourced, organic'
  ],
  howToUse: [
    'Shake bottle gently before each use to activate the natural ingredients',
    'Apply 3-5 drops to pulse points (wrists, neck, temples)',
    'Massage gently in circular motions for better absorption',
    'Breathe deeply to enjoy the aromatic benefits',
    'Use morning and evening, or as needed throughout the day',
    'For massage: Apply generously to desired areas and use long, smooth strokes',
    'For diffusion: Add 10-15 drops to your oil diffuser',
    'Store in a cool, dry place away from direct sunlight'
  ],
  benefits: [
    'Promotes holistic wellness and balance',
    'Supports emotional and mental well-being',
    'Enhances relaxation and stress relief',
    'Nourishes and rejuvenates skin',
    '100% natural, cruelty-free formula',
    'No synthetic fragrances or harmful chemicals',
    'Sustainably sourced ingredients',
    'Handcrafted in small batches for quality',
    'Suitable for all skin types',
    'Multi-purpose: aromatherapy, massage, skincare'
  ],
  safetyInfo: [
    'For external use only',
    'Perform a patch test before first use',
    'Avoid contact with eyes and mucous membranes',
    'If irritation occurs, discontinue use immediately',
    'Consult a healthcare professional if pregnant or nursing',
    'Keep out of reach of children and pets',
    'Do not ingest',
    'Store in original container',
    'Use within 12 months of opening for optimal freshness'
  ]
};

export const TESTIMONIALS = [
  {
    id: '1',
    name: 'Sarah Mitchell',
    location: 'California, USA',
    rating: 5,
    text: 'Ossireliva has transformed my evening routine. The Lavender Calm blend helps me unwind after long days, and I\'ve noticed significantly better sleep quality. Absolutely love it!',
    variant: 'Lavender Calm',
    date: '2024-12-15'
  },
  {
    id: '2',
    name: 'James Chen',
    location: 'Singapore',
    rating: 5,
    text: 'As someone who works long hours, the Peppermint Focus blend has been a game-changer. It keeps me alert and focused without the jitters of coffee. The quality is exceptional.',
    variant: 'Peppermint Focus',
    date: '2024-12-10'
  },
  {
    id: '3',
    name: 'Emma Thompson',
    location: 'London, UK',
    rating: 5,
    text: 'I\'ve tried many essential oils, but Ossireliva stands out. The Rose Harmony blend is pure luxury. My skin feels amazing, and the scent is divine. Worth every penny!',
    variant: 'Rose Harmony',
    date: '2024-12-01'
  },
  {
    id: '4',
    name: 'Michael Rodriguez',
    location: 'Texas, USA',
    rating: 5,
    text: 'The Eucalyptus Breath variant has been incredible during allergy season. It really helps clear my airways naturally. Plus, I appreciate the sustainable packaging!',
    variant: 'Eucalyptus Breath',
    date: '2024-11-28'
  },
  {
    id: '5',
    name: 'Yuki Tanaka',
    location: 'Tokyo, Japan',
    rating: 5,
    text: 'Sandalwood Ground has deepened my meditation practice significantly. The aroma is authentic and grounding. Ossireliva\'s attention to quality shows in every drop.',
    variant: 'Sandalwood Ground',
    date: '2024-11-20'
  },
  {
    id: '6',
    name: 'Lisa Anderson',
    location: 'New York, USA',
    rating: 5,
    text: 'The Citrus Energy blend is my morning ritual now. It\'s like sunshine in a bottle! I feel more energized and positive throughout the day. Highly recommend!',
    variant: 'Citrus Energy',
    date: '2024-11-15'
  }
];
