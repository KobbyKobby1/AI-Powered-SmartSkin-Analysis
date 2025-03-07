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
  clear: () => void;
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
  const clear = () => {
    setSessionId(null);
    setUserInfo({
      name: '',
      age: '45+',
      skin: '',
      gender: '',
      phone: '',
      email: '',
    });
    setCapturedPic(null);
    setFallbackProductImage('');
    setOutputScore([]);
    setOutputScore([]);
    setRecommendations([]);
    setView('Questionnaire');
  };

  useEffect(() => {
    const rootDiv = document.getElementById('orbo-cc-skin-analyzer-container');
    // const topBox = document.createElement('div');
    // const bottomBox = document.createElement('div');
    if (rootDiv) {
      if (view === 'Details') {
        // if (window.innerWidth <= 768) {
        //     rootDiv.style.backgroundImage = 'url("https://client-skincare-products.s3.ap-south-1.amazonaws.com/face-shop/home_screen_mobile.png")';
        // } else {
        //     rootDiv.style.backgroundImage = 'url("https://client-skincare-products.s3.ap-south-1.amazonaws.com/face-shop/home_screen_web.png")';
        // }
      } else if (view === 'HomePage') {
        // topBox.style.position = 'absolute';
        // topBox.style.top = '0';
        // topBox.style.left = '0';
        // topBox.style.width = '100%';
        // topBox.style.height = '22.477px';
        // topBox.style.backgroundColor = '#547D5B';
        // bottomBox.style.position = 'absolute';
        // bottomBox.style.bottom = '0';
        // bottomBox.style.left = '0';
        // bottomBox.style.width = '100%';
        // bottomBox.style.height = '22.477px';
        // bottomBox.style.backgroundColor = '#547D5B';
        // rootDiv.appendChild(topBox);
        // rootDiv.appendChild(bottomBox);
      } else {
        rootDiv.style.backgroundImage = 'none';
      }
    }

    return () => {
      // if (rootDiv) {
      //     if (topBox) topBox.remove();
      //     if (bottomBox) bottomBox.remove();
      // }
    };
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
