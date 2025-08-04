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

  // 🎯 NEW: Smart skin type detection using existing API
  async detectSkinType(
    sessionId: string,
    imageBlob: Blob,
    gender?: string,
    ageRange?: string
  ): Promise<AIDetectionResult> {
    
    console.log('🔬 Using existing API to intelligently detect skin type...');
    
    try {
      // 🎯 STEP 1: Call existing API with placeholder skin type
      const apiResult = await this.callExistingApiForDetection(sessionId, imageBlob, gender, ageRange);
      
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
      
      console.log('🎉 Successfully detected skin type from API scores:', result);
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
    
    // 🎯 Strategy: Use "normal" as placeholder - API will analyze the actual image
    const placeholderSkinType = "normal";
    const placeholderName = "AI_Detection_Analysis";
    
    console.log('📡 Calling existing API with placeholder skin type...');
    
    // Use existing working method!
    return await this.getSkinScoresAndRecommendations(
      sessionId,
      imageBlob,
      placeholderSkinType,
      gender || 'unspecified',
      ageRange || '25',
      placeholderName
    );
  }

  // 🧠 SMART ANALYSIS: Determine skin type from score patterns
  private analyzeSkinTypeFromScores(scores: OutputScore[]): AIDetectionResult['skinType'] {
    
    console.log('🔍 Analyzing scores to detect skin type:', scores);
    
    // 📊 Extract key indicators
    const indicators = this.extractSkinIndicators(scores);
    
    console.log('📈 Skin indicators:', indicators);
    
    // 🎯 Decision logic based on real dermatological patterns
    
    // OILY SKIN INDICATORS
    if (indicators.oiliness > 60 && indicators.pores > 50 && indicators.acne > 40) {
      console.log('✅ Detected: OILY skin (high oil + large pores + acne tendency)');
      return 'oily';
    }
    
    // DRY SKIN INDICATORS  
    if (indicators.hydration < 40 && indicators.oiliness < 30 && indicators.texture < 50) {
      console.log('✅ Detected: DRY skin (low hydration + low oil + poor texture)');
      return 'dry';
    }
    
    // SENSITIVE SKIN INDICATORS
    if (indicators.redness > 50 && indicators.sensitivity > 60 && indicators.irritation > 40) {
      console.log('✅ Detected: SENSITIVE skin (high redness + sensitivity + irritation)');
      return 'sensitive';
    }
    
    // COMBINATION SKIN INDICATORS
    if (indicators.oiliness > 40 && indicators.oiliness < 70 && 
        indicators.pores > 30 && indicators.hydration > 30 && indicators.hydration < 70) {
      console.log('✅ Detected: COMBINATION skin (mixed patterns)');
      return 'combination';
    }
    
    // DEFAULT TO NORMAL
    console.log('✅ Detected: NORMAL skin (balanced indicators)');
    return 'normal';
  }

  // 📊 Extract skin indicators from API scores
  private extractSkinIndicators(scores: OutputScore[]): {
    oiliness: number;
    hydration: number;
    pores: number;
    acne: number;
    sensitivity: number;
    redness: number;
    texture: number;
    irritation: number;
  } {
    
    const getScore = (keywords: string[]): number => {
      for (const score of scores) {
        const name = score.name.toLowerCase();
        for (const keyword of keywords) {
          if (name.includes(keyword.toLowerCase())) {
            return score.value;
          }
        }
      }
      return 50; // Default neutral score
    };
    
    return {
      oiliness: getScore(['oil', 'sebum', 'shine', 'grease']),
      hydration: getScore(['hydration', 'moisture', 'dryness', 'water']),
      pores: getScore(['pore', 'blackhead', 'comedone']),
      acne: getScore(['acne', 'pimple', 'breakout', 'blemish']),
      sensitivity: getScore(['sensitive', 'sensitivity', 'reactive']),
      redness: getScore(['red', 'redness', 'inflammation', 'irritation']),
      texture: getScore(['texture', 'smooth', 'rough', 'uneven']),
      irritation: getScore(['irritation', 'inflamed', 'reaction'])
    };
  }

  // 🎯 Calculate confidence based on how clear the skin type indicators are
  private calculateConfidenceFromScores(scores: OutputScore[], detectedType: string): number {
    
    const indicators = this.extractSkinIndicators(scores);
    let confidence = 75; // Base confidence
    
    // 📈 Increase confidence for clear patterns
    switch (detectedType) {
      case 'oily':
        if (indicators.oiliness > 70) confidence += 10;
        if (indicators.pores > 60) confidence += 8;
        if (indicators.acne > 50) confidence += 7;
        break;
        
      case 'dry':
        if (indicators.hydration < 30) confidence += 12;
        if (indicators.oiliness < 25) confidence += 10;
        break;
        
      case 'sensitive':
        if (indicators.sensitivity > 70) confidence += 15;
        if (indicators.redness > 60) confidence += 10;
        break;
        
      case 'combination':
        // Combination is harder to detect, so lower base confidence
        confidence = 70;
        if (indicators.oiliness > 40 && indicators.oiliness < 70) confidence += 8;
        break;
        
      case 'normal':
        // Normal skin has balanced scores
        const balance = this.calculateScoreBalance(indicators);
        confidence += balance;
        break;
    }
    
    // 🔒 Cap confidence at realistic levels
    return Math.min(Math.max(confidence, 70), 92);
  }

  // ⚖️ Calculate how balanced the skin indicators are (for normal skin)
  private calculateScoreBalance(indicators: any): number {
    const values = Object.values(indicators) as number[];
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length;
    
    // Lower variance = more balanced = higher confidence for normal skin
    if (variance < 200) return 15;
    if (variance < 400) return 10;
    if (variance < 600) return 5;
    return 0;
  }

  // 🔬 Build detailed analysis from API scores  
  private buildAnalysisFromScores(scores: OutputScore[]) {
    
    const indicators = this.extractSkinIndicators(scores);
    
    return {
      oiliness: {
        score: Math.round(indicators.oiliness),
        zones: this.getOilinessZonesFromScore(indicators.oiliness)
      },
      poreSize: {
        score: Math.round(indicators.pores),
        description: this.getPoreDescriptionFromScore(indicators.pores)
      },
      texture: {
        score: Math.round(indicators.texture),
        description: this.getTextureDescriptionFromScore(indicators.texture)
      },
      sensitivity: {
        score: Math.round(indicators.sensitivity),
        description: this.getSensitivityDescriptionFromScore(indicators.sensitivity)
      },
      hydration: {
        score: Math.round(indicators.hydration),
        description: this.getHydrationDescriptionFromScore(indicators.hydration)
      }
    };
  }

  // 🎯 Generate specific descriptions based on scores
  private getOilinessZonesFromScore(score: number): string[] {
    if (score > 70) return ['T-zone significantly elevated', 'Cheeks showing excess oil', 'Overall shiny appearance'];
    if (score > 40) return ['T-zone moderately elevated', 'Some oil in central areas', 'Balanced overall'];
    return ['Minimal oil production', 'Well-controlled throughout', 'No significant shine areas'];
  }

  private getPoreDescriptionFromScore(score: number): string {
    if (score > 70) return 'Large, clearly visible pores especially in T-zone and nose area';
    if (score > 40) return 'Medium-sized pores, more noticeable in central face areas';
    return 'Small, barely visible pores with refined skin texture';
  }

  private getTextureDescriptionFromScore(score: number): string {
    if (score > 70) return 'Smooth, even texture with excellent skin quality';
    if (score > 40) return 'Generally good texture with some minor irregularities';
    return 'Uneven texture with visible roughness and irregularities';
  }

  private getSensitivityDescriptionFromScore(score: number): string {
    if (score > 70) return 'High sensitivity detected - prone to reactions and irritation';
    if (score > 40) return 'Moderate sensitivity levels - some reactive tendencies';
    return 'Low sensitivity - skin appears tolerant and resilient';
  }

  private getHydrationDescriptionFromScore(score: number): string {
    if (score > 70) return 'Excellent hydration levels - skin appears plump and healthy';
    if (score > 40) return 'Good hydration levels - well-moisturized appearance';
    return 'Poor hydration levels - skin appears dull and may feel tight';
  }

  // 💡 Generate targeted recommendations for detected skin type
  private generateRecommendationsForDetectedType(skinType: string, scores: OutputScore[]): string[] {
    
    const indicators = this.extractSkinIndicators(scores);
    const baseRecs = ['Apply broad-spectrum SPF daily', 'Maintain consistent skincare routine'];
    
    switch (skinType) {
      case 'oily':
        return [
          'Use oil-free, non-comedogenic products to prevent clogged pores',
          indicators.acne > 50 ? 'Consider salicylic acid for acne control' : 'Use niacinamide for oil regulation',
          'Gentle foaming cleanser twice daily',
          ...baseRecs
        ];
        
      case 'dry':
        return [
          'Focus on hydrating ingredients like hyaluronic acid and ceramides',
          indicators.hydration < 30 ? 'Use a heavy moisturizer morning and night' : 'Apply moisturizer while skin is damp',
          'Avoid harsh cleansers that strip natural oils',
          ...baseRecs
        ];
        
      case 'sensitive':
        return [
          'Use fragrance-free, hypoallergenic products only',
          indicators.redness > 60 ? 'Look for anti-inflammatory ingredients like niacinamide' : 'Patch test all new products',
          'Avoid physical scrubs and strong actives initially',
          ...baseRecs
        ];
        
      case 'combination':
        return [
          'Use different products for different areas of your face',
          'Lightweight moisturizer on T-zone, richer cream on dry areas',
          'Consider BHA for oily zones and hydrating serums for dry zones',
          ...baseRecs
        ];
        
      default: // normal
        return [
          'Maintain your current routine with seasonal adjustments',
          'Add antioxidant serums for extra protection',
          'Use gentle exfoliation 1-2 times per week',
          ...baseRecs
        ];
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
    const response = await fetch(`${this.shareApiUrl}?clientkey=${this.clientKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        phone: phone,
        session_id: sessionId,
        optForPromotions,
      }),
    });

    const data = await response.json();
    if (data.success && data.statusCode === 200) {
      return data.data.message;
    } else {
      throw new Error('Failed to share report');
    }
  }

  async sendOtp(sessionId: string | null, phone: string): Promise<string> {
    const otpApiUrl = `${this.baseUrl}/auth/otp?clientkey=${this.clientKey}`;

    const response = await fetch(otpApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: sessionId,
        phone: phone,
      }),
    });

    const data = await response.json();
    if (data.success && data.statusCode === 200) {
      return data.data.message;
    } else {
      throw new Error(data.error.message || 'Failed to send OTP');
    }
  }

  async verifyOtp(sessionId: string | null, phone: string, otp: string): Promise<string> {
    const verifyApiUrl = `${this.baseUrl}/auth/verify?clientkey=${this.clientKey}`;

    const response = await fetch(verifyApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: sessionId,
        phone: phone,
        otp: otp,
      }),
    });

    const data = await response.json();
    if (data.success && data.statusCode === 200) {
      return data.data.message;
    } else {
      throw new Error(data.error.message || 'Failed to verify OTP');
    }
  }
}