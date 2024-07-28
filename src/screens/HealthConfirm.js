import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, Modal, Linking, Alert } from 'react-native';
import Background from '../components/Background';
import { getDatabase, ref, onValue } from 'firebase/database';

export default function HealthConfirm({ route, navigation }) {
  const { center, userId, userName } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [contact, setContact] = useState('');

  // Fetch contact info for the health center
  useEffect(() => {
    const db = getDatabase();
    const centerRef = ref(db, `Health/${center.key}`);
    onValue(centerRef, (snapshot) => {
      const data = snapshot.val();
      setContact(data.contact); 
    });
  }, [center.key]);

  // Open Google Maps to the center's location
  const handleMap = () => {
    const location = center.location.split(' (~')[0];
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
    Linking.openURL(url).catch(err => Alert.alert("Error", "Couldn't load page"));
  };

  // Navigate back to the Dashboard screen
  const handleBack = () => {
    navigation.navigate('Dashboard');
  };

  // Show contact information modal
  const handleContact = () => {
    setModalVisible(true);
  };

  // Close modal and navigate to the Health screen
  const closeModalAndNavigateBack = () => {
    setModalVisible(false);
    navigation.navigate('Health');
  };

  return (
    <View style={styles.screenContainer}>
      <Background>
        <View style={styles.headerContainer}>
          <Text style={styles.welcome}>Welcome {userName}</Text>
        </View>

        <Text style={styles.activity}>HealthCare Details</Text>

        <View style={styles.container}>
          <View style={styles.rect}>
            <View style={styles.row}>
              <Image
                source={center.image}
                resizeMode="contain"
                style={styles.image}
              />
              <View style={styles.textContainer}>
                <Text style={styles.title}>{center.title}</Text>
                <Text style={styles.location}>Location: {center.location}</Text>
                <Text style={styles.time}>Operating Hour: {center.time}</Text>
                <TouchableOpacity style={styles.mapButton} onPress={handleMap}>
                  <Text style={styles.mapButtonText}>Open Map</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={[styles.actionButton, styles.backButton]} onPress={handleBack}>
                <Text style={styles.buttonText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, styles.cancelButton]} onPress={handleContact}>
                <Text style={styles.buttonText}>Contact us</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Background>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Contact Us at: {contact}</Text>
            <TouchableOpacity style={styles.modalButton} onPress={closeModalAndNavigateBack}>
              <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    borderWidth: 3,
    borderColor: 'black',
    padding: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
  },
  welcome: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: '400',
    color: '#121212',
    height: 19,
    marginTop: 52,
  },
  activity: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 'bold',
    color: '#121212',
    fontSize: 26,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 5,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    padding: 20,
  },
  rect: {
    width: '135%',
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 20,
    alignItems: 'flex-start',
    marginTop: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    width: '100%',
  },
  textContainer: {
    flex: 1,
    marginLeft: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    flexWrap: 'wrap',
  },
  location: {
    fontSize: 13,
    marginBottom: 5,
    flexWrap: 'wrap',
  },
  time: {
    fontSize: 13,
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  image: {
    width: 100,
    height: 100,
  },
  mapButton: {
    marginTop: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#4bb0eb',
    borderRadius: 200,
    alignItems: 'center',
  },
  mapButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: '#4bb0eb',
  },
  cancelButton: {
    backgroundColor: '#eb4b4b',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#4bb0eb',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonGap: {
    height: 10,
  },
});
