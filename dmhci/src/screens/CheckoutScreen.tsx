import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
  TextInput,
  Modal,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome"; 
import { StackNavigationProp } from "@react-navigation/stack";
import { useStripe } from "@stripe/stripe-react-native";

const steps = [
  { title: "Adresa", content: "Select Address" },
  { title: "Plaćanje", content: "Choose Payment Method" },
  { title: "Detalji narudžbine", content: "Order Summary" },
];

type RouteStackParamList = {
  Checkout: {
    cartItems: any[];
  };
  HomeScreen: undefined;
};

type CheckoutScreenRouteProp = RouteProp<RouteStackParamList, "Checkout">;

const CheckoutScreen = () => {
  const route = useRoute<CheckoutScreenRouteProp>();
  const navigation = useNavigation<StackNavigationProp<RouteStackParamList>>();
  const { cartItems } = route.params || {};

  const stripe = useStripe();

  const [addresses, setAddresses] = useState<string[]>([]);
  const [userId, setUserId] = useState<string>("");
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [paymentOption, setPaymentOption] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [cart, setCart] = useState(cartItems);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [newAddress, setNewAddress] = useState<string>("");
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState<boolean>(false); // State for success modal

  const total = cart
    ?.map((item) => item.itemDetails.price * item.quantity)
    .reduce((curr, prev) => curr + prev, 0);

  useEffect(() => {
    fetchUserId();
  }, []);

  const fetchUserId = async () => {
    setLoading(true);
    try {
      const storedUserId = await AsyncStorage.getItem("userId");
      if (storedUserId) {
        setUserId(storedUserId);
        await fetchAddresses(storedUserId);
      }
    } catch (error) {
      console.error("Error fetching userId from AsyncStorage:", error);
      setError("Unable to fetch user ID");
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = async (userId: string) => {
    try {
      const response = await axios.get(
        `http://91.187.135.183:4000/api/users/user/${userId}/address` // Novi API endpoint
      );
      
      // Provera da li je odgovor uspešan i da li sadrži adresu
      if (response.data && response.data.address) {
        setAddresses([response.data.address]); // Postavljanje adrese
      } else {
        setError("No address found for this user");
      }
    } catch (error) {
      console.log("Error fetching address:", error);
      setError("Unable to fetch address");
    }
  };
  

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const orderData = {
        user: userId,
        items: cart.map(item => ({
          productId: item.itemDetails._id.toString(),
          quantity: item.quantity,
          price: item.itemDetails.price,
        })),
        totalPrice: total,
        shippingAddress: selectedAddress,
        paymentMethod: paymentOption,
      };
      
      const response = await axios.post(
        "http://91.187.135.183:4000/api/orders",
        orderData
      );
      
      if (response.status === 201) {
        // Očisti korpu i ažuriraj AsyncStorage
        setCart([]);
        await AsyncStorage.setItem('cart', JSON.stringify([])); // Očisti korpu iz AsyncStorage
        setIsSuccessModalVisible(true);
        setTimeout(() => {
          setIsSuccessModalVisible(false);
          navigation.navigate('HomeScreen'); // Ili gde god trebaš da ideš nakon uspešne kupovine
        }, 3000);
      } else {
        setError("Order creation failed");
      }
    } catch (error) {
      setError("Unable to place order");
    } finally {
      setLoading(false);
    }
  };
  
  const handlePayment = async () => {
    setLoading(true);
    try {
      // Koristiš tvoj backend API za kreiranje Stripe Payment Intenta
      const response = await axios.post(
        "http://91.187.135.183:4000/api/create-stripe-order",
        { amount: total * 100 } // Stripe očekuje iznos u centima
      );
  
      const { clientSecret } = response.data;
  
      // Potvrdi plaćanje koristeći Stripe clientSecret
      const { error: stripeError } = await stripe.confirmPayment(clientSecret, {
        paymentMethodType: "Card",
      });
  
      if (stripeError) {
        console.log("Stripe payment error:", stripeError);
        setError("Payment failed");
      } else {
        setPaymentOption("card");
        handlePlaceOrder();  // Kreiraj narudžbinu nakon uspešnog plaćanja
      }
    } catch (error) {
      console.log("Payment error:", error);
      setError("Payment failed");
    } finally {
      setLoading(false);
    }
  };
  

  const handleNextStep = () => {
    if (currentStep === 0 && !selectedAddress) {
      setError("Please select an address");
      return;
    }
    if (currentStep === 1 && !paymentOption) {
      setError("Please select a payment option");
      return;
    }
  
    // Ako korisnik odabere plaćanje pouzećem, preskoči Stripe i odmah sačuvaj narudžbinu
    if (currentStep === 1 && paymentOption === "cash") {
      handlePlaceOrder(); // Pozivamo funkciju za kreiranje narudžbine
      return;
    }
  
    // Ako je odabrana kartica, idemo na Stripe plaćanje
    if (currentStep === 1 && paymentOption === "card") {
      handlePayment();
      return;
    }
  
    setError("");
    setCurrentStep(currentStep + 1); // Napredujemo na sledeći korak
  };
  

  
  const handleAddNewAddress = () => {
    if (newAddress.trim() !== "") {
      setAddresses([...addresses, newAddress]);
      setSelectedAddress(newAddress);
      setNewAddress("");
      setIsModalVisible(false);
    } else {
      Alert.alert("Please enter a valid address");
    }
  };

  const renderStepsHeader = () => {
    return (
      <View style={styles.stepsHeader}>
        {steps.map((step, index) => (
          <View key={index} style={styles.step}>
            <Text style={[styles.stepText, currentStep >= index && styles.stepCompleted]}>
              {step.title}
            </Text>
            {currentStep > index && (
              <Icon name="check-circle" size={20} color="#ff6600" />
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pošalji na adresu...</Text>
            {addresses.length === 0 ? (
              <Text style={styles.errorText}>
                {loading ? "Učitavanje adresa..." : "Nijedna adresa nije pronadjena za vaš nalog"}
              </Text>
            ) : (
              addresses.map((address, index) => (
                <Pressable
                  key={index}
                  style={[
                    styles.addressContainer,
                    address === selectedAddress && styles.selectedAddress,
                  ]}
                  onPress={() => setSelectedAddress(address)}
                >
                  <Text style={styles.addressText}>{address}</Text>
                </Pressable>
              ))
            )}
            <Pressable
              style={styles.addAddressButton}
              onPress={() => setIsModalVisible(true)}
            >
              <Text style={styles.addAddressButtonText}>Dodaj novu adresu</Text>
            </Pressable>
            <Pressable
              style={styles.nextButton}
              onPress={handleNextStep}
            >
              <Text style={styles.nextButtonText}>Dalje</Text>
            </Pressable>
          </View>
        );
        case 1:
          return (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Odabir plaćanja</Text>
              <Pressable
                style={[
                  styles.paymentOption,
                  paymentOption === "cash" && styles.selectedOption,
                ]}
                onPress={() => {
                  setPaymentOption("cash");
                  setCurrentStep(currentStep + 1); // Prelazimo na sledeći korak
                }}
              >
                <Text style={styles.optionText}>Plaćanje pouzećem</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.paymentOption,
                  paymentOption === "card" && styles.selectedOption,
                ]}
                onPress={() => {
                  setPaymentOption("card");
                  handlePayment(); // Nastavlja sa Stripe plaćanjem
                }}
              >
                <Text style={styles.optionText}>Credit/Debit Card (Stripe)</Text>
              </Pressable>
            </View>
          );
        
      case 2:
        return (
          <View style={styles.section}>
            <View style={styles.orderSummary}>
              <Text style={styles.sectionTitle}>Detalji narudžbine</Text>
              {cart.map((item, index) => (
                <View key={index} style={styles.orderItem}>
                  <Image source={{ uri: item.itemDetails.image }} style={styles.itemImage} />
                  <View style={styles.itemDetails}>
                    <Text style={styles.itemName}>{item.itemDetails.title}</Text>
                    <Text style={styles.itemPrice}>
                      {item.quantity} x {item.itemDetails.price} $
                    </Text>
                  </View>
                </View>
              ))}
              <View style={styles.paymentDetails}>
                <Text style={styles.paymentText}>
                  Odabrani način plaćanja: {paymentOption === 'cash' ? 'Plaćanje pouzećem' : 'Credit/Debit Card (Stripe)'}
                </Text>
              </View>
              <Text style={styles.shippingFee}>Cena dostave: 200 RSD</Text>
              <Text style={styles.totalPrice}>
                Ukupno: {total + 200} $
              </Text>
            </View>
            
            <Pressable
              style={styles.placeOrderButton}
              onPress={handlePlaceOrder}
            >
              <Text style={styles.placeOrderButtonText}>Obavi kupovinu</Text>
            </Pressable>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {renderStepsHeader()}
      <ScrollView style={styles.scrollContainer}>
        {renderStepContent()}
      </ScrollView>
      {loading && <ActivityIndicator size="large" color="#ff6600" />}
      {error && <Text style={styles.errorText}>{error}</Text>}
      
      {/* Modal for Adding New Address */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.addressInput}
              placeholder="Enter new address"
              value={newAddress}
              onChangeText={setNewAddress}
            />
            <Pressable
              style={styles.saveButton}
              onPress={handleAddNewAddress}
            >
              <Text style={styles.saveButtonText}>Sačuvaj adresu</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal
        visible={isSuccessModalVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.successModalContainer}>
          <View style={styles.successModalContent}>
            <Image source={require("../assets/images/zavrseno.jpeg")} style={styles.successImage} />
            <Text style={styles.successText}>Kupovina je uspešno obavljena!</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CheckoutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  stepsHeader: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
    backgroundColor: "#f3f3f3",
  },
  step: {
    alignItems: "center",
  },
  stepText: {
    fontSize: 16,
    color: "#888",
  },
  stepCompleted: {
    fontWeight: "bold",
    color: "#ff6600",
  },
  scrollContainer: {
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  addressContainer: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
  selectedAddress: {
    borderColor: "#ff6600",
  },
  addressText: {
    fontSize: 16,
  },
  addAddressButton: {
    padding: 15,
    backgroundColor: "#ff6600",
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  addAddressButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  nextButton: {
    padding: 15,
    backgroundColor: "#ff6600",
    borderRadius: 5,
    marginTop: 20,
    alignItems: "center",
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  paymentOption: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
  selectedOption: {
    borderColor: "#ff6600",
  },
  optionText: {
    fontSize: 16,
  },
  placeOrderButton: {
    padding: 15,
    backgroundColor: "#ff6600",
    borderRadius: 5,
    alignItems: "center",
  },
  placeOrderButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 5,
    width: "80%",
  },
  addressInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  saveButton: {
    padding: 15,
    backgroundColor: "#ff6600",
    borderRadius: 5,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  successModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  successModalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  successImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  successText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemPrice: {
    fontSize: 16,
  },
  shippingFee: {
    fontSize: 16,
    marginTop: 10, // Razmak između liste proizvoda i cene dostave
    fontWeight: "bold",
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ff6600", // Boja može biti u skladu sa temom aplikacije
    marginTop: 15, // Razmak između cene dostave i sveukupne cene
    textAlign: "right", // Poravnanje sveukupne cene na desnu stranu
},
orderSummary: {
  marginTop: 40,
  marginBottom: 20,
  padding: 10,
  backgroundColor: "#f9f9f9",
  borderRadius: 5,
},
orderItem: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center", // Poravnanje slike sa tekstom
  marginBottom: 10,
},
itemImage: {
  width: 50,
  height: 50,
  marginRight: 10, // Razmak između slike i teksta
},
itemDetails: {
  flex: 1, // Omogućava da tekst zauzme preostali prostor
},
paymentDetails: {
  marginTop: 10, // Razmak između liste proizvoda i detalja o plaćanju
},
paymentText: {
  fontSize: 16,
  fontWeight: "bold",
},
});
