import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useState} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {CustomButton, FormField} from '../components';
import { Alert } from 'react-native';

type Props = {};

const ForgotPasswordScreen = (props: Props) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  type RootStackParamList = {
    Login: undefined;
  };

  const sendPasswordResetEmail = async (email: string, password: string) => {
    try {
      const response = await fetch('http://91.187.135.183:4000/api/users/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Greška prilikom slanja emaila');
      }

      return await response.json(); // Pretpostavimo da API vraća JSON
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setEmailError('Email je obavezan');
      return;
    }
  
    if (!password) {
      setPasswordError('Lozinka je obavezna');
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      const response = await sendPasswordResetEmail(email, password);
      console.log(response.message); // Možeš prikazati poruku iz odgovora API-ja
  
      // Prikazivanje obaveštenja o uspešnoj promeni lozinke
      Alert.alert(
        'Uspeh',
        'Uspešno ste promenili lozinku. Sada se možete prijaviti.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
    } catch (error) {
      setEmailError('Greška prilikom slanja emaila');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="px-7 flex-1 bg-white pt-4 justify-center">
      <Text className="text-4xl font-bold self-start mb-5">
       Promenite lozinku
      </Text>
      <View>
        {/* Email input */}
        <FormField
          title="Email"
          value={email}
          setError={setEmailError}
          error={emailError}
          handleChangeText={(e: any) => {
            setEmailError('');
            setEmail(e);
          }}
          placeholder="Unesite vaš email"
          otherStyles="my-2"
        />
        {/* New password input */}
        <FormField
          title="Nova lozinka"
          value={password}
          setError={setPasswordError}
          error={passwordError}
          handleChangeText={(e: any) => {
            setPasswordError('');
            setPassword(e);
          }}
          placeholder="Unesite novu lozinku"
          otherStyles="mt-3"
        />
        {/* submit button */}
        <CustomButton
          title="Resetuj lozinku"
          handlePress={handlePasswordReset}
          isLoading={isSubmitting}
          containerStyle="mt-6 py-4"
        />
        <View className="flex flex-row items-center gap-x-2 justify-center mt-6">
          <Text className="text-[#575757] text-lg">Sećate se lozinke?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text className="text-lg font-bold underline text-action">
              Prijavite se
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ForgotPasswordScreen;
