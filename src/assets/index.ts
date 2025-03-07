// const ASSETS_BASE_PATH = "./images";
const ASSETS_BASE_PATH = 'https://client-skincare-products.s3.ap-south-1.amazonaws.com/setu/assets';

export const assets = {
  normalSkinIcon: `${ASSETS_BASE_PATH}/normalSkin.png`,
  drySkinIcon: `${ASSETS_BASE_PATH}/DrySkin.png`,
  combinationSkinIcon: `${ASSETS_BASE_PATH}/CombinationSkin.png`,
  oilySkinIcon: `${ASSETS_BASE_PATH}/oilyskin.png`,
  sensitiveSkinIcon: `${ASSETS_BASE_PATH}/SensitiveSkin.png`,
  // maleIcon: `${ASSETS_BASE_PATH}/male.svg`,
  // femaleIcon: `${ASSETS_BASE_PATH}/female.svg`,
  model1: `${ASSETS_BASE_PATH}/model1.png`,
  logo1: `${ASSETS_BASE_PATH}/logo1.png`,
  maleIcon: `${ASSETS_BASE_PATH}/male.png`,
  femaleIcon: `${ASSETS_BASE_PATH}/female.png`,
  cameraIcon: `${ASSETS_BASE_PATH}/camera.svg`,
  uploadIcon: `${ASSETS_BASE_PATH}/upload.svg`,
  model_home: `${ASSETS_BASE_PATH}/model_home.png`,
};

import modelAsset from './model_ghana.png';
import logoAsset from './logo.png';
import maleIconAsset from './male.png';
import femaleIconAsset from './female.png';
import beautyGptAsset from './model_aboutus.jpg';
import recommendAsset from './easeofuse.jpg';
import skinResultAsset from './skin-results.png';
import howItWorksAsset from './skinWorking.jpg';
import heroImgAsset from './model-hero-2.png';

import model30 from './models/model_30.jpg';
import model31 from './models/model_31.jpg';
import model32 from './models/model_32.jpg';
import model33 from './models/model_33.jpg';
import model34 from './models/model_34.jpg';
import model35 from './models/model_35.jpg';
import model36 from './models/model_36.jpg';
import model37 from './models/model_37.jpg';

export interface AssetType {
  src: string;
  height: number;
  width: number;
  blurDataURL: string;
  blurWidth: number;
  blurHeight: number;
}

const model: AssetType = modelAsset as unknown as AssetType;
const logo: AssetType = logoAsset as unknown as AssetType;
const maleIcon: AssetType = maleIconAsset as unknown as AssetType;
const femaleIcon: AssetType = femaleIconAsset as unknown as AssetType;
const beautyGpt: AssetType = beautyGptAsset as unknown as AssetType;
const recommend: AssetType = recommendAsset as unknown as AssetType;
const skinResult: AssetType = skinResultAsset as unknown as AssetType;
const howItWorks: AssetType = howItWorksAsset as unknown as AssetType;
const heroImg: AssetType = heroImgAsset as unknown as AssetType;

const model0: AssetType = model30 as unknown as AssetType;
const model1: AssetType = model31 as unknown as AssetType;
const model2: AssetType = model32 as unknown as AssetType;
const model3: AssetType = model33 as unknown as AssetType;
const model4: AssetType = model34 as unknown as AssetType;
const model5: AssetType = model35 as unknown as AssetType;
const model6: AssetType = model36 as unknown as AssetType;
const model7: AssetType = model37 as unknown as AssetType;

export {
  model,
  logo,
  maleIcon,
  femaleIcon,
  beautyGpt,
  recommend,
  skinResult,
  howItWorks,
  heroImg,
  model0,
  model1,
  model2,
  model3,
  model4,
  model5,
  model6,
  model7,
};
