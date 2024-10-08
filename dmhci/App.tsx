import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';
import {
  CheckoutScreen,
  ForgotPasswordScreen,
  HomeScreen,
  LoginScreen,
  OnboardingScreen,
  PlaceOrder,
  ProductsDetailsScreen,
  ProfileScreen,
  SignupScreen,
} from './src/screens';
import GetStartedScreen from './src/screens/GetStartedScreen';
import { ItemDetails } from './src/constants/types';
import { getItem } from './src/utils/AsyncStorage';
import { ActivityIndicator, View } from 'react-native';
import { AuthProvider, useAuth } from './AuthContext';

export type RouteStackParamList = {
  Onboarding: undefined;
  GetStarted: undefined;
  Login: undefined;
  Signup: undefined;
  HomeScreen: undefined;
  Profile: undefined;
  Checkout: {
    cartItems: { itemDetails: ItemDetails; quantity: number }[];
  };
  PlaceOrder: { itemDetails: ItemDetails } | undefined;
  ForgotPassword: undefined;
  ProductDetails: { itemDetails: ItemDetails } | undefined;
};

const Stack = createNativeStackNavigator<RouteStackParamList>();

const AppNavigator = () => {
  const { userId } = useAuth();
  const [showOnboarded, setShowOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    const prepare = async () => {
      // Keep the splash screen visible while we check onboarding status
      await SplashScreen.preventAutoHideAsync();
      await checkIfAlreadyOnboarded();
      // Once loading is finished, hide the splash screen
      SplashScreen.hideAsync();
    };

    prepare();
  }, []);

  const checkIfAlreadyOnboarded = async () => {
    const onboarded = await getItem('onboarded');
    setShowOnboarded(onboarded !== 200);
  };

  if (showOnboarded === null) {
    return (
      <View className="flex flex-1 justify-center items-center">
        <ActivityIndicator size={'large'} color={'#F3F3F3'} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={userId ? 'HomeScreen' : 'Onboarding'}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="GetStarted" component={GetStartedScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="PlaceOrder" component={PlaceOrder} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen
        name="ProductDetails"
        component={ProductsDetailsScreen}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
      />
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </GestureHandlerRootView>
    </AuthProvider>
  );
};

export default App;
