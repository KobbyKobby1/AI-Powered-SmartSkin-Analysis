import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface UserInfo {
  name: string;
  age: string;
  skin: string;
  gender: string;
  email: string;
  phone: string;
}

export interface OutputScore {
  name: string;
  color: string;
  value: number;
}

export interface Product {
  cat_sku_code: string;
  name: string;
  image_url: string;
  product_type: string;
  price: number;
  is_image_available: boolean;
  variant_id: string;
  description: string;
  product_url: string
}

export interface Recommendation {
  name: string;
  count: number;
  products: Product[];
}

// New interface for AI detection results
export interface AIDetectionResult {
  skinType: 'normal' | 'dry' | 'oily' | 'combination' | 'sensitive';
  confidence: number;
  analysis: {
    oiliness: { score: number; zones: string[] };
    poreSize: { score: number; description: string };
    texture: { score: number; description: string };
    sensitivity: { score: number; description: string };
    hydration?: { score: number; description: string };
  };
  recommendations?: string[];
}

interface Snackbar {
  snackbarOpen: boolean;
  snackbarMessage: string;
  snackbarSeverity: 'success' | 'error' | 'warning' | 'info';
}

interface ViewType {
  view: string;
  setView: (view: string) => void;
  sessionId: string | null;
  setSessionId: (sessionId: string | null) => void;
  userInfo: UserInfo;
  setUserInfo: (userInfo: UserInfo) => void;
  fallbackProductImage: string;
  setFallbackProductImage: (image: string) => void;
  outputScore: OutputScore[];
  setOutputScore: (scores: OutputScore[]) => void;
  recommendations: Recommendation[];
  setRecommendations: (recs: Recommendation[]) => void;
  capturedPic: Blob | null;
  setCapturedPic: (pic: Blob | null) => void;
  snackbar: Snackbar | null;
  setSnackbar: (snackbar: Snackbar | null) => void;
  // New properties for AI detection flow
  aiDetectionResult: AIDetectionResult | null;
  setAiDetectionResult: (result: AIDetectionResult | null) => void;
  userKnowsSkinType: boolean | null;
  setUserKnowsSkinType: (knows: boolean | null) => void;
  clear: () => void;
  gender?: string;
}

const Context = createContext<ViewType | undefined>(undefined);

export const ViewProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [view, setView] = useState<string>('Gender');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    age: '22',
    skin: '',
    gender: '',
    phone: '',
    email: '',
  });
  const [fallbackProductImage, setFallbackProductImage] = useState<string>('');
  const [outputScore, setOutputScore] = useState<OutputScore[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [capturedPic, setCapturedPic] = useState<Blob | null>(null);
  const [snackbar, setSnackbar] = useState<Snackbar | null>(null);
  
  // New states for AI detection flow
  const [aiDetectionResult, setAiDetectionResult] = useState<AIDetectionResult | null>(null);
  const [userKnowsSkinType, setUserKnowsSkinType] = useState<boolean | null>(null);

  const clear = () => {
    setSessionId(null);
    setUserInfo({
      name: '',
      age: '22',
      skin: '',
      gender: '',
      phone: '',
      email: '',
    });
    setCapturedPic(null);
    setFallbackProductImage('');
    setOutputScore([]);
    setRecommendations([]);
    setAiDetectionResult(null);
    setUserKnowsSkinType(null);
    setView('Gender');
  };

  useEffect(() => {
    const rootDiv = document.getElementById('orbo-cc-skin-analyzer-container');
    if (rootDiv) {
      if (view === 'Details') {
        // Add any specific styling for details view if needed
      } else if (view === 'HomePage') {
        // Add any specific styling for home page if needed
      } else {
        rootDiv.style.backgroundImage = 'none';
      }
    }
  }, [view]);

  return (
    <Context.Provider
      value={{
        view,
        setView,
        sessionId,
        setSessionId,
        userInfo,
        setUserInfo,
        fallbackProductImage,
        setFallbackProductImage,
        outputScore,
        setOutputScore,
        recommendations,
        setRecommendations,
        capturedPic,
        setCapturedPic,
        snackbar,
        setSnackbar,
        aiDetectionResult,
        setAiDetectionResult,
        userKnowsSkinType,
        setUserKnowsSkinType,
        clear,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useView = (): ViewType => {
  const context = useContext(Context);
  if (!context) {
    throw new Error('useView must be used within a ViewProvider');
  }
  return context;
};