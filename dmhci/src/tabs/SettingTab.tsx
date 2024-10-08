import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { icons } from '../constants';
import { CustomButton } from '../components';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteStackParamList } from '../../App';
import axios from 'axios';
import { launchImageLibrary } from 'react-native-image-picker';
import { useAuth } from '../../AuthContext';

const SettingTab = () => {
  const navigation = useNavigation<StackNavigationProp<RouteStackParamList>>();
  const { userId, signOut } = useAuth(); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // States for user data
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePic, setProfilePic] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;

      try {
        const response = await axios.get(`http://91.187.135.183:4000/api/users/${userId}`);
        const userData = response.data;

        setFirstName(userData.firstName || '');
        setLastName(userData.lastName || '');
        setAddress(userData.address || '');
        setEmail(userData.email || '');
        setProfilePic(userData.profilePic || null);
        console.log('User ID:', userId);
      } catch (error) {
        console.error('Failed to fetch user data', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const fetchOrders = async () => {
    if (!userId) return;

    try {
      const response = await axios.get(`http://91.187.135.183:4000/api/orders/${userId}`);
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const response = await axios.delete(`http://91.187.135.183:4000/api/orders/${orderId}`);
      console.log('Narudžbina je uspešno otkazana:', response.data);

      // Ažuriraj stanje narudžbina
      setOrders(orders.filter(order => order.id !== orderId));

      // Prikaži obaveštenje o uspešnom otkazivanju
      Alert.alert('Uspešno', 'Narudžbina je uspešno otkazana.');
    } catch (error) {
      console.error('Greška pri otkazivanju narudžbine:', error.response.data.message || 'Greška');
      Alert.alert('Greška', 'Došlo je do greške prilikom otkazivanja narudžbine.');
    }
  };

  const handleSaveChanges = async () => {
    if (!userId) return;

    setIsSubmitting(true);
    try {
      await axios.put(`http://91.187.135.183:4000/api/users/${userId}`, {
        firstName,
        lastName,
        address,
        email,
        password,
        profilePic,
      });
      Alert.alert('Uspešno', 'Vaše izmene su uspešno sačuvane.');
    } catch (error) {
      console.error('Failed to save user data', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditPic = async () => {
    const options = {
      mediaType: 'photo' as const, 
      quality: 1 as 0 | 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1,
    };

    const result = await launchImageLibrary(options);

    if (result.didCancel) {
      console.log('User cancelled image picker');
    } else if (result.errorCode) {
      console.log('Image picker error: ', result.errorCode);
    } else {
      const photo = result.assets ? result.assets[0] : null;

      if (photo && userId) {
        const formData = new FormData();
        formData.append('profilePic', {
          uri: photo.uri,
          type: photo.type,
          name: photo.fileName,
        } as any);

        try {
          const response = await axios.post(
            `http://91.187.135.183:4000/api/users/${userId}/upload`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          );
          setProfilePic(response.data.filePath);
        } catch (error) {
          console.error('Failed to upload profile picture', error);
        }
      }
    }
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Odjava',
      'Da li ste sigurni da želite da se odjavite?',
      [
        {
          text: 'Odustani',
          style: 'cancel',
        },
        {
          text: 'Odjavi se',
          onPress: async () => {
            try {
              await signOut(); 
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              console.error('Failed to sign out', error);
            }
          },
        },
      ]
    );
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
    if (!isModalVisible) {
      fetchOrders(); // Fetch orders when modal opens
    }
  };

  if (isLoading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.profileSection}>
          <TouchableOpacity onPress={handleEditPic}>
            <Image
              source={profilePic ? { uri: `http://91.187.135.183:4000/${profilePic}` } : icons.profile}
              style={styles.profilePic}
            />
          </TouchableOpacity>
          <Text style={styles.nameText}>{firstName} {lastName}</Text>
        </View>
        <View style={styles.formSection}>
          <Text style={styles.label}>Ime</Text>
          <TextInput
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Ime"
            style={styles.input}
          />
          <Text style={styles.label}>Prezime</Text>
          <TextInput
            value={lastName}
            onChangeText={setLastName}
            placeholder="Prezime"
            style={styles.input}
          />
          <Text style={styles.label}>Adresa</Text>
          <TextInput
            value={address}
            onChangeText={setAddress}
            placeholder="Adresa"
            style={styles.input}
          />
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            style={styles.input}
          />
        </View>
        <View style={styles.buttonContainer}>
          <CustomButton
            title={isSubmitting ? "Čuvanje..." : "Sačuvaj izmene"}
            handlePress={handleSaveChanges}  
            isLoading={isSubmitting}
            containerStyle="mt-9"
          />
          <CustomButton
            title="Pogledaj narudžbine"
            handlePress={toggleModal}
            containerStyle="mt-9"
          />
        </View>
      </ScrollView>
      <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
        <Text style={styles.signOutText}>Odjavi se</Text>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Moje Narudžbine</Text>
            {orders.length === 0 ? (
              <Text>Nemate nijednu narudžbinu.</Text>
            ) : (
              <FlatList
                data={orders}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={styles.orderItem}>
                    <Text style={styles.orderText}>
                      Narudžbina ID: {item.id} - {item.status}
                    </Text>
                    <TouchableOpacity onPress={() => handleCancelOrder(item.id)}>
                      <Text style={styles.cancelOrderText}>Otkazi</Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
            )}
            <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Zatvori</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  formSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  signOutButton: {
    padding: 15,
    backgroundColor: '#ff4757',
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  signOutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    width: '100%',
  },
  orderText: {
    fontSize: 16,
  },
  cancelOrderText: {
    color: '#ff4757',
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#ccc',
    borderRadius: 5,
  },
  closeButtonText: {
    fontWeight: 'bold',
  },
});

export default SettingTab;
