import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, TouchableOpacity, Image, StyleSheet, TextInput, ScrollView} from 'react-native';
import {RouteProp, useNavigation} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons'; // Importujte ikonu
import { ProductTypes } from '../constants/types';

type RootStackParamList = {
  Search: {query: string} | undefined;
  ProductDetails: {itemDetails}; // Dodaj rutu za detalje proizvoda
};

type ScreenRouteProps = RouteProp<RootStackParamList, 'Search'>;
type NavigationProp = StackNavigationProp<RootStackParamList, 'ProductDetails'>;

interface SearchProps {
  route: ScreenRouteProps;
  scrollRef: React.RefObject<ScrollView>;
}

const SearchTab: React.FC<SearchProps> = ({route, scrollRef}) => {
  const {query} = route.params || {}; // destructure the query from route
  const navigation = useNavigation<NavigationProp>(); // Dodaj navigaciju

  const [products, setProducts] = useState<ProductTypes[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>(''); // Držimo upit za pretragu
  const [items, setItems] = useState([
    { label: "Colourpop", value: "colourpop" },
    { label: "Smashbox", value: "smashbox" },
    { label: "Nyx", value: "nyx" },
    { label: "Covergirl", value: "covergirl" },
    { label: "Maybelline", value: "maybelline" },
    { label: "Milani", value: "milani" },
    { label: "Wet n wild", value: "wet n wild" },
  ]);

  // Funkcija za preuzimanje podataka sa API-a
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
        brand: item.brand || '',
      }));

      setProducts(formattedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Funkcija koja filtrira proizvode prema imenu
  const filteredProducts = searchQuery
    ? products.filter((product) => product.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : products;

  useEffect(() => {
    fetchData();
  }, []);
  console.log('Seacrh Scroll Ref:', scrollRef);
  return (
    <ScrollView ref={scrollRef}>
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Search Products</Text>

      {/* Input polje za pretragu */}
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={24} color="gray" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Enter product name"
          value={searchQuery}
          onChangeText={setSearchQuery} // Ažuriraj searchQuery
        />
      </View>

      {/* Prikaz filtriranih proizvoda */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item._id}
        numColumns={2} // Prikaz po dve kolone
        renderItem={({item}) => (
          <TouchableOpacity 
            onPress={() => navigation.navigate('ProductDetails', { itemDetails: item })} // Dodaj navigaciju na klik
            style={styles.productContainer}>
            <Image source={{uri: item.image}} style={styles.productImage} />
            <Text style={styles.productTitle}>{item.title}</Text>
            <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flex: 1,
    padding: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  searchIcon: {
    marginRight: 10,
  },
  productContainer: {
    flex: 1,
    margin: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  productImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 14,
    color: 'green',
  },
});

export default SearchTab;
