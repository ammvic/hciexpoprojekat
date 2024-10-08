import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RouteTabsParamList } from '../screens/HomeScreen';
import { ProductTypes } from '../constants/types';
import { StackNavigationProp } from '@react-navigation/stack';

type WishlistTabProps = RouteProp<RouteTabsParamList, 'Wishlist'>;
type CartNavigationProp = StackNavigationProp<RouteTabsParamList, 'Cart'>;

const WishlistTab: React.FC = () => {
  const route = useRoute<WishlistTabProps>();
  const navigation = useNavigation<CartNavigationProp>();
  const [wishlistItems, setWishlistItems] = useState<ProductTypes[]>([]);

  useEffect(() => {
    const itemDetails = route.params?.itemDetails;
    if (itemDetails) {
      setWishlistItems((prevItems) => {
        if (!prevItems.find(item => item.title === itemDetails.title)) {
          return [...prevItems, itemDetails];
        }
        return prevItems;
      });
    }
  }, [route.params?.itemDetails]);

  const moveToCart = (item: ProductTypes) => {
    navigation.navigate('Cart', { itemDetails: item, quantity: 1 });

    setWishlistItems((prevItems) =>
      prevItems.filter((wishlistItem) => wishlistItem.title !== item.title)
    );
  };

  const removeFromWishlist = (item: ProductTypes) => {
    setWishlistItems((prevItems) =>
      prevItems.filter((wishlistItem) => wishlistItem.title !== item.title)
    );
  };

  const renderEmptyListMessage = () => (
    <View className="flex-1 justify-center items-center">
      <Text className="text-lg font-bold">Lista želja je prazna</Text>
    </View>
  );

  return (
    <View className="p-5 flex-1">
      <Text className="text-2xl font-bold">Lista želja</Text>
      {wishlistItems.length === 0 ? (
        renderEmptyListMessage()
      ) : (
        <FlatList
          data={wishlistItems}
          renderItem={({ item }) => (
            <View className="my-4 p-4 bg-gray-100 rounded-xl flex flex-row items-center">
              <Image source={{ uri: item.image }} className="w-20 h-20 rounded-lg" />
              <View className="ml-4 flex-1">
                <Text className="text-lg font-bold">{item.title}</Text>
                <Text className="text-lg font-bold">${item.price}</Text>
              </View>
              <View className="flex flex-col items-center ml-4">
                <TouchableOpacity
                  onPress={() => moveToCart(item)}
                  className="bg-blue-600 py-2 px-4 rounded-xl mb-2">
                  <Text className="text-white font-medium">Prebaci u korpu</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => removeFromWishlist(item)}
                  className="bg-red-600 py-2 px-4 rounded-xl">
                  <Text className="text-white font-medium">Obriši</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.title}
        />
      )}
    </View>
  );
};

export default WishlistTab;
