import React from 'react';
import { useRef } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeTab, WishlistTab, CartTab, SearchTab, SettingTab } from '../tabs';
import { Image, Text, View, TouchableOpacity } from 'react-native';
import { icons } from '../constants';
import { ItemDetails } from '../constants/types';

type TabBarItemProps = {
  source: any; // Adjust type according to your image sources
  focused: boolean;
  cart?: boolean;
  name?: string;
};
const TabBarItem: React.FC<TabBarItemProps> = ({
  source,
  focused,
  cart,
  name,
}) => {
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: cart ? -24 : 18,
      }}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          width: cart ? 64 : 'auto',
          height: cart ? 64 : 'auto',
          borderRadius: cart ? 32 : 0,
          backgroundColor: focused ? (cart ? 'red' : 'white') : 'white',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: cart ? 5 : 0,
        }}>
        <Image
          source={source}
          style={{
            tintColor: focused ? (cart ? 'white' : 'red') : 'black',
            width: 28,
            height: 28,
          }}
        />
      </View>
      {!cart && (
        <Text
          className="font-pthin text-base"
          style={{ color: focused ? 'red' : 'black', fontSize: 12 }}>
          {name}
        </Text>
      )}
    </View>
  );
};

type Props = {};
export type RouteTabsParamList = {
  Home: undefined;
  Wishlist: { itemDetails: ItemDetails; quantity: number } | undefined;
  Cart: { itemDetails: ItemDetails; quantity: number } | undefined;
  Search: { query: string } | undefined;
  Setting: undefined;
};

const HomeScreen = (props: Props) => {
  const Tab = createBottomTabNavigator<RouteTabsParamList>();
  const homeScrollRef = useRef<ScrollView>(null);
  const searchScrollRef = useRef<ScrollView>(null);
  return (
    <Tab.Navigator
    initialRouteName="Home"
    screenOptions={{
      headerShown: false,
      tabBarStyle: {
        backgroundColor: 'white',
        borderTopColor: 'grey',
        height: 70,
        borderTopWidth: 0.2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
      tabBarIconStyle: {
        justifyContent: 'center',
        alignItems: 'center',
      },
      tabBarInactiveTintColor: 'black',
      tabBarActiveTintColor: 'red',
    }}>
   <Tab.Screen
  name="Home"
  options={({ navigation }) => ({
    tabBarLabel: '',
    tabBarIcon: ({ focused }) => (
      <TabBarItem source={icons.home} focused={focused} name="Home" />
    ),
    tabBarButton: (props) => (
      <TouchableOpacity
      {...props}
      onPress={() => {
        console.log('Home button pressed');
        
        // Provera da li je Home ekran fokusiran
        if (navigation.isFocused()) {
          console.log('Already on Home screen');
          if (homeScrollRef?.current) {
            console.log('Scrolling to top!');
            homeScrollRef.current.scrollTo({ y: 0, animated: true });
          } else {
            console.log('Scroll reference not found');
          }
        } else {
          console.log('Navigating to Home screen');
          navigation.navigate('Home');
        }
      }}
    />
    ),
  })}
>
  {() => <HomeTab scrollRef={homeScrollRef} />}
</Tab.Screen>
      <Tab.Screen
        name="Wishlist"
        component={WishlistTab}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ focused }) => (
            <TabBarItem
              source={icons.heart}
              focused={focused}
              name="Želje"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartTab}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ focused }) => (
            <TabBarItem
              source={icons.cart}
              focused={focused}
              cart
              name="Cart"
            />
          ),
        }}
      />
      <Tab.Screen
  name="Search"
  options={({ navigation }) => ({
    tabBarLabel: '',
    tabBarIcon: ({ focused }) => (
      <TabBarItem source={icons.search} focused={focused} name="Pretrazi" />
    ),
    tabBarButton: (props) => (
      <TouchableOpacity
      {...props}
      onPress={() => {
        console.log('Pretrazi button pressed');
        
        // Provera da li je Home ekran fokusiran
        if (navigation.isFocused()) {
          console.log('Already on Pretrazi screen');
          if (searchScrollRef?.current) {
            console.log('Scrolling to top!');
            searchScrollRef.current.scrollTo({ y: 0, animated: true });
          } else {
            console.log('Scroll reference not found');
          }
        } else {
          console.log('Navigating to Home screen');
          navigation.navigate('Search');
        }
      }}
    />
    ),
  })}
>
{(props) => <SearchTab {...props} scrollRef={searchScrollRef} />}
</Tab.Screen>
      <Tab.Screen
        name="Setting"
        component={SettingTab}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ focused }) => (
            <TabBarItem
              source={icons.setting}
              focused={focused}
              name="Moj profil"
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default HomeScreen;
