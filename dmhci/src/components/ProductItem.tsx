import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { ItemDetails } from '../constants/types';
import { AirbnbRating } from 'react-native-ratings';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteStackParamList } from '../../App';

type ProductItemProps = {
  id:number;
  image: string;
  title: string;
  description: string;
  price: number;
  priceBeforeDeal: number;
  priceOff: number;
  stars: number;
  itemDetails: ItemDetails;
};

const ProductItem: React.FC<ProductItemProps> = ({
  id,
  image,
  title,
  description,
  price,
  priceBeforeDeal,
  priceOff,
  stars,
  itemDetails,
}) => {
  const navigation = useNavigation<StackNavigationProp<RouteStackParamList, 'ProductDetails'>>();
  
  const NavigateToProductsDetails = () => {
    navigation.navigate('ProductDetails', { itemDetails });
  };

  return (
    <TouchableOpacity
      className="w-60 bg-white rounded-lg"
      onPress={NavigateToProductsDetails}>
      <Image source={{ uri: image }} className="w-full rounded-t-lg h-36" />
      <View className="px-1">
        <Text className="text-xl text-black-100 my-1 text-start font-bold">
          {title}
        </Text>
        <Text className="text-lg text-black-100/50 text-start font-medium">
          {description}
        </Text>
        <Text className="text-black-100 font-bold text-xl text-start">
          ${price}
        </Text>
        <View className="flex flex-row items-center gap-x-2">
          <Text className="text-black-100/50 font-thin text-lg line-through text-start">
            {priceBeforeDeal}
          </Text>
          <Text className="text-action font-thin text-lg">
            {priceOff}
          </Text>
        </View>
        <View className="flex flex-row items-center mb-2">
          <AirbnbRating
            count={stars}
            reviews={['Slabo', 'Loše', 'Okej', 'Dobro', 'Odlično']}
            defaultRating={stars}
            size={15}
            ratingContainerStyle={{ flexDirection: 'row' }}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProductItem;
