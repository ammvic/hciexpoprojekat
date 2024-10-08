import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  ImageSourcePropType,
  StyleSheet
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker'; 
import { icons, images } from '../constants';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CustomSearch, ProductItem } from '../components';
import { CategoriesData, images1, ProductData } from '../constants/data';
import { removeItem } from '../utils/AsyncStorage';
import { ProductTypes } from '../constants/types';

type Props = {
  scrollRef: React.RefObject<ScrollView>;
};


const HomeTab: React.FC<Props> = ({ scrollRef }) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  type RootStackParamList = {
    Setting: undefined;
  };

  const [products, setProducts] = useState<ProductTypes[]>([]);
  const [open, setOpen] = useState(false);
  const [brand, setBrand] = useState<string>("colourpop");
  const [items, setItems] = useState([
    { label: "Colourpop", value: "colourpop" },
    { label: "Smashbox", value: "smashbox" },
    { label: "Nyx", value: "nyx" },
    { label: "Covergirl", value: "covergirl" },
    { label: "Maybelline", value: "maybelline" },
    { label: "Milani", value: "milani" },
    { label: "Wet n wild", value: "wet n wild" },
  ]);

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

        const formattedData = data.map((item: any) => ({
          _id: item.id.toString(), 
          image: `https:${item.api_featured_image.startsWith('//') ? item.api_featured_image : `//${item.api_featured_image}`}`,
          title: item.name || '',
          price: parseFloat(item.price) || 0,
          description: item.description,
          priceBeforeDeal: item.price < 5.0 ? item.price : Math.floor(Math.random() * 100),
          stars: item.rating !== null ? item.rating : Math.floor(Math.random() * 6),
          brand: item.brand || '', // Dodato za filtriranje po brendu
        }));

        setProducts(formattedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const NavigateToProfile = async () => {
    navigation.navigate('Setting');
    await removeItem('onboarded'); // will reset to onboarding
  };
  const handleSelectCategory = () => {};
  console.log('HomeTab Scroll Ref:', scrollRef);
  return (
    <ScrollView ref={scrollRef}>
      {/* header */}
      <View className="flex flex-row items-center justify-between mx-5">

        <Image
          source={images.logo}
          className="w-24 h-24"
          resizeMode="contain"
        />
        <TouchableOpacity onPress={NavigateToProfile}>
          <Image
            source={icons.profile}
            className="w-8 h-8"
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      {/* search */}
      <CustomSearch initialQuery="" />
      
      {/* categories */}
      <View className="flex my-7 flex-row  justify-between ">
        <FlatList
          data={CategoriesData}
          renderItem={({item}) => (
            <TouchableOpacity onPress={handleSelectCategory}>
              <Image
                source={{uri: item.image}} 
                className="w-24 h-24 rounded-full"
              />
              <Text className="text-black-100/80 text-center text-lg font-medium">
                {' '}
                {item.title}{' '}
              </Text>
            </TouchableOpacity>
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <View className="w-8" />}
          ListFooterComponent={<View className="w-8" />}
          ListHeaderComponent={<View className="w-8" />}
        />
      </View>
      {/* offer */}
      <View>
        <Image
          source={images.deal_off}
          resizeMode="contain"
          className="w-full"
        />
      </View>
      {/* daily .. */}
      <View className="bg-[#4392F9] rounded-xl justify-between flex flex-row mx-5 pl-5 py-5">
        <View>
          <Text className="text-white  text-2xl font-semibold">
            Ponuda dana
          </Text>
          <View className="flex flex-row mt-3 items-center gap-x-1">
            <Image
              source={icons.calender}
              resizeMode="contain"
              className="w-6 h-6"
            />
            <Text className="text-white text-base font-medium">
              {' '}
              22h 55m 20s do kraja ponude{' '}
            </Text>
          </View>
        </View>
      </View>
      {/* Products */}
      <View className="my-8">
        <FlatList
          data={products}
          renderItem={({item}) => (
            <ProductItem
              image={item.image}
              title={item.title}
              price={item.price}
              priceBeforeDeal={item.priceBeforeDeal}
              stars={item.stars}
              itemDetails={item}
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <View className="w-7" />}
          ListFooterComponent={<View className="w-10" />}
          ListHeaderComponent={<View className="w-6" />}
        />
      </View>
      {/* special Offer */}
      <View className="flex my-5 justify-between bg-white flex-row items-center py-3 px-4 mx-5 rounded-lg">
        <Image
          source={icons.offer}
          className="w-24 h-24"
          resizeMode="contain"
        />
        <View className="">
          <Text className="text-xl mb-1 text-black-100 font-bold">
            Najbolji izbor proizvoda
          </Text>
          <Text className="text-neutral-500 text-base w-52">
            Besplatna dostava za porudzbine preko 3.000 din
          </Text>
        </View>
      </View>
      <Text
        style={{
          height: 1,
          borderColor: "#D0D0D0",
          borderWidth: 1,
          marginTop: 10,
        }}
      />

<View style={styles.dropdownContainer}>
        <DropDownPicker
          style={styles.dropdown}
          open={open}
          value={brand}
          items={items}
          setOpen={setOpen}
          setValue={setBrand}
          setItems={setItems}
          placeholder="Odaberi brend"
          placeholderStyle={styles.placeholderStyle}
          onOpen={() => console.log("Dropdown opened")}
          zIndex={3000}
          zIndexInverse={1000}
        />
      </View>

      <View style={styles.filteredProductsContainer}>
  {products
    ?.filter((item) => item.brand === brand)
    .slice(0, 4) // Prikazuje prvih 4 proizvoda
    .map((item, index) => (
      <View key={index} style={styles.filteredProductItem}>
        <ProductItem
          image={item.image}
          title={item.title}
          price={item.price}
          priceBeforeDeal={item.priceBeforeDeal}
          stars={item.stars}
          itemDetails={item}
        />
      </View>
    ))}
</View>

      
      
      <View style={styles.container}>
      <FlatList
        data={images1}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.image} />
        )}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListFooterComponent={<View style={styles.footer} />}
        ListHeaderComponent={<View style={styles.header} />}
      />
    </View>
      {/* .... */}
    </ScrollView>
  );
};

export default HomeTab;

type FeaturesDataProps = {
  id: number;
  title: string;
  image: ImageSourcePropType;
};

export const FeaturesData: FeaturesDataProps[] = [
  {
    id: 1,
    title: 'Sort',
    image: icons.sort,
  },
  {
    id: 2,
    title: 'Filter',
    image: icons.filter,
  },
];
const styles = StyleSheet.create({
  container: {
    marginVertical: 50,
  },
  image: {
    width: 350, 
    height: 200,
    borderRadius: 8, 
  },
  separator: {
    width: 10,
  },
  footer: {
    width: 10,
  },
  header: {
    width: 10,
  },
  dropdownContainer: {
    marginHorizontal: 10,
    marginTop: 20,
    width: '45%',
    zIndex: 3000,
    marginBottom: 30,
  },
  dropdown: {
    borderColor: '#B7B7B7',
    height: 30,
    zIndex: 3000,
  },
  placeholderStyle: {
    color: '#B7B7B7',
  },
  productsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    zIndex: 1000,
  },
  productItem: {
    width: '48%', 
    padding: 6,
    marginBottom: 20,
    marginRight: '2%', 
  },
  filteredProductsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: 20,
    overflow: 'hidden', // Dodato da osigurate da elementi ne prelaze širinu kontejnera
},

filteredProductItem: {
    width: '48%', // Polovina širine, tako da dva proizvoda stanu u red
    marginBottom: 20, // Razmak između redova proizvoda
    backgroundColor: '#fff', // Pozadina za svaki proizvod
    borderRadius: 8, // Zaobljeni uglovi
    elevation: 3, // Sjenka (radi bolje u Androidu)
    shadowColor: '#000', // Sjenka (za iOS)
    shadowOffset: { width: 0, height: 2 }, // Sjenka za iOS
    shadowOpacity: 0.1, // Sjenka za iOS
    shadowRadius: 5, // Sjenka za iOS
    overflow: 'hidden', // Dodato da osigurate da sadržaj unutar proizvoda ne izlazi iz okvira
},

});
