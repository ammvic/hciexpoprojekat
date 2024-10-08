import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  StyleSheet,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { icons } from '../constants';

type CustomSearchProps = {
  placeholder?: string;
  initialQuery: string;
};

type ScreenNavigationProps = StackNavigationProp<RootStackParamList, 'Search'>;

type RootStackParamList = {
  Search: { query: string } | undefined;
};

const CustomSearch: React.FC<CustomSearchProps> = ({
  placeholder,
  initialQuery,
}) => {
  const navigation = useNavigation<ScreenNavigationProps>();
  const [isQRScannerVisible, setQRScannerVisible] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [isLinkAlertVisible, setLinkAlertVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    setQRScannerVisible(false);
    setScannedData(data); // Save the scanned data
    setLinkAlertVisible(true); // Show the alert with the link
  };

  const handleOpenScanner = () => {
    if (hasPermission === null) {
      Alert.alert('Dozvola nije zatražena');
    } else if (hasPermission === false) {
      Alert.alert('Dozvola odbijena', 'Dozvola za korišćenje kamere je odbijena');
    } else {
      setQRScannerVisible(true);
    }
  };

  const handleLinkOpen = async () => {
    if (scannedData) {
      const supported = await Linking.canOpenURL(scannedData);
      if (supported) {
        await Linking.openURL(scannedData);
      } else {
        Alert.alert("Greška", "Ne može se otvoriti link: " + scannedData);
      }
    }
  };

  return (
    <View style={{ flex: 1, marginHorizontal: 12 }}>
      <View style={styles.searchContainer}>
        <TouchableOpacity onPress={handleOpenScanner}>
          <Image source={icons.qrcode} style={styles.icon} resizeMode="contain" />
        </TouchableOpacity>
        <Text style={styles.textInput}>
          {scannedData || (placeholder || 'Qr code pretraga..')}
        </Text>
      </View>

      {/* Link Alert Modal */}
      {isLinkAlertVisible && (
        <Modal
          visible={isLinkAlertVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setLinkAlertVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.alertContent}>
              <Text style={styles.alertText}>Skeniran QR kod</Text>
              <TouchableOpacity onPress={handleLinkOpen}>
                <Text style={styles.linkText}>{scannedData}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonTouchable}
                onPress={() => setLinkAlertVisible(false)}
              >
                <Text style={styles.buttonText}>Zatvori</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* QR Code Scanner Modal */}
      {isQRScannerVisible && (
        <Modal
          visible={isQRScannerVisible}
          animationType="slide"
          onRequestClose={() => setQRScannerVisible(false)}
          transparent={true}
        >
          <View style={styles.modalContainer}>
            <View style={styles.cameraWrapper}>
              <BarCodeScanner
                onBarCodeScanned={handleBarcodeScanned}
                style={StyleSheet.absoluteFillObject}
              />
            </View>
            <View style={styles.overlay}>
              <Text style={styles.centerText}>Skenirajte QR kod</Text>
              <TouchableOpacity
                style={styles.buttonTouchable}
                onPress={() => setQRScannerVisible(false)}
              >
                <Text style={styles.buttonText}>Otkaži</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingRight: 20,
    height: 60,
    marginVertical: 10,
  },
  icon: {
    width: 24,
    height: 24,
    marginHorizontal: 16,
  },
  textInput: {
    flex: 1,
    fontSize: 18,
    textAlign: 'center', // Center the text
    color: '#BBBBBB',
    backgroundColor: 'white',
    fontFamily: 'Poppins-Regular',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  alertContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  alertText: {
    fontSize: 18,
    marginBottom: 10,
  },
  linkText: {
    fontSize: 16,
    color: 'blue',
    textDecorationLine: 'underline',
    marginBottom: 20,
  },
  buttonTouchable: {
    padding: 16,
  },
  buttonText: {
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
  },
  cameraWrapper: {
    width: '90%',
    height: '60%',
    borderRadius: 10,
    overflow: 'hidden',
  },
  overlay: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  centerText: {
    fontSize: 18,
    padding: 16,
    color: '#FFF',
    textAlign: 'center',
  },
});

export default CustomSearch;
