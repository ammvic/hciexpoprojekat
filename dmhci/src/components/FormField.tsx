import {
  View,
  Text,
  Animated,
  Image,
  TextInput,
  TouchableOpacity,
  Easing,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {icons} from '../constants';

type FormFieldProps = {
  title: string;
  value: string;
  placeholder: string;
  handleChangeText: (text: string) => void;
  otherStyles?: string;
  setError?: (error: string) => void;
  error: string;
  [key: string]: any; // add more props ...props
};

const FormField: React.FC<FormFieldProps> = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  setError,
  error,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [shakeAnimation] = useState(new Animated.Value(0));

  const shake = () => {
    shakeAnimation.setValue(0);
    Animated.timing(shakeAnimation, {
      toValue: 4,
      duration: 400,
      useNativeDriver: true,
      easing: Easing.bounce,
    }).start(() => {
      setTimeout(() => {
        setError?.(''); // hide the error
      }, 3000);
    });
  };

  useEffect(() => {
    if (error) {
      shake();
    }
  }, [error]);

  const getIconSource = () => {
    if (title === 'Password' || title === 'Potvrdi lozinku') return icons.lock;
    if (title === 'Email') return icons.mail;
    return icons.user; // default icon
  };

  const isPasswordField = title === 'Password' || title === 'Potvrdi lozinku';

  return (
    <View className={otherStyles + ' '}>
      <Animated.View
        style={{
          transform: [
            {
              translateX: shakeAnimation.interpolate({
                inputRange: [0, 1, 2, 3, 4],
                outputRange: [0, -10, 10, -10, 0],
              }),
            },
          ],
        }}
        className={`flex flex-row items-center justify-center rounded-xl w-full h-[72px] px-4 bg-[#F3F3F3] border-2 border-[#A8A8A9] focus:border-black-200 ${
          error ? 'border border-red-600' : ''
        }`}>
        <Image
          source={getIconSource()}
          className="w-8 h-8 mr-1"
          resizeMode="contain"
        />
        <TextInput
          className="flex-1 text-black-100 font-semibold text-lg"
          value={value}
          placeholder={placeholder}
          onChangeText={handleChangeText}
          placeholderTextColor={'#676767'}
          secureTextEntry={isPasswordField && !showPassword}
          onBlur={() => error && shake()}
          {...props}
        />
        {isPasswordField && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </Animated.View>
      {error && (
        <Animated.View className="text-red-500 font-pregular text-sm mt-3 self-center">
          {error}
        </Animated.View>
      )}
    </View>
  );
};

export default FormField;
