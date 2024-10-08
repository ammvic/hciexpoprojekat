import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthContextType = {
  userId: string | null;
  setUserId: (id: string | null) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          setUserId(storedUserId);
        }
      } catch (error) {
        console.error('Failed to load user ID from AsyncStorage', error);
      }
    };

    loadUserId();
  }, []);

  const handleSetUserId = async (id: string | null) => {
    try {
      if (id) {
        await AsyncStorage.setItem('userId', id);
      } else {
        await AsyncStorage.removeItem('userId');
      }
      setUserId(id);
    } catch (error) {
      console.error('Failed to save user ID to AsyncStorage', error);
    }
  };

  const signOut = async () => {
    await handleSetUserId(null);
  };

  return (
    <AuthContext.Provider value={{ userId, setUserId: handleSetUserId, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
