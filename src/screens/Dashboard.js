import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/WelcomeHeader';
import Paragraph from '../components/Paragraph';
import Button from '../components/Button';
import { theme } from '../core/theme';

export default function Dashboard({ navigation }) {
  return (
    <Background>
      <Text style={styles.welcome}>Welcome Tan</Text>
      <Text style={styles.rewardPoints}>Reward Points :</Text>
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
        <TouchableOpacity onPress={() => navigation.navigate('SomeScreen')}>
          <View style={[styles.button, styles.button1]}>
            <Text style={styles.buttonText}>Friends</Text>
          </View>
        </TouchableOpacity>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  welcome: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: '400',
    color: '#121212',
    height: 19,
    width: 136,
    marginTop: 52,
    marginLeft: -190,
  },
  rewardPoints: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: '400',
    color: '#121212',
    height: 26,
    width: 121,
    marginTop: 10,
    marginLeft: -200,
  },
  image2: {
    width: 261,
    height: 276,
    marginTop: 50,
    marginLeft: 0,
    resizeMode: 'contain',
  },
  button: {
    width: 124,
    height: 60,
    backgroundColor: '#4bb0eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button1: {
    marginLeft: 31,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonRow: {
    height: 60,
    flexDirection: 'row',
    marginTop: 43,
    marginLeft: 34,
    marginRight: 62,
  },
  button2Row: {
    height: 60,
    flexDirection: 'row',
    marginTop: 29,
    marginLeft: 34,
    marginRight: 63,
  },
});
