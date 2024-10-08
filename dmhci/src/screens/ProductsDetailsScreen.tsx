import {RouteProp, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {AirbnbRating} from 'react-native-ratings';
import {RouteStackParamList} from '../../App';
import {icons} from '../constants';
import {RouteTabsParamList} from './HomeScreen';
import {ProductItem} from '../components';
import {ProductTypes} from '../constants/types';

type ScreenRouteProps = RouteProp<RouteStackParamList, 'ProductDetails'>;

type ProductDetailsProps = {
  route: ScreenRouteProps;
};

const ProductsDetailsScreen: React.FC<ProductDetailsProps> = ({route}) => {
  const {itemDetails} = route.params || {};
  const navigation =
    useNavigation<StackNavigationProp<RouteTabsParamList, 'Cart' | 'Wishlist'>>();

  const [products, setProducts] = useState<ProductTypes[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [userRating, setUserRating] = useState<number | null>(null); // Drži korisnikovu ocenu

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://makeup-api.herokuapp.com/api/v1/products.json', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        });
        const data = await response.json();

        const formattedData = data.map((item: any) => {
          const priceBeforeDeal = item.price < 5.0 ? item.price : Math.floor(Math.random() * 100);
          return {
            image: `https:${item.api_featured_image.startsWith('//') ? item.api_featured_image : `//${item.api_featured_image}`}`,
            title: item.name || '',
            price: parseFloat(item.price) || 0,
            description: item.description,
            priceBeforeDeal,
            priceOff: priceBeforeDeal - item.price,
            stars: item.rating !== null ? item.rating : Math.floor(Math.random() * 6),
            brand: item.brand || '',
          };
        });

        setProducts(formattedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const GoBack = () => {
    navigation.goBack();
  };

  const NavigateToCart = () => {
    navigation.navigate('Cart', {itemDetails: itemDetails!, quantity});
  };

  const NavigateToWishlist = () => {
    navigation.navigate('Wishlist', {itemDetails: itemDetails!, quantity});
  };

  const IncreaseQuantity = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  const DecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1);
    }
  };

  // Funkcija za ažuriranje ocene korisnika
  const handleRating = (rating: number) => {
    setUserRating(rating);
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="pt-7 px-5">
        {/* header */}
        <View className="flex flex-row justify-between items-center mb-5">
          <TouchableOpacity onPress={GoBack} className="p-3 bg-gray-100 rounded-full shadow-md active:scale-95 transition-all">
            <Image
              source={icons.next1}
              className="rotate-180 w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={NavigateToCart} className="p-3 bg-gray-100 rounded-full shadow-md active:scale-95 transition-all">
            <Image source={icons.cart} className="w-6 h-6" resizeMode="contain" />
          </TouchableOpacity>
        </View>

        {/* image slider */}
        <View className="mt-4">
          <Image
            source={{uri: itemDetails?.image}}
            className="h-96 rounded-3xl shadow-lg"
          />
        </View>

        {/* details */}
        <View className="mt-6">
          <Text className="text-3xl font-extrabold text-black mb-3">{itemDetails?.title}</Text>
          <Text className="text-neutral-500 font-medium text-sm mb-4">
            {itemDetails?.description || 'Trenutno opis proizvoda nije dostupan'}
          </Text>

          <View className="flex-row mb-4">
            <AirbnbRating
              count={5}
              reviews={['Najslabije ocenjeno', 'Loše', 'Okej', 'Dobro', 'Odlično']}
              defaultRating={userRating || itemDetails?.stars}
              size={15}
              onFinishRating={handleRating}  // Dodajemo mogućnost da korisnik oceni proizvod
              ratingContainerStyle={{ flexDirection: 'row'}}
            />
          </View>

          {/* Opciono prikazujemo korisnikovu ocenu */}
          {userRating && <Text>Vaša ocena: {userRating}</Text>}

          <View className="flex flex-row items-center gap-x-3 mb-6">
            <Text className="text-black font-bold text-3xl">${itemDetails?.price}</Text>
            <Text className="text-gray-400 line-through text-xl">${itemDetails?.priceBeforeDeal}</Text>
            <Text className="text-red-500 text-xl">-{itemDetails?.priceOff}</Text>
          </View>

          {/* quantity selector */}
          <View className="flex flex-row items-center gap-x-7 mb-8">
            <TouchableOpacity onPress={DecreaseQuantity} className="p-4 bg-gray-200 rounded-xl shadow-md active:scale-95 transition-all">
              <Text className="text-2xl font-bold text-black">-</Text>
            </TouchableOpacity>
            <Text className="text-3xl font-extrabold text-black">{quantity}</Text>
            <TouchableOpacity onPress={IncreaseQuantity} className="p-4 bg-gray-200 rounded-xl shadow-md active:scale-95 transition-all">
              <Text className="text-2xl font-bold text-black">+</Text>
            </TouchableOpacity>
          </View>

          {/* action buttons */}
          <View className="mt-7">
            <TouchableOpacity onPress={NavigateToWishlist} className="mb-6 flex flex-row items-center">
              <View className="z-20">
                <Image source={icons.cart_circle} className="w-14 h-14 -mr-1" resizeMode="contain" />
              </View>
              <View className="bg-blue-600 py-3 px-6 rounded-2xl shadow-xl -ml-4 z-10">
                <Text className="text-white font-semibold text-xl">Dodaj u listu želja</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={NavigateToCart} className="flex flex-row items-center">
              <View className="z-20">
                <Image source={icons.buy} className="w-14 h-14 -mr-1" resizeMode="contain" />
              </View>
              <View className="bg-green-500 py-3 px-6 rounded-2xl shadow-xl -ml-4 z-10">
                <Text className="text-white font-semibold text-xl">Kupi odmah</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* delivery info */}
          <View className="bg-red-100 px-5 py-4 rounded-2xl mt-8 shadow-lg">
            <Text className="text-gray-700 text-lg">Dostava</Text>
            <Text className="text-black text-2xl font-bold">U roku od 1 dana</Text>
          </View>

          {/* similar products */}
          <View className="mb-8 mt-10">
            <Text className="text-2xl text-black font-bold mb-5">Još sličnih proizvoda...</Text>
            <FlatList
              data={products}
              renderItem={({item}) => (
                <ProductItem
                  image={item.image}
                  title={item.title}
                  price={item.price}
                  priceBeforeDeal={item.priceBeforeDeal}
                  priceOff={item.priceOff}
                  stars={item.stars}
                  itemDetails={item}
                />
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
              ItemSeparatorComponent={() => <View className="w-8" />}
              ListFooterComponent={() => <View className="w-8" />}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProductsDetailsScreen;
