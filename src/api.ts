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

  // FIXED: Method to detect skin type from image with consistent results
  async detectSkinType(
    sessionId: string,
    imageBlob: Blob,
    _gender?: string,
    _ageRange?: string
  ): Promise<AIDetectionResult> {
    // For now, simulate the API call with CONSISTENT results based on image properties
    // Replace this with actual API call when ready
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Create a consistent "fingerprint" from the image blob to ensure same results for same image
    const imageSize = imageBlob.size;
    const imageType = imageBlob.type;
    
    // Create a consistent hash-like value from image properties
    const seedValue = (imageSize % 1000) + (imageType.length * 17) + (sessionId ? sessionId.length * 7 : 42);
    
    // Use this seed to create consistent "random" values
    const deterministicRandom = (seed: number, index: number = 0) => {
      const x = Math.sin(seed + index) * 10000;
      return x - Math.floor(x);
    };
    
    // Determine skin type based on consistent seed
    const skinTypeIndex = Math.floor(deterministicRandom(seedValue, 1) * 5);
    const skinTypes: AIDetectionResult['skinType'][] = ['normal', 'dry', 'oily', 'combination', 'sensitive'];
    const detectedSkinType = skinTypes[skinTypeIndex];
    
    // Generate consistent confidence (75-95% range)
    const confidence = Math.floor(deterministicRandom(seedValue, 2) * 20) + 75;
    
    // Generate consistent analysis scores
    const oilinessScore = Math.floor(deterministicRandom(seedValue, 3) * 100);
    const poreSizeScore = Math.floor(deterministicRandom(seedValue, 4) * 100);
    const textureScore = Math.floor(deterministicRandom(seedValue, 5) * 100);
    const sensitivityScore = Math.floor(deterministicRandom(seedValue, 6) * 100);
    const hydrationScore = Math.floor(deterministicRandom(seedValue, 7) * 100);
    
    // Create skin type specific analysis
    const getSkinTypeSpecificAnalysis = (skinType: AIDetectionResult['skinType']) => {
      switch (skinType) {
        case 'oily':
          return {
            oiliness: {
              score: Math.max(60, oilinessScore),
              zones: ['T-zone elevated', 'Cheeks elevated', 'Overall oily appearance']
            },
            poreSize: {
              score: Math.max(60, poreSizeScore),
              description: 'Large, visible pores throughout face, particularly prominent in T-zone'
            },
            texture: {
              score: Math.min(60, textureScore),
              description: 'Uneven texture with visible shine and enlarged pores'
            },
            sensitivity: {
              score: Math.min(40, sensitivityScore),
              description: 'Low sensitivity levels, skin tolerates most products well'
            },
            hydration: {
              score: Math.max(50, hydrationScore),
              description: 'Adequate hydration levels, though excess oil production is present'
            }
          };
        case 'dry':
          return {
            oiliness: {
              score: Math.min(30, oilinessScore),
              zones: ['Minimal oil production', 'Tight feeling areas', 'Overall dry appearance']
            },
            poreSize: {
              score: Math.min(40, poreSizeScore),
              description: 'Small, barely visible pores throughout face'
            },
            texture: {
              score: Math.min(50, textureScore),
              description: 'Rough texture with visible flaking and tight feeling'
            },
            sensitivity: {
              score: Math.max(60, sensitivityScore),
              description: 'Moderate to high sensitivity, prone to irritation'
            },
            hydration: {
              score: Math.min(40, hydrationScore),
              description: 'Low hydration levels detected, skin appears dull and tight'
            }
          };
        case 'combination':
          return {
            oiliness: {
              score: Math.floor((oilinessScore % 40) + 40), // 40-80 range
              zones: ['T-zone elevated', 'Cheeks normal to dry', 'Mixed oil distribution']
            },
            poreSize: {
              score: Math.floor((poreSizeScore % 40) + 40),
              description: 'Large pores in T-zone, smaller pores on cheeks and outer face'
            },
            texture: {
              score: Math.floor((textureScore % 40) + 40),
              description: 'Mixed texture - smooth in some areas, rougher in others'
            },
            sensitivity: {
              score: Math.floor((sensitivityScore % 40) + 30),
              description: 'Variable sensitivity - some areas more reactive than others'
            },
            hydration: {
              score: Math.floor((hydrationScore % 40) + 40),
              description: 'Variable hydration - adequate in oily zones, low in dry areas'
            }
          };
        case 'sensitive':
          return {
            oiliness: {
              score: Math.floor((oilinessScore % 60) + 20), // 20-80 range
              zones: ['Variable oil production', 'Reaction-prone areas', 'Inconsistent patterns']
            },
            poreSize: {
              score: Math.floor((poreSizeScore % 50) + 30),
              description: 'Variable pore size, often appear more prominent when irritated'
            },
            texture: {
              score: Math.min(50, textureScore),
              description: 'Uneven texture with areas of irritation and redness'
            },
            sensitivity: {
              score: Math.max(70, sensitivityScore),
              description: 'High sensitivity indicators detected, prone to reactions'
            },
            hydration: {
              score: Math.floor((hydrationScore % 50) + 30),
              description: 'Variable hydration levels, often disrupted by sensitivity reactions'
            }
          };
        case 'normal':
        default:
          return {
            oiliness: {
              score: Math.floor((oilinessScore % 40) + 30), // 30-70 range
              zones: ['Balanced oil production', 'Minimal excess or deficiency', 'Even distribution']
            },
            poreSize: {
              score: Math.floor((poreSizeScore % 40) + 30),
              description: 'Medium-sized pores, well-balanced throughout face'
            },
            texture: {
              score: Math.max(60, textureScore),
              description: 'Smooth, even texture with minimal imperfections'
            },
            sensitivity: {
              score: Math.min(40, sensitivityScore),
              description: 'Low sensitivity levels, skin tolerates most products well'
            },
            hydration: {
              score: Math.max(60, hydrationScore),
              description: 'Normal hydration levels, skin appears healthy and balanced'
            }
          };
      }
    };
    
    const analysis = getSkinTypeSpecificAnalysis(detectedSkinType);
    
    const mockResult: AIDetectionResult = {
      skinType: detectedSkinType,
      confidence: confidence,
      analysis: analysis,
      recommendations: [
        `Use products specifically formulated for ${detectedSkinType} skin`,
        'Apply broad-spectrum SPF daily to protect your skin',
        'Maintain a consistent skincare routine for best results',
        detectedSkinType === 'sensitive' ? 'Always patch test new products before full application' :
        detectedSkinType === 'oily' ? 'Use oil-free, non-comedogenic products' :
        detectedSkinType === 'dry' ? 'Focus on hydrating and moisturizing products' :
        detectedSkinType === 'combination' ? 'Use different products for different areas of your face' :
        'Maintain your current routine and protect from environmental damage'
      ]
    };

    // Log for debugging - this will show the same result for the same image
    console.log('AI Detection Result (should be consistent for same image):', {
      seedValue,
      detectedSkinType,
      confidence,
      imageSize,
      sessionId: sessionId.substring(0, 8) + '...'
    });

    /* Uncomment this when actual API is ready:
    const formData = new FormData();
    formData.append('session_id', sessionId);
    formData.append('image', imageBlob, `skin-type-detection-${new Date().getTime()}.png`);
    
    if (gender) formData.append('gender', gender);
    if (ageRange) formData.append('age_range', ageRange);

    const response = await fetch(`${this.skinTypeDetectionUrl}?clientkey=${this.clientKey}`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    if (data.success && data.statusCode === 200) {
      return {
        skinType: data.data.skin_type,
        confidence: data.data.confidence,
        analysis: data.data.analysis,
        recommendations: data.data.recommendations || []
      };
    } else {
      throw new Error(data.error?.message || 'Failed to detect skin type');
    }
    */

    return mockResult;
  }

  // Method to get skin scores and recommendations
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

  // Method to share report
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