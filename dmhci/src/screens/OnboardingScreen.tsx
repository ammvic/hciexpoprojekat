import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import React from 'react';
import Onboarding from 'react-native-onboarding-swiper';
import { SplashData } from '../constants/data';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { setItem } from '../utils/AsyncStorage';
import { RouteStackParamList } from '../../App';

type Props = {};
export type RootStackParamList = {
  Login: { id: number } | undefined;
};

const { width, height } = Dimensions.get('window');

const OnboardingScreen = (props: Props) => {
  const navigation = useNavigation<StackNavigationProp<RouteStackParamList>>();

  const handleDone = async () => {
    await setItem('onboarded', 200);
    navigation.navigate('Login');
  };

  return (
    <View className="flex-1">
      <Onboarding
        onSkip={handleDone}
        onDone={handleDone}
        pages={[
          {
            backgroundColor: '#fff',
            image: (
              <Image
                source={SplashData[0].image}
                style={styles.image}
                resizeMode="contain"
              />
            ),
            title: SplashData[0].title,
            subtitle: SplashData[0].description,
          },
          {
            backgroundColor: '#fff',
            image: (
              <Image
                source={SplashData[1].image}
                style={styles.image}
                resizeMode="contain"
              />
            ),
            title: SplashData[1].title,
            subtitle: SplashData[1].description,
          },
          {
            backgroundColor: '#fff',
            image: (
              <Image
                source={SplashData[2].image}
                style={styles.image}
                resizeMode="contain"
              />
            ),
            title: SplashData[2].title,
            subtitle: SplashData[2].description,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: width * 0.8, // 80% širine ekrana
    height: height * 0.4, // 40% visine ekrana
  },
});

export default OnboardingScreen;
