import { OutputScore, Recommendation, AIDetectionResult } from './context';

export class Api {
  //DEV
  private clientKey: string = 'ORBO2E38D943A9CBB94D9BD8F4892F3A2GHNASKN';
  private baseUrl: string = 'https://dev.api.ghanaskinanalysis.orbo.tech/api';

  //PROD
  //private clientKey: string = 'ORBOC39FGG344A13F1E3835618249532552GC';
  //private baseUrl: string = '/api';

  private sessionApiUrl: string = `${this.baseUrl}/session/web/register`;
  private skinApiUrl: string = `${this.baseUrl}/web/skin`;
  private shareApiUrl: string = `${this.baseUrl}/share/web/reports`;

  // Method to get session id
  async getSessionId(): Promise<string> {
    const response = await fetch(`${this.sessionApiUrl}?clientkey=${this.clientKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        device: 'WEB',
        browser: 'asd',
      }),
    });

    const data = await response.json();
    if (data.success && data.statusCode === 200) {
      return data.data.session_id;
    } else {
      throw new Error('Failed to get session id');
    }
  }

  // 🎯 IMPROVED: Smart skin type detection using existing API
  async detectSkinType(
    sessionId: string,
    imageBlob: Blob,
    gender?: string,
    ageRange?: string
  ): Promise<AIDetectionResult> {
    
    console.log('🔬 Starting intelligent skin type detection...');
    
    try {
      // 🎯 STEP 1: Call existing API with placeholder skin type
      const apiResult = await this.callExistingApiForDetection(sessionId, imageBlob, gender, ageRange);
      
      // Log the actual scores to debug
      console.log('📊 Raw API Scores:', apiResult.scores);
      
      // 🎯 STEP 2: Analyze the scores to determine actual skin type
      const detectedSkinType = this.analyzeSkinTypeFromScores(apiResult.scores);
      
      // 🎯 STEP 3: Calculate confidence based on score patterns
      const confidence = this.calculateConfidenceFromScores(apiResult.scores, detectedSkinType);
      
      // 🎯 STEP 4: Build comprehensive analysis
      const analysis = this.buildAnalysisFromScores(apiResult.scores);
      
      // 🎯 STEP 5: Generate skin-type specific recommendations
      const recommendations = this.generateRecommendationsForDetectedType(detectedSkinType, apiResult.scores);
      
      const result: AIDetectionResult = {
        skinType: detectedSkinType,
        confidence: confidence,
        analysis: analysis,
        recommendations: recommendations
      };
      
      console.log('🎉 Successfully detected skin type:', result);
      return result;
      
    } catch (error) {
      console.error('❌ API-based detection failed:', error);
      throw new Error('Failed to detect skin type using existing API');
    }
  }

  // 🔧 Call existing API with strategic placeholder
  private async callExistingApiForDetection(
    sessionId: string,
    imageBlob: Blob,
    gender?: string,
    ageRange?: string
  ): Promise<{ scores: OutputScore[]; recommendations: Recommendation[]; fallbackProductImage: string }> {
    
    // Use "normal" as placeholder - API will analyze the actual image
    const placeholderSkinType = "normal";
    const placeholderName = "AI_Detection_Analysis";
    
    console.log('📡 Calling existing API for analysis...');
    
    // Use existing working method
    const result = await this.getSkinScoresAndRecommendations(
      sessionId,
      imageBlob,
      placeholderSkinType,
      gender || 'unspecified',
      ageRange || '25',
      placeholderName
    );
    
    // Log the raw scores immediately after receiving them
    console.log('📊 Raw API Scores received:', result.scores);
    console.log('📊 Number of scores:', result.scores.length);
    result.scores.forEach((score, i) => {
      const colorName = score.color === '#FF6961' ? '🔴 RED' : 
                       score.color === '#FFB347' ? '🟠 ORANGE' : 
                       score.color === '#00FF00' ? '🟢 GREEN' : '⚪ UNKNOWN';
      console.log(`  ${i}. ${score.name}: ${score.value} (${colorName})`);
    });
    
    return result;
  }

  // 🧠 IMPROVED ANALYSIS: Better skin type detection from scores
  private analyzeSkinTypeFromScores(scores: OutputScore[]): AIDetectionResult['skinType'] {
    
    console.log('🔍 Analyzing scores to detect skin type...');
    console.log('🔍 Number of scores received:', scores.length);
    
    // Log each score individually for better debugging
    scores.forEach((score, index) => {
      console.log(`Score ${index}: name="${score.name}", value=${score.value}, color="${score.color}"`);
    });
    
    // Create a map of all scores for easier access
    const scoreMap: { [key: string]: number } = {};
    scores.forEach(score => {
      scoreMap[score.name.toLowerCase()] = score.value;
    });
    
    console.log('📈 Score Map:', scoreMap);
    
    // Extract key indicators with more flexible matching
    const indicators = this.extractImprovedSkinIndicators(scores, scoreMap);
    
    console.log('📊 Extracted Indicators:', indicators);
    
    // 🎯 IMPORTANT: Understanding the scoring system from your API
    // RED (#FF6961) = Problems that need attention 
    // ORANGE (#FFB347) = Average/moderate 
    // GREEN (#00FF00) = Good (high scores = good)
    
    // Let's look for specific problem indicators from the actual scores
    const problemScores = scores.filter(s => s.color === '#FF6961'); // Red = needs attention
    const averageScores = scores.filter(s => s.color === '#FFB347'); // Orange = average
    const goodScores = scores.filter(s => s.color === '#00FF00'); // Green = good
    
    console.log('🔴 Problem areas (red):', problemScores.map(s => `${s.name}:${s.value}`));
    console.log('🟠 Average areas (orange):', averageScores.map(s => `${s.name}:${s.value}`));
    console.log('🟢 Good areas (green):', goodScores.map(s => `${s.name}:${s.value}`));
    
    // Get actual score values for ALL skin indicators
    const hydrationScore = scoreMap['hydration'] || scoreMap['moisture'] || 50;
    const oilScore = scoreMap['oiliness'] || scoreMap['oil'] || scoreMap['sebum'] || scoreMap['oil_level'] || 50;
    const rednessScore = scoreMap['redness'] || scoreMap['erythema'] || 50;
    const sensitivityScore = scoreMap['sensitivity'] || scoreMap['reactive'] || 50;
    const acneScore = scoreMap['acne'] || scoreMap['pimples'] || scoreMap['breakout'] || 50;
    const poreScore = scoreMap['pores'] || scoreMap['enlarged_pores'] || scoreMap['pore_size'] || 50;
    const drynessScore = scoreMap['dryness'] || scoreMap['dry_skin'] || scoreMap['dehydration'] || 50;
    const textureScore = scoreMap['texture'] || scoreMap['skin_texture'] || 50;
    const smoothnessScore = scoreMap['smoothness'] || 50;
    const firmnessScore = scoreMap['firmness'] || 50;
    const dullnessScore = scoreMap['skin_dullness'] || scoreMap['dullness'] || 50;
    
    console.log('📊 Critical skin type indicators:');
    console.log('  Hydration:', hydrationScore, hydrationScore > 80 ? '(excellent)' : hydrationScore > 60 ? '(good)' : hydrationScore > 40 ? '(moderate)' : '(poor)');
    console.log('  Oil/Sebum:', oilScore);
    console.log('  Dryness:', drynessScore);
    console.log('  Redness:', rednessScore, rednessScore > 80 ? '(no redness)' : rednessScore > 60 ? '(minimal)' : rednessScore > 40 ? '(some)' : '(significant)');
    console.log('  Acne:', acneScore, acneScore > 80 ? '(clear)' : acneScore > 60 ? '(minimal)' : acneScore > 40 ? '(some)' : '(problematic)');
    console.log('  Pores:', poreScore, poreScore > 80 ? '(refined)' : poreScore > 60 ? '(normal)' : poreScore > 40 ? '(visible)' : '(large)');
    console.log('  Texture:', textureScore);
    console.log('  Smoothness:', smoothnessScore);
    console.log('  Dullness:', dullnessScore);
    
    // 🎯 DRY SKIN DETECTION - FIRST PRIORITY
    // Check multiple dry skin indicators with more lenient thresholds
    const dryIndicators = [];
    
    // Check hydration - even moderate levels can indicate dryness
    if (hydrationScore < 60) dryIndicators.push('low_hydration');
    
    // Check for dryness/dehydration scores
    if (drynessScore > 40) dryIndicators.push('dryness_present');
    
    // Check texture and smoothness - dry skin often has poor texture
    if (textureScore < 60) dryIndicators.push('poor_texture');
    if (smoothnessScore < 60) dryIndicators.push('rough_skin');
    
    // Check dullness - dry skin is often dull
    if (dullnessScore < 60 || averageScores.some(s => s.name.toLowerCase().includes('dull'))) {
      dryIndicators.push('dull_skin');
    }
    
    // Check firmness - dry skin can lack firmness
    if (firmnessScore < 60) dryIndicators.push('poor_firmness');
    
    // Check for any RED dry-related problems
    const hasDryProblems = problemScores.some(s => {
      const name = s.name.toLowerCase();
      return name.includes('hydrat') || name.includes('moisture') || name.includes('dry') || 
             name.includes('flak') || name.includes('dehydrat') || name.includes('tight');
    });
    
    if (hasDryProblems) dryIndicators.push('red_dry_problems');
    
    // Check if multiple ORANGE scores suggest dryness
    const dryOrangeScores = averageScores.filter(s => {
      const name = s.name.toLowerCase();
      return name.includes('texture') || name.includes('smooth') || name.includes('firm') || 
             name.includes('dull') || name.includes('hydrat');
    });
    
    if (dryOrangeScores.length >= 2) dryIndicators.push('multiple_dry_averages');
    
    console.log('🏜️ Dry indicators found:', dryIndicators);
    
    // DETECT DRY SKIN if we have enough indicators
    if (dryIndicators.length >= 2 || 
        hydrationScore < 50 || 
        hasDryProblems ||
        (hydrationScore < 70 && textureScore < 60)) {
      console.log('✅ Detected: DRY skin (multiple dry indicators present)');
      return 'dry';
    }
    
    // 🎯 OILY SKIN DETECTION - SECOND PRIORITY
    const oilyIndicators = [];
    
    // Check oil levels
    if (oilScore > 60) oilyIndicators.push('high_oil');
    
    // Check pores - lower scores mean larger pores
    if (poreScore < 50) oilyIndicators.push('large_pores');
    
    // Check acne - lower scores mean more acne
    if (acneScore < 50) oilyIndicators.push('acne_present');
    
    // Check for RED oily problems
    const hasOilProblems = problemScores.some(s => {
      const name = s.name.toLowerCase();
      return name.includes('oil') || name.includes('sebum') || name.includes('pore') || 
             name.includes('acne') || name.includes('shine') || name.includes('blackhead');
    });
    
    if (hasOilProblems) oilyIndicators.push('red_oil_problems');
    
    // Check ORANGE scores for oil indicators
    const oilOrangeScores = averageScores.filter(s => {
      const name = s.name.toLowerCase();
      return name.includes('oil') || name.includes('pore') || name.includes('acne');
    });
    
    if (oilOrangeScores.length >= 1) oilyIndicators.push('oil_averages');
    
    console.log('💧 Oily indicators found:', oilyIndicators);
    
    // DETECT OILY SKIN
    if (oilyIndicators.length >= 2 || 
        hasOilProblems || 
        (acneScore < 40) || 
        (poreScore < 40) ||
        (oilScore > 70)) {
      console.log('✅ Detected: OILY skin (oil/pore/acne indicators present)');
      return 'oily';
    }
    
    // 🎯 SENSITIVE SKIN DETECTION - THIRD PRIORITY
    const sensitiveIndicators = [];
    
    // Check redness - lower scores mean more redness
    if (rednessScore < 60) sensitiveIndicators.push('has_redness');
    
    // Check sensitivity scores
    if (sensitivityScore < 60) sensitiveIndicators.push('is_sensitive');
    
    // Check for RED sensitive problems
    const hasSensitiveProblems = problemScores.some(s => {
      const name = s.name.toLowerCase();
      return name.includes('red') || name.includes('sensit') || name.includes('irritat') || 
             name.includes('inflam') || name.includes('react');
    });
    
    if (hasSensitiveProblems) sensitiveIndicators.push('red_sensitive_problems');
    
    // Check ORANGE scores for sensitivity
    const sensitiveOrangeScores = averageScores.filter(s => {
      const name = s.name.toLowerCase();
      return name.includes('red') || name.includes('sensit');
    });
    
    if (sensitiveOrangeScores.length >= 1) sensitiveIndicators.push('sensitive_averages');
    
    console.log('🌸 Sensitive indicators found:', sensitiveIndicators);
    
    // DETECT SENSITIVE SKIN
    if (sensitiveIndicators.length >= 2 || 
        hasSensitiveProblems || 
        (rednessScore < 40) || 
        (sensitivityScore < 40)) {
      console.log('✅ Detected: SENSITIVE skin (redness/sensitivity indicators present)');
      return 'sensitive';
    }
    
    // 🎯 COMBINATION SKIN DETECTION - FOURTH PRIORITY
    // Must have clear indicators of BOTH oily AND dry characteristics
    const hasOilyCharacteristics = oilyIndicators.length >= 1 || acneScore < 60 || poreScore < 60;
    const hasDryCharacteristics = dryIndicators.length >= 1 || hydrationScore < 70;
    
    if (hasOilyCharacteristics && hasDryCharacteristics) {
      console.log('✅ Detected: COMBINATION skin (both oily AND dry characteristics present)');
      return 'combination';
    }
    
    // Check for T-zone specific problems
    const hasTZoneProblems = scores.some(s => {
      const name = s.name.toLowerCase();
      return name.includes('t-zone') || name.includes('t_zone') || 
             (name.includes('forehead') && name.includes('oil'));
    });
    
    if (hasTZoneProblems) {
      console.log('✅ Detected: COMBINATION skin (T-zone specific issues)');
      return 'combination';
    }
    
    // 🎯 NORMAL SKIN DETECTION - LAST PRIORITY
    // Only if no major skin type issues detected
    console.log('✅ Detected: NORMAL skin (no significant skin type issues found)');
    return 'normal';
  }

  // 📊 IMPROVED: More flexible indicator extraction
  private extractImprovedSkinIndicators(scores: OutputScore[], scoreMap: { [key: string]: number }): {
    oiliness: number;
    hydration: number;
    pores: number;
    acne: number;
    sensitivity: number;
    redness: number;
    texture: number;
    irritation: number;
    sebum: number;
    dryness: number;
  } {
    
    // Try to find scores by exact name first, then by keywords
    const getScoreFlexible = (exactNames: string[], keywords: string[]): number => {
      // Check exact matches first
      for (const name of exactNames) {
        if (scoreMap[name] !== undefined) {
          return scoreMap[name];
        }
      }
      
      // Then check keyword matches
      for (const score of scores) {
        const scoreName = score.name.toLowerCase();
        for (const keyword of keywords) {
          if (scoreName.includes(keyword.toLowerCase())) {
            return score.value;
          }
        }
      }
      
      // Return neutral score if not found
      return 50;
    };
    
    return {
      oiliness: getScoreFlexible(
        ['oiliness', 'oil_level', 'sebum_level'],
        ['oil', 'sebum', 'shine', 'grease']
      ),
      hydration: getScoreFlexible(
        ['hydration', 'moisture', 'water_content'],
        ['hydrat', 'moisture', 'water']
      ),
      pores: getScoreFlexible(
        ['pores', 'pore_size', 'enlarged_pores'],
        ['pore', 'blackhead', 'comedone']
      ),
      acne: getScoreFlexible(
        ['acne', 'pimples', 'breakouts'],
        ['acne', 'pimple', 'breakout', 'blemish']
      ),
      sensitivity: getScoreFlexible(
        ['sensitivity', 'reactive_skin'],
        ['sensitiv', 'reactive']
      ),
      redness: getScoreFlexible(
        ['redness', 'inflammation', 'erythema'],
        ['red', 'inflam', 'irritat', 'erythema']
      ),
      texture: getScoreFlexible(
        ['texture', 'smoothness', 'skin_texture'],
        ['texture', 'smooth', 'rough', 'uneven']
      ),
      irritation: getScoreFlexible(
        ['irritation', 'inflamed'],
        ['irritat', 'inflam', 'reaction']
      ),
      sebum: getScoreFlexible(
        ['sebum', 'sebum_production'],
        ['sebum']
      ),
      dryness: getScoreFlexible(
        ['dryness', 'dry_skin', 'dehydration'],
        ['dry', 'dehydrat', 'flak']
      )
    };
  }

  // 🎯 Calculate confidence based on how clear the skin type indicators are
  private calculateConfidenceFromScores(scores: OutputScore[], detectedType: string): number {
    
    // Check color distribution
    const problemScores = scores.filter(s => s.color === '#FF6961');
    const goodScores = scores.filter(s => s.color === '#00FF00');
    const scoreMap: { [key: string]: number } = {};
    scores.forEach(score => {
      scoreMap[score.name.toLowerCase()] = score.value;
    });
    
    let confidence = 75; // Base confidence
    
    // Type-specific confidence boosters
    switch (detectedType) {
      case 'oily':
        // Check for strong oily indicators
        const hasOilProblems = problemScores.some(s => 
          s.name.toLowerCase().includes('oil') || 
          s.name.toLowerCase().includes('pore') ||
          s.name.toLowerCase().includes('acne')
        );
        if (hasOilProblems) confidence += 15;
        if (scoreMap['acne'] && scoreMap['acne'] < 30) confidence += 10;
        if (scoreMap['pores'] && scoreMap['pores'] < 30) confidence += 10;
        break;
        
      case 'dry':
        // Check for strong dry indicators
        const hasDryProblems = problemScores.some(s => 
          s.name.toLowerCase().includes('hydrat') || 
          s.name.toLowerCase().includes('dry')
        );
        if (hasDryProblems) confidence += 15;
        if (scoreMap['hydration'] && scoreMap['hydration'] < 30) confidence += 15;
        break;
        
      case 'sensitive':
        // Check for strong sensitive indicators
        const hasSensitiveProblems = problemScores.some(s => 
          s.name.toLowerCase().includes('red') || 
          s.name.toLowerCase().includes('sensit')
        );
        if (hasSensitiveProblems) confidence += 15;
        if (scoreMap['redness'] && scoreMap['redness'] < 30) confidence += 15;
        break;
        
      case 'combination':
        // Combination needs both oily and dry indicators
        const hasOilyAndDry = 
          problemScores.some(s => s.name.toLowerCase().includes('oil') || s.name.toLowerCase().includes('pore')) &&
          (scoreMap['hydration'] < 50 || problemScores.some(s => s.name.toLowerCase().includes('dry')));
        if (hasOilyAndDry) confidence += 10;
        break;
        
      case 'normal':
        // Normal skin should have mostly good scores
        if (goodScores.length > scores.length * 0.5) confidence += 10;
        if (problemScores.length === 0) confidence += 15;
        // Check that key indicators are balanced
        if (scoreMap['hydration'] > 70 && scoreMap['redness'] > 70) confidence += 10;
        break;
    }
    
    // Cap confidence at realistic levels
    return Math.min(Math.max(confidence, 65), 92);
  }

  // 🔬 Build detailed analysis from API scores  
  private buildAnalysisFromScores(scores: OutputScore[]) {
    
    const scoreMap: { [key: string]: number } = {};
    scores.forEach(score => {
      scoreMap[score.name.toLowerCase()] = score.value;
    });
    
    // Get actual scores or defaults
    const oilScore = scoreMap['oiliness'] || scoreMap['oil'] || scoreMap['sebum'] || 50;
    const poreScore = scoreMap['pores'] || scoreMap['enlarged_pores'] || 50;
    const textureScore = scoreMap['texture'] || 50;
    const sensitivityScore = scoreMap['sensitivity'] || scoreMap['reactive'] || 50;
    const hydrationScore = scoreMap['hydration'] || scoreMap['moisture'] || 50;
    
    return {
      oiliness: {
        score: Math.round(oilScore),
        zones: this.getOilinessZonesFromScore(oilScore)
      },
      poreSize: {
        score: Math.round(poreScore),
        description: this.getPoreDescriptionFromScore(poreScore)
      },
      texture: {
        score: Math.round(textureScore),
        description: this.getTextureDescriptionFromScore(textureScore)
      },
      sensitivity: {
        score: Math.round(sensitivityScore),
        description: this.getSensitivityDescriptionFromScore(sensitivityScore)
      },
      hydration: {
        score: Math.round(hydrationScore),
        description: this.getHydrationDescriptionFromScore(hydrationScore)
      }
    };
  }

  // Helper functions for generating descriptions
  private getOilinessZonesFromScore(score: number): string[] {
    if (score > 70) return ['T-zone shows excess oil production', 'Visible shine throughout the day', 'May need blotting papers'];
    if (score > 40) return ['T-zone has moderate oil', 'Some shine by midday', 'Generally balanced'];
    return ['Minimal oil production', 'No significant shine', 'May feel tight without moisturizer'];
  }

  private getPoreDescriptionFromScore(score: number): string {
    // Note: In many scoring systems, lower scores = more visible pores
    if (score < 30) return 'Large, clearly visible pores especially in T-zone and nose area - needs pore-minimizing care';
    if (score < 60) return 'Medium-sized pores, somewhat visible in central face areas';
    return 'Small, refined pores with good skin texture';
  }

  private getTextureDescriptionFromScore(score: number): string {
    if (score > 70) return 'Smooth, even texture with excellent skin quality';
    if (score > 40) return 'Generally good texture with minor irregularities';
    return 'Uneven texture that could benefit from exfoliation and resurfacing treatments';
  }

  private getSensitivityDescriptionFromScore(score: number): string {
    // Lower scores may indicate more sensitivity/redness
    if (score < 30) return 'High sensitivity detected - skin is reactive and needs gentle care';
    if (score < 60) return 'Moderate sensitivity - some reactive tendencies, use caution with new products';
    return 'Low sensitivity - skin appears resilient and tolerant to most products';
  }

  private getHydrationDescriptionFromScore(score: number): string {
    if (score > 80) return 'Excellent hydration - skin appears plump, dewy, and healthy';
    if (score > 60) return 'Good hydration levels - skin is well-moisturized';
    if (score > 40) return 'Moderate hydration - could benefit from hydrating products';
    return 'Poor hydration - skin appears dry, dull, and may feel tight';
  }

  // 💡 Generate targeted recommendations for detected skin type
  private generateRecommendationsForDetectedType(skinType: string, scores: OutputScore[]): string[] {
    
    const scoreMap: { [key: string]: number } = {};
    scores.forEach(score => {
      scoreMap[score.name.toLowerCase()] = score.value;
    });
    
    const problemScores = scores.filter(s => s.color === '#FF6961');
    const problemNames = problemScores.map(s => s.name.toLowerCase());
    
    const baseRecs = ['Apply broad-spectrum SPF 30-50 daily', 'Maintain consistent skincare routine'];
    
    switch (skinType) {
      case 'oily':
        const recommendations = [
          'Use oil-free, non-comedogenic products to prevent clogged pores',
          'Cleanse twice daily with a gentle foaming cleanser',
          'Use lightweight, gel-based moisturizers',
        ];
        
        // Add specific recommendations based on problems
        if (scoreMap['acne'] < 40 || problemNames.includes('acne')) {
          recommendations.push('Consider salicylic acid (BHA) for acne control');
          recommendations.push('Use benzoyl peroxide spot treatment for active breakouts');
        }
        if (scoreMap['pores'] < 40 || problemNames.includes('pore')) {
          recommendations.push('Use niacinamide serum to minimize pore appearance');
          recommendations.push('Weekly clay masks to deep clean pores');
        }
        
        return [...recommendations, ...baseRecs];
        
      case 'dry':
        const dryRecs = [
          'Use creamy, hydrating cleansers that don\'t strip natural oils',
          'Apply heavy moisturizers with ceramides and hyaluronic acid',
          'Layer hydrating serums under moisturizer',
        ];

        // Add specific recommendations based on severity
        if (scoreMap['hydration'] < 30) {
          dryRecs.push('Use overnight sleeping masks for intense hydration');
          dryRecs.push('Consider adding facial oils (rosehip, argan) to routine');
        }
        if (problemNames.includes('flak') || problemNames.includes('texture')) {
          dryRecs.push('Gentle exfoliation once weekly with lactic acid');
        }

        return [...dryRecs, ...baseRecs];

      case 'sensitive':
        const sensitiveRecs = [
          'Use fragrance-free, hypoallergenic products only',
          'Patch test all new products for 48 hours before full use',
          'Avoid harsh ingredients (alcohol, essential oils, strong acids)',
          'Use mineral sunscreen instead of chemical sunscreen',
        ];

        // Add specific recommendations based on problems
        if (scoreMap['redness'] < 40 || problemNames.includes('red')) {
          sensitiveRecs.push('Use centella asiatica or niacinamide for redness reduction');
          sensitiveRecs.push('Keep skincare routine minimal (cleanser, moisturizer, SPF)');
        }
        if (problemNames.includes('irritat')) {
          sensitiveRecs.push('Use products with soothing ingredients (aloe, oatmeal)');
        }

        return [...sensitiveRecs, ...baseRecs];

      case 'combination':
        const comboRecs = [
          'Use different products for different areas of your face',
          'Apply lightweight moisturizer to T-zone, richer cream to dry areas',
          'Use balancing toners to regulate oil production',
        ];

        // Add targeted recommendations
        const hasOilProblems = problemNames.some(n => n.includes('oil') || n.includes('pore'));
        const hasDryProblems = scoreMap['hydration'] < 50 || problemNames.some(n => n.includes('dry'));

        if (hasOilProblems) {
          comboRecs.push('Use BHA on oily T-zone areas only');
        }
        if (hasDryProblems) {
          comboRecs.push('Apply hydrating serums to dry cheek areas');
        }
        comboRecs.push('Multi-masking: clay mask on T-zone, hydrating mask on cheeks');

        return [...comboRecs, ...baseRecs];

      default: // normal
        const normalRecs = [
          'Maintain current balanced skincare routine',
          'Focus on prevention and anti-aging ingredients',
          'Use gentle exfoliation 1-2 times per week',
        ];

        // Add recommendations for any specific concerns
        if (problemNames.includes('dark_spot') || problemNames.includes('pigment')) {
          normalRecs.push('Use vitamin C serum for brightening and dark spot reduction');
          normalRecs.push('Consider niacinamide or kojic acid for pigmentation');
        }
        if (problemNames.includes('uneven')) {
          normalRecs.push('Use AHA exfoliants to improve skin texture and tone');
        }
        if (problemNames.includes('wrinkle')) {
          normalRecs.push('Add retinol/retinoid to evening routine for anti-aging');
        }

        return [...normalRecs, ...baseRecs];
    }
  }

  // Method to get skin scores and recommendations (EXISTING - NO CHANGES NEEDED)
  async getSkinScoresAndRecommendations(
    sessionId: string,
    imageBlob: Blob,
    skinType: string,
    gender: string,
    ageRange: string,
    name: string,
  ): Promise<{ scores: OutputScore[]; recommendations: Recommendation[]; fallbackProductImage: string }> {
    const formData = new FormData();
    formData.append('skin_type', skinType);
    formData.append('gender', gender);
    formData.append('age_range', ageRange);
    formData.append('session_id', sessionId);
    formData.append('name', name);
    formData.append('image', imageBlob, `cc-skin-analysis-${new Date().getTime()}.png`);

    const response = await fetch(`${this.skinApiUrl}?clientkey=${this.clientKey}`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    if (data.success && data.statusCode === 200) {
      return {
        fallbackProductImage: data.data.fallback_product_image,
        scores: data.data.output_score,
        recommendations: data.data.recommendations,
      };
    } else {
      throw new Error('Failed to get skin scores and recommendations');
    }
  }

  // Method to share report (EXISTING - NO CHANGES NEEDED)
  async shareReport(email: string, phone: string, sessionId: string, optForPromotions: boolean): Promise<string> {
    console.log('🚀 Starting shareReport process...');
    console.log('📧 Email:', email);
    console.log('📱 Phone:', phone);
    console.log('🔑 Session ID:', sessionId);
    console.log('🌐 API URL:', this.shareApiUrl);

    // Enhanced validation
    if (!email || !phone || !sessionId) {
        const error = 'Missing required fields for sharing report';
        console.error('❌ Validation Error:', error);
        throw new Error(error);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new Error('Invalid email format');
    }

    // Clean and validate phone number
    let cleanPhone = phone.trim();

    // Remove any spaces or dashes
    cleanPhone = cleanPhone.replace(/[\s-]/g, '');
    // Ensure it starts with +
    if (!cleanPhone.startsWith('+')) {
        throw new Error('Phone number must include country code (e.g., +233551234567 for Ghana)');
    }

    // Validate phone format
    const phoneRegex = /^\+\d{10,15}$/;
    if (!phoneRegex.test(cleanPhone)) {
        throw new Error('Invalid phone number format. Expected: +[country code][number]');
    }

    const requestBody = {
        email: email.trim(),
        phone: cleanPhone,
        session_id: sessionId,
        optForPromotions: optForPromotions
    };

    console.log('📤 Request payload:', JSON.stringify(requestBody, null, 2));

    try {
        const response = await fetch(`${this.shareApiUrl}?clientkey=${this.clientKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'User-Agent': 'SmartSkin-Africa-Web/1.0'
            },
            body: JSON.stringify(requestBody),
        });

        console.log('📥 Response status:', response.status);
        console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));

        // Always get response text first
        const responseText = await response.text();
        console.log('📥 Raw response:', responseText);

        let data;
        try {
            data = JSON.parse(responseText);
        } catch (parseError) {
            console.error('❌ Failed to parse response as JSON:', parseError);
            throw new Error(`Server returned invalid JSON. Status: ${response.status}. Response: ${responseText.substring(0, 200)}`);
        }

        if (response.ok && data.success && data.statusCode === 200) {
            console.log('✅ Report shared successfully!');
            const message = data.data?.message || data.message || 'Report shared successfully';
            console.log('📝 Success message:', message);
            return message;
        } else {
            // Enhanced error handling
            console.error('❌ API Error Details:');
            console.error('   HTTP Status:', response.status, response.statusText);
            console.error('   Success Flag:', data.success);
            console.error('   API Status Code:', data.statusCode);
            console.error('   Error Object:', data.error);
            console.error('   Full Response:', data);

            const errorMessage = data.error?.message ||
                               data.message ||
                               `ShareReport failed: ${response.status} ${response.statusText}`;

            throw new Error(errorMessage);
        }

    } catch (error) {
        console.error('❌ ShareReport network/API error:', error);

        // Better error messages for common issues
        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
            throw new Error('Cannot connect to the API server. Please check your internet connection and try again.');
        }

        if (error instanceof Error) {
            if (error.message.includes('401')) {
                throw new Error('API authentication failed. Please check your API key configuration.');
            }

            if (error.message.includes('404')) {
                throw new Error('API endpoint not found. The service might be temporarily unavailable.');
            }
        }
            throw error;
        }
    }}
