import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, Modal, Alert } from 'react-native';
import Background from '../components/Background';
import { getDatabase, ref, onValue, update } from 'firebase/database';
import { getAuth } from 'firebase/auth';

export default function RewardsConfirm({ route, navigation }) {
  const { reward } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [rewardPoints, setRewardPoints] = useState(0);
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      setUserId(user.uid);
      const db = getDatabase();
      const userRef = ref(db, `users/${user.uid}`);

      // Fetch user name and reward points
      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        setUserName(data.name || 'User');
        setRewardPoints(data.reward || 0);
      });
    }
  }, []);

  // Handle reward purchase
  const handlePurchase = () => {
    if (rewardPoints >= reward.points) {
      const newPoints = rewardPoints - reward.points;
      const db = getDatabase();
      const userRef = ref(db, `users/${userId}`);

      // Update the user's reward points after purchase
      update(userRef, { reward: newPoints })
        .then(() => {
          setModalMessage('Successfully Purchased! Coupon will be emailed to you.');
          setModalVisible(true);
        })
        .catch(err => {
          Alert.alert("Error", "Failed to update points. Please try again.");
        });
    } else {
       // Notify user of insufficient points
      const pointsNeeded = reward.points - rewardPoints;
      setModalMessage(`Insufficient points! You're ${pointsNeeded} points away.`);
      setModalVisible(true);
    }
  };

  // Close modal and navigate back to the previous screen
  const closeModalAndNavigateBack = () => {
    setModalVisible(false);
    navigation.goBack();
  };

  return (
    <View style={styles.screenContainer}>
      <Background>
        <View style={styles.headerContainer}>
          <Text style={styles.welcome}>Welcome {userName}</Text>
          <TouchableOpacity style={styles.topBackButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.activity}>Reward Details</Text>

        <View style={styles.container}>
          <View style={styles.rect}>
            <View style={styles.row}>
              <Image
                source={reward.image}
                resizeMode="contain"
                style={styles.image}
              />
              <View style={styles.textContainer}>
                <Text style={styles.title}>Item: {reward.title}</Text>
                <Text style={styles.points}>Points: {reward.points}</Text>
                <Text style={styles.userPoints}>Your Points: {rewardPoints}</Text>
              </View>
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={[styles.actionButton, styles.purchaseButton]} onPress={handlePurchase}>
                <Text style={styles.buttonText}>Purchase</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, styles.rectBackButton]} onPress={() => navigation.goBack()}>
                <Text style={styles.buttonText}>Back</Text>
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
            <Text style={styles.modalText}>{modalMessage}</Text>
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
  topBackButton: {
    marginTop: 52,
    padding: 10,
    backgroundColor: '#4bb0eb',
    borderRadius: 5,
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
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
    width: '100%',
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 20,
    alignItems: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
  },
  textContainer: {
    flex: 1,
    marginLeft: 20,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    flexWrap: 'wrap',
  },
  points: {
    fontSize: 16,
    flexWrap: 'wrap',
  },
  userPoints: {
    fontSize: 16,
    marginTop: 5,
    color: '#4bb0eb',
  },
  image: {
    width: 100,
    height: 100,
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
  purchaseButton: {
    backgroundColor: '#4bb0eb',
  },
  rectBackButton: {
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
});
