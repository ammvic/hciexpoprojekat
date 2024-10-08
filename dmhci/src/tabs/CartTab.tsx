import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { RouteProp, useRoute, useNavigation, NavigationProp } from '@react-navigation/native';
import { RouteStackParamList } from '../../App';
import { ProductTypes } from '../constants/types';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type CartTabProps = RouteProp<RouteStackParamList, 'Checkout' >;
type HomeScreenProps = RouteProp<RouteStackParamList, 'HomeScreen'>;


const CartTab: React.FC = () => {
  const route = useRoute<CartTabProps>();
  const navigation = useNavigation<NavigationProp<RouteStackParamList>>();
  const { itemDetails, quantity } = route.params || {};

  const [cartItems, setCartItems] = useState<Array<{ itemDetails: ProductTypes; quantity: number }>>([]);

  // Funkcija za čuvanje korpe u AsyncStorage
  const saveCartToStorage = async (cart: Array<{ itemDetails: ProductTypes; quantity: number }>) => {
    try {
      await AsyncStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Greška pri čuvanju korpe', error);
    }
  };

  // Dodavanje proizvoda u korpu i čuvanje u AsyncStorage
  useEffect(() => {
    if (itemDetails && quantity) {
      const newCartItems = [...cartItems, { itemDetails, quantity }];
      setCartItems(newCartItems);
      saveCartToStorage(newCartItems); // Čuvanje u AsyncStorage
    }
  }, [itemDetails, quantity]);

  // Učitavanje korpe iz AsyncStorage prilikom fokusa na ekran
  useFocusEffect(
    useCallback(() => {
      const fetchCartItems = async () => {
        const storedCart = await AsyncStorage.getItem('cart');
        if (storedCart) {
          setCartItems(JSON.parse(storedCart));
        }
      };
      fetchCartItems();
    }, [])
  );

  // Funkcija za brisanje proizvoda iz korpe
  const handleDeleteItem = (index: number) => {
    const updatedCartItems = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCartItems);
    saveCartToStorage(updatedCartItems); // Ažuriranje AsyncStorage-a nakon brisanja
  };

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      navigation.navigate('Checkout', { cartItems });
    }
  };

  const handleGoToHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'HomeScreen' }],
    });
  };
  

  if (cartItems.length === 0) {
    return (
      <View className="flex-1 justify-center items-center p-10">
        <View className="text-center mb-4">
          <Text className="text-xl font-bold">Trenutno nemate ništa u korpi</Text>
        </View>
        <TouchableOpacity
          onPress={handleGoToHome}
          className="bg-blue-500 p-4 rounded-xl">
          <Text className="text-white text-center text-lg font-bold">Obavite kupovinu</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 p-5 justify-between">
      <View className="flex flex-row items-center justify-between mx-2">
        <Text className="text-2xl font-bold">Korpa</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={cartItems}
        renderItem={({ item, index }) => (
          <View className="my-4 p-4 bg-gray-100 rounded-xl flex flex-row items-center">
            <Image source={{ uri: item.itemDetails.image }} className="w-20 h-20 rounded-lg" />
            <View className="ml-4 flex-1">
              <Text className="text-lg font-bold">{item.itemDetails.title}</Text>
              <Text className="text-base text-gray-600">Količina: {item.quantity}</Text>
              <Text className="text-lg font-bold">
                Ukupna cena: ${(item.itemDetails.price * item.quantity).toFixed(2)}
              </Text>
            </View>
            <TouchableOpacity onPress={() => handleDeleteItem(index)} className="ml-4 p-2 bg-red-500 rounded-lg">
              <Text className="text-white">Obriši</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.itemDetails._id}
        contentContainerStyle={{ paddingBottom: 80 }} // Ostavite prostor za dugme
      />

      <TouchableOpacity onPress={handleCheckout} className="bg-green-500 p-4 rounded-xl">
        <Text className="text-white text-center text-xl font-bold">Naruči</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CartTab;
