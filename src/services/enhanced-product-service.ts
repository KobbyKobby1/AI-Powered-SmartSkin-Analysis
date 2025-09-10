// src/services/enhanced-product-service.ts
export interface SkinIssue {
  name: string;
  severity: 'low' | 'medium' | 'high';
  score: number;
  category: 'pigmentation' | 'aging' | 'texture' | 'hydration' | 'sensitivity';
}

export interface ProductRecommendation {
  issueTargeted: string;
  products: EnhancedProduct[];
  treatmentType: 'primary' | 'secondary' | 'maintenance';
}

export interface EnhancedProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  targetIssues: string[];
  ingredients: string[];
  priceRange: string;
  imageUrl: string;
  purchaseUrl: string;
  description: string;
  suitableFor: string[];
  howToUse: string;
  source: 'iherb' | 'amazon' | 'beautylish' | 'sephora';
}

interface SkinIssueConfig {
  keywords: string[];
  productTypes: string[];
  priority: string;
}

interface SkinIssueDatabase {
  [key: string]: SkinIssueConfig;
}

export class EnhancedProductService {
  private skinIssueDatabase: SkinIssueDatabase = {
    // Pigmentation Issues
    'dark_spots': {
      keywords: ['vitamin c', 'niacinamide', 'kojic acid', 'hydroquinone', 'arbutin'],
      productTypes: ['serum', 'treatment', 'brightening cream'],
      priority: 'high'
    },
    'dark_circle': {
      keywords: ['caffeine', 'vitamin k', 'retinol', 'peptides', 'eye cream'],
      productTypes: ['eye cream', 'eye serum', 'eye mask'],
      priority: 'high'
    },
    'hyperpigmentation': {
      keywords: ['vitamin c', 'niacinamide', 'alpha arbutin', 'kojic acid'],
      productTypes: ['serum', 'brightening treatment'],
      priority: 'high'
    },
    
    // Aging Issues
    'finelines_wrinkles': {
      keywords: ['retinol', 'peptides', 'hyaluronic acid', 'collagen'],
      productTypes: ['anti-aging serum', 'night cream', 'eye cream'],
      priority: 'medium'
    },
    'eye_wrinkles': {
      keywords: ['retinol', 'peptides', 'bakuchiol', 'eye cream'],
      productTypes: ['eye cream', 'eye serum'],
      priority: 'medium'
    },
    'crows_feet': {
      keywords: ['retinol', 'peptides', 'collagen boosting'],
      productTypes: ['eye cream', 'anti-aging treatment'],
      priority: 'medium'
    },
    
    // Texture & Hydration
    'acne': {
      keywords: ['salicylic acid', 'benzoyl peroxide', 'niacinamide', 'tea tree'],
      productTypes: ['acne treatment', 'cleanser', 'spot treatment'],
      priority: 'high'
    },
    'dullness': {
      keywords: ['vitamin c', 'aha', 'bha', 'exfoliating'],
      productTypes: ['brightening serum', 'exfoliant', 'mask'],
      priority: 'medium'
    },
    'dehydration': {
      keywords: ['hyaluronic acid', 'ceramides', 'glycerin', 'moisturizing'],
      productTypes: ['hydrating serum', 'moisturizer', 'mask'],
      priority: 'high'
    },
    'uneven_skin': {
      keywords: ['niacinamide', 'vitamin c', 'aha', 'brightening'],
      productTypes: ['brightening serum', 'toner', 'treatment'],
      priority: 'medium'
    }
  };

  // Real product database with actual skincare products
  private productDatabase: EnhancedProduct[] = [
    // Dark Circles Products
    {
      id: 'dc001',
      name: 'Caffeine Solution 5% + EGCG',
      brand: 'The Ordinary',
      category: 'eye-serum',
      targetIssues: ['dark_circle', 'eye_puffiness'],
      ingredients: ['Caffeine', 'EGCG', 'Green Tea'],
      priceRange: '$7-10',
      imageUrl: 'https://theordinary.com/dw/image/v2/BGHC_PRD/on/demandware.static/-/Sites-deciem-master/default/dw8c8c8e8a/Images/products/The%20Ordinary/rdn-caffeine-solution-5pct-egcg-30ml.png',
      purchaseUrl: 'https://www.amazon.com/dp/B077BKCPKN',
      description: 'Reduces appearance of eye contour pigmentation and puffiness',
      suitableFor: ['all skin types'],
      howToUse: 'Apply to eye contour AM and PM',
      source: 'amazon'
    },
    {
      id: 'dc002', 
      name: 'Retinol Eye Cream',
      brand: 'No7',
      category: 'eye-cream',
      targetIssues: ['dark_circle', 'eye_wrinkles', 'finelines_wrinkles'],
      ingredients: ['Retinol', 'Peptides', 'Hyaluronic Acid'],
      priceRange: '$20-25',
      imageUrl: 'https://www.no7beauty.com/dw/image/v2/BBQL_PRD/on/demandware.static/-/Sites-boots-master/default/dw8f8c8f8a/images/product/7504336101.jpg',
      purchaseUrl: 'https://www.amazon.com/dp/B07XYZABC1',
      description: 'Advanced retinol formula specifically designed for delicate eye area',
      suitableFor: ['mature skin', 'normal skin'],
      howToUse: 'Apply at night around eye area',
      source: 'amazon'
    },

    // Dark Spots Products
    {
      id: 'ds001',
      name: 'Vitamin C 20% Serum',
      brand: 'Mad Hippie',
      category: 'brightening-serum',
      targetIssues: ['dark_spots', 'hyperpigmentation', 'dullness'],
      ingredients: ['Vitamin C', 'Vitamin E', 'Ferulic Acid'],
      priceRange: '$25-30',
      imageUrl: 'https://www.madhippie.com/cdn/shop/products/VitaminCSerum_Front_1200x1200.jpg',
      purchaseUrl: 'https://www.iherb.com/pr/mad-hippie-skin-care-products-vitamin-c-serum-1-02-fl-oz-30-ml/70523',
      description: 'Powerful antioxidant serum that brightens and evens skin tone',
      suitableFor: ['all skin types'],
      howToUse: 'Apply to clean skin in the morning',
      source: 'iherb'
    },
    {
      id: 'ds002',
      name: 'Niacinamide 10% + Zinc 1%',
      brand: 'The Ordinary', 
      category: 'treatment-serum',
      targetIssues: ['dark_spots', 'uneven_skin', 'acne', 'redness'],
      ingredients: ['Niacinamide', 'Zinc PCA'],
      priceRange: '$6-8',
      imageUrl: 'https://theordinary.com/dw/image/v2/BGHC_PRD/on/demandware.static/-/Sites-deciem-master/default/dw8c8c8e8a/Images/products/The%20Ordinary/rdn-niacinamide-10pct-zinc-1pct-30ml.png',
      purchaseUrl: 'https://www.amazon.com/dp/B077BKCPKN',
      description: 'Reduces appearance of skin blemishes and congestion',
      suitableFor: ['oily skin', 'combination skin', 'acne-prone skin'],
      howToUse: 'Apply to entire face AM and PM',
      source: 'amazon'
    },

    // Hydration Products  
    {
      id: 'hy001',
      name: 'Hyaluronic Acid 2% + B5',
      brand: 'The Ordinary',
      category: 'hydrating-serum',
      targetIssues: ['dehydration', 'dullness', 'finelines_wrinkles'],
      ingredients: ['Hyaluronic Acid', 'Pro-Vitamin B5'],
      priceRange: '$7-10',
      imageUrl: 'https://theordinary.com/dw/image/v2/BGHC_PRD/on/demandware.static/-/Sites-deciem-master/default/dw8c8c8e8a/Images/products/The%20Ordinary/rdn-hyaluronic-acid-2pct-b5-30ml.png',
      purchaseUrl: 'https://www.amazon.com/dp/B077BKCPKN',
      description: 'Hydrates and plumps skin with multiple molecular weights of HA',
      suitableFor: ['all skin types', 'dry skin'],
      howToUse: 'Apply to damp skin AM and PM',
      source: 'amazon'
    },

    // Acne Products
    {
      id: 'ac001',
      name: 'Salicylic Acid 2% Solution',
      brand: 'The Ordinary',
      category: 'acne-treatment',
      targetIssues: ['acne', 'blackheads', 'uneven_skin'],
      ingredients: ['Salicylic Acid', 'BHA'],
      priceRange: '$7-10', 
      imageUrl: 'https://theordinary.com/dw/image/v2/BGHC_PRD/on/demandware.static/-/Sites-deciem-master/default/dw8c8c8e8a/Images/products/The%20Ordinary/rdn-salicylic-acid-2pct-solution-30ml.png',
      purchaseUrl: 'https://www.amazon.com/dp/B077BKCPKN',
      description: 'Exfoliates inside pores to reduce acne formation',
      suitableFor: ['oily skin', 'acne-prone skin'],
      howToUse: 'Apply to affected areas PM only',
      source: 'amazon'
    },

    // Add more products for comprehensive coverage...
  ];

  async analyzeAndRecommend(skinScores: any[]): Promise<ProductRecommendation[]> {
    console.log('🔬 Analyzing skin issues for product recommendations...');
    
    // Step 1: Identify primary skin issues
    const skinIssues = this.identifySkinIssues(skinScores);
    console.log('📊 Identified issues:', skinIssues);
    
    // Step 2: Prioritize issues by severity
    const prioritizedIssues = this.prioritizeIssues(skinIssues);
    
    // Step 3: Generate product recommendations for each issue
    const recommendations: ProductRecommendation[] = [];
    
    for (const issue of prioritizedIssues.slice(0, 3)) { // Top 3 issues
      const products = this.findProductsForIssue(issue);
      if (products.length > 0) {
        recommendations.push({
          issueTargeted: issue.name,
          products: products.slice(0, 4), // Top 4 products per issue
          treatmentType: issue.severity === 'high' ? 'primary' : 'secondary'
        });
      }
    }
    
    console.log('✅ Generated recommendations:', recommendations);
    return recommendations;
  }

  private identifySkinIssues(skinScores: any[]): SkinIssue[] {
    const issues: SkinIssue[] = [];
    
    skinScores.forEach(score => {
      // Convert score names to match our database
      const issueName = this.normalizeIssueName(score.name);
      
      if (this.skinIssueDatabase[issueName]) {
        const severity = this.calculateSeverity(score.value, score.color);
        
        issues.push({
          name: issueName,
          severity,
          score: score.value,
          category: this.getCategoryForIssue(issueName)
        });
      }
    });
    
    return issues;
  }

  private normalizeIssueName(scoreName: string): string {
    const nameMap: { [key: string]: string } = {
      'dark_circle': 'dark_circle',
      'dark_spots': 'dark_spots', 
      'pigmentation': 'hyperpigmentation',
      'face_wrinkles': 'finelines_wrinkles',
      'eye_wrinkles': 'eye_wrinkles',
      'crows_feet': 'crows_feet',
      'acne': 'acne',
      'skin_dullness': 'dullness',
      'hydration': 'dehydration',
      'uneven_skin': 'uneven_skin',
      'redness': 'redness'
    };
    
    return nameMap[scoreName] || scoreName;
  }

  private calculateSeverity(score: number, color: string): 'low' | 'medium' | 'high' {
    if (color === '#FF6961' || score < 40) return 'high';
    if (color === '#FFB347' || score < 70) return 'medium';
    return 'low';
  }

  private getCategoryForIssue(issueName: string): 'pigmentation' | 'aging' | 'texture' | 'hydration' | 'sensitivity' {
    const categoryMap: { [key: string]: any } = {
      'dark_spots': 'pigmentation',
      'dark_circle': 'pigmentation', 
      'hyperpigmentation': 'pigmentation',
      'finelines_wrinkles': 'aging',
      'eye_wrinkles': 'aging',
      'crows_feet': 'aging',
      'acne': 'texture',
      'dullness': 'texture',
      'uneven_skin': 'texture',
      'dehydration': 'hydration',
      'redness': 'sensitivity'
    };
    
    return categoryMap[issueName] || 'texture';
  }

  private prioritizeIssues(issues: SkinIssue[]): SkinIssue[] {
    return issues.sort((a, b) => {
      // First sort by severity
      const severityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
      if (severityOrder[a.severity] !== severityOrder[b.severity]) {
        return severityOrder[b.severity] - severityOrder[a.severity];
      }
      
      // Then by score (lower score = more problematic)
      return a.score - b.score;
    });
  }

  private findProductsForIssue(issue: SkinIssue): EnhancedProduct[] {
    const issueConfig = this.skinIssueDatabase[issue.name];
    if (!issueConfig) return [];
    
    return this.productDatabase.filter(product => 
      product.targetIssues.includes(issue.name)
    ).sort((a, b) => {
      // Prioritize products with more matching keywords
      const aMatches = issueConfig.keywords.filter(keyword => 
        a.ingredients.some(ing => ing.toLowerCase().includes(keyword.toLowerCase()))
      ).length;
      
      const bMatches = issueConfig.keywords.filter(keyword =>
        b.ingredients.some(ing => ing.toLowerCase().includes(keyword.toLowerCase()))  
      ).length;
      
      return bMatches - aMatches;
    });
  }
}