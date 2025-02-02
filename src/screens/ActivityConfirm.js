import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, Modal, Linking, Alert } from 'react-native';
import Background from '../components/Background';
import { getDatabase, ref, onValue, update, remove } from 'firebase/database';

const imageMap = {
  "walk.png": require("../assets/walk.png"),
  "taichi.png": require("../assets/taichi.png"),
  "dance.png": require("../assets/dance.png"),
  "default.png": require("../assets/default.png"), // Default image if image not able to render
};

export default function ActivityConfirm({ route, navigation }) {
  const { activity: initialActivity, userId } = route.params;
  const [activity, setActivity] = useState(initialActivity);
  const [modalVisible, setModalVisible] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [userNameState, setUserNameState] = useState('');

  // Fetch and monitor user and activity registration state
  useEffect(() => {
    if (userId) {
      const db = getDatabase();
      const userRef = ref(db, `users/${userId}`);
      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        setUserNameState(data.name || 'User');
      });

      const activityRef = ref(db, `users/${userId}/registeredActivities/${initialActivity.key}`);
      onValue(activityRef, (snapshot) => {
        if (snapshot.exists()) {
          setIsRegistered(true);
        } else {
          setIsRegistered(false);
        }
      });
    }

    // Fetch full activity details if not present
    if (!initialActivity.location) {
      const db = getDatabase();
      const activityRef = ref(db, `Activity/${initialActivity.key}`);
      onValue(activityRef, (snapshot) => {
        if (snapshot.exists()) {
          setActivity({ ...snapshot.val(), key: initialActivity.key });
        }
      });
    }
  }, [userId, initialActivity]);

  // Navigation and UI interactions
  const handleMap = () => {
    const location = activity.location.split(' (~')[0];
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
    Linking.openURL(url).catch(err => Alert.alert("Error", "Couldn't load page"));
  };

  const handleBack = () => {
    navigation.goBack();
  };

   // Handle registration or cancellation actions
  const handleRegister = () => {
    const db = getDatabase();
    const activityRef = ref(db, `users/${userId}/registeredActivities/${activity.key}`);
    update(activityRef, { ...activity })
      .then(() => {
        setIsRegistered(true);
        setModalVisible(false);
      })
      .catch(err => Alert.alert("Error", "Couldn't register for activity"));
  };

  // Handle cancellation of regitration
  const handleCancel = () => {
    setModalVisible(true);
  };

  // Handle update of database to cancel
  const handleConfirmCancel = () => {
    const db = getDatabase();
    const activityRef = ref(db, `users/${userId}/registeredActivities/${activity.key}`);
    remove(activityRef)
      .then(() => {
        setIsRegistered(false);
        setModalVisible(false);
      })
      .catch(err => Alert.alert("Error", "Couldn't cancel registration"));
  };

  return (
    <View style={styles.screenContainer}>
      <Background>
        <View style={styles.headerContainer}>
          <Text style={styles.welcome}>Welcome {userNameState}</Text>
        </View>

        <Text style={styles.activity}>Activity Details</Text>

        <View style={styles.container}>
          <View style={styles.rect}>
            <Text style={styles.confirm}>
              {isRegistered ? "Successfully Registered!" : "Not Registered"}
            </Text>
            <View style={styles.row}>
              <Image
                source={imageMap[activity.image] || imageMap["default.png"]}
                resizeMode="contain"
                style={styles.image}
              />
              <View style={styles.textContainer}>
                <Text style={styles.title}>{activity.title}</Text>
                <Text style={styles.location}>Location: {activity.location}</Text>
                <Text style={styles.time}>Time: {activity.time}</Text>
                <TouchableOpacity style={styles.mapButton} onPress={handleMap}>
                  <Text style={styles.mapButtonText}>Open Map</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.remarksContainer}>
              <Text style={styles.remarksHeader}>Remarks:</Text>
              <Text style={styles.remarks}>{activity.remarks || 'No remarks available'}</Text>
              <Text style={styles.points}>Points to be earned after completing: {activity.points}</Text>
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={[styles.actionButton, styles.backButton]} onPress={handleBack}>
                <Text style={styles.buttonText}>Back</Text>
              </TouchableOpacity>
              {isRegistered ? (
                <TouchableOpacity style={[styles.actionButton, styles.cancelButton]} onPress={handleCancel}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={[styles.actionButton, styles.registerButton]} onPress={handleRegister}>
                  <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>
              )}
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
            <Text style={styles.modalText}>Are you sure you want to cancel your registration?</Text>
            <TouchableOpacity style={styles.modalButton} onPress={handleConfirmCancel}>
              <Text style={styles.buttonText}>Yes, Cancel</Text>
            </TouchableOpacity>
            <View style={styles.buttonGap} />
            <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>No, Go Back</Text>
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
  confirm: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 'bold',
    color: '#121212',
    fontSize: 26,
    textAlign: 'center',
    width: '100%',
    marginTop: 10,
    marginBottom: 15,
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
  remarksContainer: {
    alignItems: 'flex-start',
    marginLeft: 10,
  },
  remarksHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 10,
  },
  remarks: {
    fontSize: 13,
    marginBottom: 5,
  },
  points: {
    fontSize: 13,
    marginBottom: 10,
    fontWeight: 'bold',
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
  registerButton: {
    backgroundColor: '#4CAF50', 
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
