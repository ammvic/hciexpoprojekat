import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  Button,
  Alert,
} from 'react-native';
import { CustomButton, FormField } from '../components';
import { icons } from '../constants';
import { ImageSourcePropType } from 'react-native';

type Props = {};

const SignupScreen = (props: Props) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  type RootStackParamList = {
    ForgotPassword: undefined;
    Login: undefined;
  };

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
    if (password.length < minLength) {
      return `Lozinka mora imati najmanje ${minLength} karaktera.`;
    } else if (!hasUpperCase) {
      return 'Lozinka mora imati najmanje jedno veliko slovo.';
    } else if (!hasLowerCase) {
      return 'Lozinka mora imati najmanje jedno malo slovo.';
    } else if (!hasNumbers) {
      return 'Lozinka mora imati najmanje jedan broj.';
    } else if (!hasSpecialChar) {
      return 'Lozinka mora imati najmanje jedan specijalan karakter.';
    } else {
      return '';
    }
  };
  
  
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignup = async () => {
    setEmailError('');
    setPasswordError('');
  
    if (!validateEmail(form.email)) {
      setEmailError('Neispravna email adresa.');
      return;
    }
    
    const passwordValidationError = validatePassword(form.password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    }
    
    if (form.password !== form.confirmPassword) {
      setPasswordError('Lozinke se ne podudaraju.');
      return;
    }
  
    try {
      setIsSubmitting(true);
      const response = await fetch('http://91.187.135.183:4000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        
        if (errorData.message.includes('Invalid email')) {
          setEmailError('Neispravna email adresa.');
        } else if (errorData.message.includes('Weak password')) {
          setPasswordError('Lozinka je previše slaba.');
        } else {
          console.log('Error response data:', errorData);
          throw new Error(errorData.message || 'Nepoznata greška');
        }
  
        return; // Završite funkciju ako postoji greška
      }
  
      const data = await response.json();
      Alert.alert('Proverite vaš email za potvrdu registracije.');
  
      setTimeout(() => {
        setModalVisible(true);
      }, 2000); // Kašnjenje od 2000ms (2 sekunde)
  
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error:', error.message);
        setEmailError(error.message || 'Došlo je do greške. Pokušajte ponovo.');
      } else {
        console.error('Unknown error:', error);
        setEmailError('Došlo je do greške. Pokušajte ponovo.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  

  const handleVerifyCode = async () => {
    try {
      setIsSubmitting(true);
      const response = await fetch('http://91.187.135.183:4000/api/users/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.email,
          token: verificationCode,
        }),
      });

      const data = await response.json();
      console.log('Verification response:', data);
      if (response.ok) {
        Alert.alert('Email uspešno potvrđen.');
        setModalVisible(false); // Zatvorite modal
        navigation.navigate('Login');  // Preusmeri na Login stranicu
      } else {
        setEmailError(data.message || 'Nešto nije u redu.');
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error:', error.message);
        setEmailError(error.message || 'Došlo je do greške. Pokušajte ponovo.');
      } else {
        console.error('Unknown error:', error);
        setEmailError('Došlo je do greške. Pokušajte ponovo.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignInWithProvider = () => {};
  const handleNavigateToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <View className="px-6 flex-1 bg-white pt-4 justify-center">
      <Text className="text-4xl font-bold self-start mb-5">
        Napravite{'\n'}nalog
      </Text>
      <View className="w-full">
        {/* text input */}
        <FormField
    title="Email"
    value={form.email}
    setError={setEmailError}
    error={emailError}
    handleChangeText={(e: any) => {
      setEmailError('');
      setForm({ ...form, email: e });
    }}
    placeholder="Email"
    otherStyles="my-2"
  />
  {emailError ? (
    <Text className="text-red-500 text-sm mt-1">{emailError}</Text>
  ) : null}
        <View>
        <FormField
    title="Password"
    value={form.password}
    setError={setPasswordError}
    error={passwordError}
    handleChangeText={(e: any) => {
      setPasswordError('');
      setForm({ ...form, password: e });
    }}
    placeholder="Lozinka"
    otherStyles="mt-2"
    iconLeft={icons.lock}
    iconRight={icons.eye}
  />
  {passwordError ? (
    <Text className="text-red-500 text-sm mt-1">{passwordError}</Text>
  ) : null}
          <FormField
    title="Potvrdi lozinku"
    value={form.confirmPassword}
    setError={setPasswordError}
    error={passwordError}
    handleChangeText={(e: any) => {
      setPasswordError('');
      setForm({ ...form, confirmPassword: e });
    }}
    placeholder="Potvrdi lozinku"
    otherStyles="mt-2"
    iconLeft={icons.lock}
    iconRight={icons.eye}
  />
  {passwordError ? (
    <Text className="text-red-500 text-sm mt-1">{passwordError}</Text>
  ) : null}

          <Text className="text-[#676767] text-base font-medium self-start">
            Klikom na <Text className="text-red-600"> Registruj se</Text>{' '}
            prihvatate uslove korišćenja.
          </Text>
        </View>
        {/* submit btn */}
        <CustomButton
          title="Registrujte se"
          handlePress={handleSignup}
          isLoading={isSubmitting}
          containerStyle="mt-4 py-3"
        />

        {/* or continue with */}
        <View className="mt-4 self-center">
          <Text className="text-[#575757] text-base self-center mt-2">
            {' '}
            Ili nastavite sa -{' '}
          </Text>
          <View className="flex flex-row items-center gap-2 mt-2 justify-center">
            {ContinueWithData.map((item) => {
              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={handleSignInWithProvider}
                  className="rounded-full border-2 bg-red-50 border-red-500 p-2"
                >
                  <Image
                    source={item.image}
                    className="w-5 h-5"
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              );
            })}
          </View>
          <View className="flex flex-row items-center gap-x-2 justify-center mt-4">
            <Text className="text-[#575757] text-sm">
              Već imate nalog?
            </Text>
            <TouchableOpacity onPress={handleNavigateToLogin}>
              <Text className="text-lg font-bold underline text-action">
                Prijavite se
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Modal for verification code */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white p-6 rounded-lg w-80">
            <Text className="text-lg font-bold mb-4">Unesite verifikacioni kod</Text>
            <TextInput
              value={verificationCode}
              onChangeText={setVerificationCode}
              placeholder="Verifikacioni kod"
              className="border border-gray-300 p-2 mb-4"
            />
            <Button title="Potvrdi" onPress={handleVerifyCode} />
            <Button title="Zatvori" onPress={() => setModalVisible(false)} color="red" />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SignupScreen;

type ContinueWithType = {
  image: ImageSourcePropType | undefined;
  id: number;
  name: string;
};

const ContinueWithData: ContinueWithType[] = [
  {
    id: 0,
    name: 'google',
    image: icons.google,
  },
];
