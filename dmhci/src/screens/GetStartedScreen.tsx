import { View, Text, ImageBackground, StyleSheet } from 'react-native';
import React from 'react';
import { images } from '../constants';
import { CustomButton } from '../components';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type Props = {};

const GetStartedScreen = (props: Props) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  type RootStackParamList = {
    HomeScreen: undefined;
  };

  const GetStarted = () => {
    navigation.navigate('HomeScreen');
  };

  return (
    <ImageBackground
      source={images.get_started}
      style={styles.backgroundImage}
    >
      {/* push content to the bottom */}
      <View style={styles.topSpacer} />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>
          Dobro došli u dm drogerie markt svet!
        </Text>
        <Text style={styles.subtitle}>
          Ovde možete da uronite u uzbudljiv svet kompanije dm drogerie markt i steknete čudesnu sliku o najvećem evropskom drogerijskom lancu. Zabavite se istražujući.
        </Text>

        <CustomButton
          title="Započni kupovinu"
          containerStyle="py-3 my-4" // Koristite Tailwind sintaksu
          handlePress={GetStarted}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    width: '100%',
    height: '100%',
    flex: 1,
  },
  topSpacer: {
    height: '60%',
  },
  contentContainer: {
    paddingHorizontal: 12,
    height: '40%',
    paddingTop: 12,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    width: '100%',
  },
  title: {
    color: '#fff',
    fontSize: 30, // smanjeno sa 4xl
    textAlign: 'center',
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#F2F2F2',
    fontSize: 16, // smanjeno sa lg
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default GetStartedScreen;
