import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/WelcomeHeader';
import Paragraph from '../components/Paragraph';
import Button from '../components/Button';
import { theme } from '../core/theme';
import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { getAuth } from 'firebase/auth';

export default function Dashboard({ navigation }) {
  const [userName, setUserName] = useState('');
  const [rewardPoints, setRewardPoints] = useState(0);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    const db = getDatabase();
    const userRef = ref(db, `users/${user.uid}`);

    // Set up a listener to update reward points in real-time
    const unsubscribe = onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      setUserName(data.name);
      setRewardPoints(data.reward); // Directly use the stored reward points
    });

    // Clean up the listener on unmount
    return () => unsubscribe();
  }, []);

  return (
    <Background>
      <View style={styles.textContainer}>
        <Text style={styles.welcome}>Welcome {userName}</Text>
        <Text style={styles.rewardPoints}>Reward Points: {rewardPoints}</Text>
      </View>
      <Image
        source={require('../assets/angel-4987166_1280.png')}
        style={styles.image2}
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={() => navigation.navigate('Activities')}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Activity</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Health')}>
          <View style={[styles.button, styles.button1]}>
            <Text style={styles.buttonText}>Healthcare</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.button2Row}>
        <TouchableOpacity onPress={() => navigation.navigate('RewardsPage')}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Rewards</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Friends')}>
          <View style={[styles.button, styles.button1]}>
            <Text style={styles.buttonText}>Friends</Text>
          </View>
        </TouchableOpacity>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  textContainer: {
    alignSelf: 'stretch', 
    alignItems: 'flex-start', 
    marginLeft: 10, 
  },
  welcome: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: '400',
    color: '#121212',
    fontSize: 16,
    marginTop: 10,
    marginLeft: 0, 
  },
  rewardPoints: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: '400',
    color: '#121212',
    fontSize: 16,
    marginTop: 5,
    marginLeft: 0, 
  },
  image2: {
    width: 300, 
    height: 300, 
    marginTop: 20, 
    alignSelf: 'center', 
    resizeMode: 'contain', 
  },
  button: {
    width: 124,
    height: 60,
    backgroundColor: '#4bb0eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5, 
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center', 
    marginTop: 20, 
  },
  button2Row: {
    flexDirection: 'row',
    justifyContent: 'center', 
    marginTop: 10, 
  },
});
