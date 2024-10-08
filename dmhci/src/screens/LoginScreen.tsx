import {
  Image,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
  Share,
} from 'react-native';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../AuthContext';
import { CustomButton, FormField } from '../components';
import { icons } from '../constants';
import { jwtDecode } from 'jwt-decode';
import * as Google from 'expo-auth-session/providers/google';
import { getAuth, signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import app from '../../firebase';

const auth = getAuth(app);

type RootStackParamList = {
  ForgotPassword: undefined;
  Signup: undefined;
  GetStarted: undefined;
};

type Props = {};

const LoginScreen = (props: Props) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: '',
    username: '',
    password: '',
  });
  const { setUserId } = useAuth();

  interface DecodedToken {
    id: string;
    email: string;
  }

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: "1095417217585-396eqmt3kf01l9mdaf8fqvki1qgm36qe.apps.googleusercontent.com",
    redirectUri: "https://auth.expo.io/@ammvic/dm",
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);

      signInWithCredential(auth, credential)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log('Korisnik prijavljen:', user);
          navigation.navigate('GetStarted'); // Preusmeri na drugi ekran
        })
        .catch((error) => {
          console.error('Greška prilikom prijave:', error);
        });
    }
  }, [response]);

  const handleSignInWithGoogle = () => {
    promptAsync(); // Pokreni Google prijavu
  };

  const handleShareApp = async () => {
    try {
      const result = await Share.share({
        message: 'Pogledajte nas sajt: [https://www.dm.rs/]', // Promenite link na vašoj aplikaciji
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Shared with application:', result.activityType);
        } else {
          console.log('Successfully shared');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Sharing dismissed');
      }
    } catch (error) {
      Alert.alert('Greška', 'Došlo je do greške pri deljenju.');
      console.error('Error sharing:', error);
    }
  };

  const handleNavigateToSignUp = () => {
    navigation.navigate('Signup');
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const handleLogin = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('http://91.187.135.183:4000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        const token = data.token;

        // Decode JWT token using jwt-decode
        const decodedToken = jwtDecode(data.token) as DecodedToken;
        const id = decodedToken.id;

        // Save token and user ID
        await AsyncStorage.setItem('authToken', token);
        await AsyncStorage.setItem('userId', id);
        setUserId(id);
        console.log('User successfully logged in:', data.user.email);
        console.log('User ID:', id);

        // Navigate to the home screen or wherever necessary
        navigation.navigate('GetStarted');
      } else {
        Alert.alert('Greška', 'Pogrešan email ili lozinka.');
      }
    } catch (error) {
      console.log('Error during login:', error);
      setEmailError('Došlo je do greške. Pokušajte ponovo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="px-7 flex-1 bg-white pt-3 justify-center">
      <Text className="text-4xl font-bold self-start mb-5">
        Dobrodošli {'\n'}nazad!
      </Text>
      <View className="w-full">
        <FormField
          title="Email"
          value={form.email}
          setError={setEmailError}
          error={emailError}
          handleChangeText={(e) => {
            setEmailError('');
            setForm({ ...form, email: e });
          }}
          placeholder="Email"
          otherStyles="my-2"
        />
        {emailError ? (
          <Text className="text-red-500 text-sm mt-1">{emailError}</Text>
        ) : null}

        <FormField
          title="Password"
          value={form.password}
          setError={setPasswordError}
          error={passwordError}
          handleChangeText={(e) => {
            setPasswordError('');
            setForm({ ...form, password: e });
          }}
          placeholder="Lozinka"
          otherStyles="mt-2"
        />
        {passwordError ? (
          <Text className="text-red-500 text-sm mt-1">{passwordError}</Text>
        ) : null}
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text className="text-red-600 text-sm font-medium self-end">
            Zaboravili ste lozinku?
          </Text>
        </TouchableOpacity>

        <CustomButton
          title="Prijavite se"
          handlePress={handleLogin}
          isLoading={isSubmitting}
          containerStyle="mt-4 py-3"
        />

        <View className="mt-4 self-center">
          <Text className="text-[#575757] text-sm self-center mt-2">
            Ili nastavite sa -
          </Text>
          <View className="flex flex-row items-center gap-2 mt-2 justify-center">
            <TouchableOpacity
              onPress={handleSignInWithGoogle}
              className="rounded-full border-2 bg-red-50 border-red-500 p-2 flex-row items-center"
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#000" />
              ) : (
                <>
                  <Image
                    source={icons.google}  
                    className="w-5 h-5"
                    resizeMode="contain"
                  />
                  <Text className="ml-2 text-red-600 font-bold">Prijavi se sa Google</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-row mt-4 self-center">
          <Text className="text-sm text-[#575757]">
            Nemate nalog?
          </Text>
          <TouchableOpacity onPress={handleNavigateToSignUp}>
            <Text className="text-sm text-red-500 font-bold ml-2">
              Registrujte se.
            </Text>
          </TouchableOpacity>
        </View>

        {/* Dugme za deljenje */}
        <TouchableOpacity
          onPress={handleShareApp}
          className="mt-4 rounded-full border-2 bg-blue-50 border-blue-500 p-2 flex-row items-center justify-center"
        >
          <Text className="text-blue-600 font-bold">Podelite ovu aplikaciju</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;
