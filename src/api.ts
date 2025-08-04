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

  // NEW: Method to detect skin type from image
  async detectSkinType(
    _sessionId: string,
    _imageBlob: Blob,
    _gender?: string,
    _ageRange?: string
  ): Promise<AIDetectionResult> {
    // For now, simulate the API call since the endpoint might not exist yet
    // Replace this with actual API call when ready
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock realistic results based on common skin type distributions
    const mockSkinTypes: AIDetectionResult['skinType'][] = ['combination', 'oily', 'normal', 'dry', 'sensitive'];
    const randomSkinType = mockSkinTypes[Math.floor(Math.random() * mockSkinTypes.length)];
    
    const mockResult: AIDetectionResult = {
      skinType: randomSkinType,
      confidence: Math.floor(Math.random() * 20) + 80, // 80-99% confidence
      analysis: {
        oiliness: {
          score: Math.floor(Math.random() * 100),
          zones: randomSkinType === 'combination' 
            ? ['T-zone elevated', 'Cheeks normal'] 
            : randomSkinType === 'oily' 
            ? ['Overall elevated'] 
            : ['Minimal throughout']
        },
        poreSize: {
          score: Math.floor(Math.random() * 100),
          description: randomSkinType === 'oily' 
            ? 'Large, visible pores throughout face'
            : randomSkinType === 'dry'
            ? 'Small, barely visible pores'
            : 'Medium-sized pores, more visible in T-zone'
        },
        texture: {
          score: Math.floor(Math.random() * 100),
          description: randomSkinType === 'sensitive'
            ? 'Uneven texture with areas of irritation'
            : randomSkinType === 'normal'
            ? 'Smooth, even texture throughout'
            : 'Generally smooth with some areas of concern'
        },
        sensitivity: {
          score: Math.floor(Math.random() * 100),
          description: randomSkinType === 'sensitive'
            ? 'High sensitivity indicators detected'
            : randomSkinType === 'normal'
            ? 'Low sensitivity, well-tolerated skin'
            : 'Moderate sensitivity levels'
        },
        hydration: {
          score: Math.floor(Math.random() * 100),
          description: randomSkinType === 'dry'
            ? 'Low hydration levels detected'
            : randomSkinType === 'oily'
            ? 'Adequate hydration with excess oil production'
            : 'Normal hydration levels'
        }
      },
      recommendations: [
        `Use products suitable for ${randomSkinType} skin`,
        'Apply broad-spectrum SPF daily',
        'Maintain consistent skincare routine'
      ]
    };

    // Uncomment this when actual API is ready:
    /*
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