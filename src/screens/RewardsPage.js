import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import Background from '../components/Background';
import { getDatabase, ref, onValue } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const imageMap = {
  "reward1.png": require("../assets/reward1.png"),
  "reward2.png": require("../assets/reward2.png"),
  "reward3.png": require("../assets/reward3.png"),
  "reward4.png": require("../assets/reward4.png"),
  "reward5.png": require("../assets/reward5.png"),
  "reward6.png": require("../assets/reward6.png"),
};

export default function RewardsPage({ navigation }) {
  const [rewards, setRewards] = useState([]);
  const [userName, setUserName] = useState('');
  const [rewardPoints, setRewardPoints] = useState(0);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const db = getDatabase();
      const userRef = ref(db, `users/${user.uid}`);

      // Fetch user name and reward points
      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        setUserName(data.name || 'User');
        setRewardPoints(data.reward || 0); 
      });

      // Fetch rewards data
      const rewardsRef = ref(db, 'Rewards');
      onValue(rewardsRef, (snapshot) => {
        const data = snapshot.val();
        const fetchedRewards = Object.keys(data).map(key => ({
          ...data[key],
          key: key,
          image: imageMap[data[key].image],  // Ensure data[key].image matches a key in imageMap
        }));
        setRewards(fetchedRewards);
      });
    }
  }, []);

  // Navigate to RewardsConfirm screen with selected reward details
  const handleNavigation = (reward) => {
    navigation.navigate('RewardsConfirm', { reward });
  };

  return (
    <View style={styles.screenContainer}>
      <Background>
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.welcome}>Welcome {userName}</Text>
            <Text style={styles.rewardPoints}>Reward Points: {rewardPoints}</Text>
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
              <Text style={styles.rewardDescription}>{reward.title} - {reward.points} Points</Text>
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
