import {ImageSourcePropType} from 'react-native';



type SplashTypes = {
  image: ImageSourcePropType;
  title: string;
  description: string;
};

type FeaturesTypes = {
  image: string;
  title: string;
};
type ItemDetails = ProductTypes;
type ProductTypes = {
  image: string;
  status?: {
    icon?: string;
    name?: string;
  };
  brand?:string;
  _id: string;
  title: string;
  description: string;
  price: number;
  priceBeforeDeal: number;
  stars: number;
  ukSide?: string[] | number[];
  priceOff: number; // Opciono
  numberOfReview?: number; // Opciono
  itemDetails?: ProductTypes; // Opciono
};
type TabBarTypes = {
  title?: string;
  image: string;
  link: string;
  inActiveColor: string;
  activeColor: string;
  inActiveBGColor?: string;
  activeBGColor?: string;
};

export type {
  SplashTypes,
  FeaturesTypes,
  ProductTypes,
  TabBarTypes,
  ItemDetails,
};
