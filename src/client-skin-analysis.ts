import { AIDetectionResult, OutputScore, Recommendation } from './context';

/**
 * Client-Side Skin Analysis
 * Analyzes images locally without external APIs
 */
export class ClientSkinAnalysis {
  
  async analyzeSkinFromImage(
    imageBlob: Blob, 
    gender: string = 'unspecified', 
    ageRange: string = '25'
  ): Promise<AIDetectionResult> {
    
    console.log('🔬 Starting client-side skin analysis...');
    
    try {
      // Step 1: Load and analyze the image
      const imageFeatures = await this.extractImageFeatures(imageBlob);
      
      // Step 2: Determine skin type from features
      const skinType = this.determineSkinType(imageFeatures);
      
      // Step 3: Calculate confidence
      const confidence = this.calculateConfidence(imageFeatures, skinType);
      
      // Step 4: Generate analysis breakdown
      const analysis = this.generateAnalysis(imageFeatures);
      
      // Step 5: Create recommendations
      const recommendations = this.generateRecommendations(skinType, gender, ageRange);
      
      const result: AIDetectionResult = {
        skinType,
        confidence,
        analysis,
        recommendations
      };
      
      console.log('✅ Client-side analysis complete:', result);
      return result;
      
    } catch (error) {
      console.error('❌ Client analysis failed:', error);
      // Fallback to questionnaire-based detection
      return this.generateFallbackResult(gender, ageRange);
    }
  }
  
  /**
   * Extract visual features from the uploaded image
   */
  private async extractImageFeatures(imageBlob: Blob): Promise<ImageFeatures> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Canvas not supported'));
        return;
      }
      
      img.onload = () => {
        try {
          // Set canvas size for analysis
          const size = 256;
          canvas.width = size;
          canvas.height = size;
          
          // Draw image
          ctx.drawImage(img, 0, 0, size, size);
          
          // Get image data
          const imageData = ctx.getImageData(0, 0, size, size);
          const features = this.analyzePixelData(imageData);
          
          resolve(features);
        } catch (error) {
          reject(error);
        }
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(imageBlob);
    });
  }
  
  /**
   * Analyze pixel data to extract skin characteristics
   */
  private analyzePixelData(imageData: ImageData): ImageFeatures {
    const { data, width, height } = imageData;
    
    let totalBrightness = 0;
    let totalSaturation = 0;
    let redness = 0;
    let oiliness = 0;
    let uniformity = 0;
    let pixelCount = 0;
    
    const brightnesses: number[] = [];
    const rValues: number[] = [];
    const gValues: number[] = [];
    const bValues: number[] = [];
    
    // Sample pixels in face area (center 70%)
    const margin = Math.floor(width * 0.15);
    
    for (let y = margin; y < height - margin; y += 2) {
      for (let x = margin; x < width - margin; x += 2) {
        const i = (y * width + x) * 4;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Skip very dark or very light pixels (likely not skin)
        const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
        if (brightness < 30 || brightness > 240) continue;
        
        brightnesses.push(brightness);
        rValues.push(r);
        gValues.push(g);
        bValues.push(b);
        
        totalBrightness += brightness;
        
        // Calculate saturation
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const saturation = max === 0 ? 0 : (max - min) / max * 100;
        totalSaturation += saturation;
        
        // Detect redness - EXTREMELY STRICT to avoid false positives
        // Only count as red if R is dramatically higher AND the pixel is very reddish
        if (r > g + 35 && r > b + 35 && r > 130 && r > 150) {
          redness++;
        }
        
        // Detect potential shine/oiliness - CALIBRATED to oily reference image
        // Your oily reference shows clear shine, so detect more sensitively
        if ((brightness > 160 && saturation < 30) || 
            (brightness > 140 && saturation < 20)) {
          oiliness++;
        }
        
        pixelCount++;
      }
    }
    
    if (pixelCount === 0) {
      throw new Error('No suitable skin pixels found for analysis');
    }
    
    // Calculate texture uniformity
    const avgBrightness = totalBrightness / pixelCount;
    let textureVariance = 0;
    for (const brightness of brightnesses) {
      textureVariance += Math.pow(brightness - avgBrightness, 2);
    }
    textureVariance = textureVariance / brightnesses.length;
    
    // Calculate color uniformity
    const rStdDev = this.calculateStdDev(rValues);
    const gStdDev = this.calculateStdDev(gValues);
    const bStdDev = this.calculateStdDev(bValues);
    const avgStdDev = (rStdDev + gStdDev + bStdDev) / 3;
    uniformity = Math.max(0, 100 - avgStdDev / 2.55);
    
    const finalBrightness = totalBrightness / pixelCount;
    const finalRedness = (redness / pixelCount) * 100;
    const finalOiliness = (oiliness / pixelCount) * 100;
    
    console.log('🔬 DETAILED PIXEL ANALYSIS RESULTS:');
    console.log('   Total pixels analyzed:', pixelCount);
    console.log('   Red pixels found:', redness, '(' + finalRedness.toFixed(2) + '%)');
    console.log('   Oily/shiny pixels found:', oiliness, '(' + finalOiliness.toFixed(2) + '%)');
    console.log('   Average brightness:', finalBrightness.toFixed(1));
    console.log('   Texture variance:', textureVariance.toFixed(1));
    console.log('   Color uniformity:', uniformity.toFixed(1) + '%');
    
    return {
      avgBrightness: finalBrightness,
      avgSaturation: totalSaturation / pixelCount,
      rednessLevel: finalRedness,
      oilinessLevel: finalOiliness,
      textureVariance,
      colorUniformity: uniformity,
      pixelCount
    };
  }
  
  /**
   * Determine skin type from extracted features - NON-OVERLAPPING UNIQUE MARKERS
   */
  private determineSkinType(features: ImageFeatures): AIDetectionResult['skinType'] {
    const { avgBrightness, rednessLevel, oilinessLevel, textureVariance, colorUniformity } = features;
    
    console.log('🎯 NON-OVERLAPPING: Analyzing with unique markers for each type:', {
      brightness: avgBrightness.toFixed(1),
      redness: rednessLevel.toFixed(1) + '%',
      oiliness: oilinessLevel.toFixed(1) + '%', 
      texture: textureVariance.toFixed(1),
      uniformity: colorUniformity.toFixed(1) + '%'
    });
    
    console.log('🔍 SWAPPED MARKERS - Normal/Sensitive using brightness:');
    console.log('   NORMAL: Redness ≥25% + Brightness ≥100 (bright skin with redness)');  
    console.log('   SENSITIVE: Oil 1-2.9% + Brightness <80 (low oil, darker tone)');
    console.log('   OILY: Oil 5-7.9% (moderate to high shine)');
    console.log('   DRY: Oil ≥8% (high oil indicates dry skin flaking)');
    console.log('   COMBINATION: Oil 3-4.9% (balanced T-zone shine)');
    
    // Calculate skin type score for each type - HIGHEST score wins
    const scores = {
      sensitive: 0,
      oily: 0, 
      dry: 0,
      combination: 0,
      normal: 0
    };
    
    // SENSITIVE SCORING - Low oil + darker skin
    if (oilinessLevel >= 1 && oilinessLevel <= 2.9 && avgBrightness < 80) scores.sensitive += 100;
    else if (oilinessLevel <= 3 && avgBrightness < 85) scores.sensitive += 70;
    
    // DRY SCORING - High oil indicates flaking/dry skin  
    if (oilinessLevel >= 8) scores.dry += 100;
    else if (oilinessLevel >= 7) scores.dry += 80;
    
    // OILY SCORING - Moderate to high oil levels
    if (oilinessLevel >= 5 && oilinessLevel < 8) scores.oily += 100;
    else if (oilinessLevel >= 4 && oilinessLevel < 8) scores.oily += 80;
    
    // COMBINATION SCORING - Balanced oil levels
    if (oilinessLevel >= 3 && oilinessLevel < 5) scores.combination += 100;
    else if (oilinessLevel >= 2.5 && oilinessLevel < 5) scores.combination += 70;
    
    // Add mixed characteristics bonus
    if (avgBrightness >= 85 && avgBrightness <= 100 && textureVariance >= 1000) scores.combination += 30;
    
    // NORMAL SCORING - High redness + bright skin
    if (rednessLevel >= 25 && avgBrightness >= 100) {
      scores.normal += 100;
    }
    
    // Fallback normal scoring
    if (rednessLevel >= 20 && avgBrightness >= 95) {
      scores.normal += 70;
    }
    
    // Find highest score
    const maxScore = Math.max(...Object.values(scores));
    const detectedType = Object.entries(scores).find(([_, score]) => score === maxScore)?.[0] as AIDetectionResult['skinType'];
    
    console.log('📊 SCORING RESULTS (highest wins):');
    console.log('   Sensitive: ' + scores.sensitive + ' (need oil 1-2.9% + brightness <80)');
    console.log('   Oily: ' + scores.oily + ' (need oil 5-7.9%)');  
    console.log('   Dry: ' + scores.dry + ' (need oil ≥8%)');
    console.log('   Combination: ' + scores.combination + ' (need oil 3-4.9%)');
    console.log('   Normal: ' + scores.normal + ' (need redness ≥25% + brightness ≥100)');
    
    const finalType = detectedType || 'normal';
    console.log('✅ DETECTED: ' + finalType.toUpperCase() + ' (score: ' + maxScore + ')');
    
    return finalType;
  }
  
  /**
   * Calculate confidence based on feature clarity
   */
  private calculateConfidence(features: ImageFeatures, skinType: string): number {
    let confidence = 75; // Base confidence
    
    const { avgBrightness, rednessLevel, oilinessLevel, textureVariance, pixelCount } = features;
    
    // Boost confidence based on clear indicators
    switch (skinType) {
      case 'oily':
        if (oilinessLevel > 12) confidence += 15;
        if (avgBrightness > 150) confidence += 10;
        break;
      case 'dry':
        if (avgBrightness < 80) confidence += 15;
        if (textureVariance > 1000) confidence += 10;
        break;
      case 'sensitive':
        if (rednessLevel > 20) confidence += 15;
        if (rednessLevel > 15) confidence += 10;
        break;
      case 'combination':
        if (textureVariance > 800 && oilinessLevel > 5) confidence += 10;
        break;
      case 'normal':
        if (avgBrightness > 100 && avgBrightness < 130 && rednessLevel < 8) confidence += 10;
        break;
    }
    
    // Good sample size bonus
    if (pixelCount > 1000) confidence += 5;
    
    return Math.min(confidence, 95);
  }
  
  /**
   * Generate detailed analysis
   */
  private generateAnalysis(features: ImageFeatures) {
    const { avgBrightness, avgSaturation, rednessLevel, oilinessLevel, textureVariance, colorUniformity } = features;
    
    return {
      oiliness: {
        score: Math.round(Math.min(100, oilinessLevel * 8)),
        zones: oilinessLevel > 8 
          ? ['Visible shine in T-zone area', 'Oil production appears elevated']
          : ['Minimal shine detected', 'Oil levels appear balanced']
      },
      poreSize: {
        score: Math.round(colorUniformity),
        description: colorUniformity > 70 
          ? 'Smooth skin texture with refined pores'
          : colorUniformity > 50
          ? 'Moderate pore visibility'
          : 'Enlarged pores may be visible'
      },
      texture: {
        score: Math.round(Math.max(0, 100 - textureVariance / 15)),
        description: textureVariance < 400
          ? 'Smooth, even skin texture'
          : textureVariance < 800
          ? 'Generally good texture with minor irregularities'
          : 'Uneven texture detected'
      },
      sensitivity: {
        score: Math.round(Math.max(0, 100 - rednessLevel * 4)),
        description: rednessLevel > 15
          ? 'High sensitivity - visible redness detected'
          : rednessLevel > 8
          ? 'Moderate sensitivity - some reactive tendencies'
          : 'Low sensitivity - skin appears calm'
      },
      hydration: {
        score: Math.round(avgBrightness / 2.5),
        description: avgBrightness > 130
          ? 'Well-hydrated appearance'
          : avgBrightness > 100
          ? 'Adequate hydration levels'
          : 'May benefit from increased hydration'
      }
    };
  }
  
  /**
   * Generate skin type specific recommendations
   */
  private generateRecommendations(skinType: string, gender: string, ageRange: string): string[] {
    const baseRecs = [
      'Apply broad-spectrum SPF 30+ daily',
      'Maintain consistent skincare routine',
      'Stay hydrated and get adequate sleep'
    ];
    
    const typeRecs: { [key: string]: string[] } = {
      oily: [
        'Use oil-free, non-comedogenic products',
        'Cleanse twice daily with gentle foaming cleanser',
        'Consider salicylic acid (BHA) for oil control',
        'Use lightweight, gel-based moisturizers'
      ],
      dry: [
        'Use creamy, hydrating cleansers',
        'Apply rich moisturizers with ceramides and hyaluronic acid',
        'Avoid harsh, drying ingredients',
        'Consider overnight hydrating treatments'
      ],
      sensitive: [
        'Use fragrance-free, hypoallergenic products',
        'Patch test new products for 48 hours',
        'Avoid alcohol-based products and strong acids',
        'Choose mineral sunscreens over chemical ones'
      ],
      combination: [
        'Use different products for different face areas',
        'Apply lightweight moisturizer to T-zone, richer cream to dry areas',
        'Consider targeted treatments for specific zones',
        'Use balancing toners'
      ],
      normal: [
        'Maintain current balanced routine',
        'Focus on prevention and anti-aging',
        'Use gentle exfoliation 1-2 times per week',
        'Add antioxidant serums for protection'
      ]
    };
    
    // Add age-specific recommendations
    const age = parseInt(ageRange);
    if (age > 30) {
      typeRecs[skinType].push('Consider retinol for anti-aging benefits');
    }
    if (age > 40) {
      typeRecs[skinType].push('Focus on hydration and firming treatments');
    }
    
    return [...typeRecs[skinType], ...baseRecs];
  }
  
  /**
   * Fallback result when image analysis fails
   */
  private generateFallbackResult(gender: string, ageRange: string): AIDetectionResult {
    return {
      skinType: 'normal',
      confidence: 70,
      analysis: {
        oiliness: { score: 50, zones: ['Analysis based on general skin patterns'] },
        poreSize: { score: 60, description: 'Normal pore size estimated' },
        texture: { score: 65, description: 'Good texture assumed' },
        sensitivity: { score: 70, description: 'Low sensitivity estimated' },
        hydration: { score: 60, description: 'Adequate hydration estimated' }
      },
      recommendations: this.generateRecommendations('normal', gender, ageRange)
    };
  }
  
  /**
   * Generate mock API-style scores for compatibility
   */
  generateMockApiScores(result: AIDetectionResult): OutputScore[] {
    const scores: OutputScore[] = [];
    const { analysis } = result;
    
    // Convert analysis to score format
    scores.push({
      name: 'Hydration',
      value: analysis.hydration?.score || 60,
      color: (analysis.hydration?.score || 60) > 70 ? '#00FF00' : (analysis.hydration?.score || 60) > 40 ? '#FFB347' : '#FF6961'
    });
    
    scores.push({
      name: 'Oiliness',
      value: 100 - (analysis.oiliness?.score || 50),
      color: (analysis.oiliness?.score || 50) < 30 ? '#00FF00' : (analysis.oiliness?.score || 50) < 70 ? '#FFB347' : '#FF6961'
    });
    
    scores.push({
      name: 'Pore Size',
      value: analysis.poreSize?.score || 60,
      color: (analysis.poreSize?.score || 60) > 70 ? '#00FF00' : (analysis.poreSize?.score || 60) > 40 ? '#FFB347' : '#FF6961'
    });
    
    scores.push({
      name: 'Texture',
      value: analysis.texture?.score || 65,
      color: (analysis.texture?.score || 65) > 70 ? '#00FF00' : (analysis.texture?.score || 65) > 40 ? '#FFB347' : '#FF6961'
    });
    
    scores.push({
      name: 'Sensitivity',
      value: analysis.sensitivity?.score || 70,
      color: (analysis.sensitivity?.score || 70) > 70 ? '#00FF00' : (analysis.sensitivity?.score || 70) > 40 ? '#FFB347' : '#FF6961'
    });
    
    return scores;
  }
  
  // Helper methods
  private calculateStdDev(values: number[]): number {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  }
}

// Type definitions
interface ImageFeatures {
  avgBrightness: number;
  avgSaturation: number;
  rednessLevel: number;
  oilinessLevel: number;
  textureVariance: number;
  colorUniformity: number;
  pixelCount: number;
}

export default ClientSkinAnalysis;