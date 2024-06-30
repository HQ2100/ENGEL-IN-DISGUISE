import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import Background from '../components/Background';
import { theme } from '../core/theme';

export default function RewardsPage({ navigation }) {
  const rewards = [
    { image: require('../assets/reward1.png'), description: 'FoodPanda $20 Coupon - 2000 Points' },
    { image: require('../assets/reward2.png'), description: 'FairPrice $10 Coupon - 1000 Points' },
    { image: require('../assets/reward3.png'), description: 'YaKun $5 Coupon - 500 Points' },
    { image: require('../assets/reward4.png'), description: 'Singapore Zoo Entry - 5000 Points' },
    { image: require('../assets/reward5.png'), description: 'Singapore Flyer Entry - 5000 Points' },
    { image: require('../assets/reward6.png'), description: 'Popular $10 Coupon - 1000 Points' },
  ];

  const handleNavigation = (reward) => {
    navigation.navigate('RewardsConfirm', { reward });
  };

  return (
    <View style={styles.screenContainer}>
      <Background>
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.welcome}>Welcome Tan</Text>
            <Text style={styles.rewardPoints}>Reward Points: </Text>
          </View>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.activity}>Rewards Shop</Text>

        <View style={styles.rewardsContainer}>
          {rewards.map((reward, index) => (
            <TouchableOpacity key={index} style={styles.rewardBox} onPress={() => handleNavigation(reward)}>
              <Image
                source={reward.image}
                resizeMode="contain"
                style={styles.rewardImage}
              />
              <Text style={styles.rewardDescription}>{reward.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Background>
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
  rewardPoints: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: '400',
    color: '#121212',
    height: 19,
    marginTop: 5,
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
  rewardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 20,
  },
  rewardBox: {
    width: '45%', 
    marginBottom: 20,
    alignItems: 'center',
  },
  rewardImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  rewardDescription: {
    textAlign: 'center',
    fontSize: 14,
  },
  backButton: {
    marginTop: 52,
    padding: 10,
    backgroundColor: '#4bb0eb',
    borderRadius: 5,
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
