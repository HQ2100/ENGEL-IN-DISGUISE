import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import Background from '../components/Background';
import { getDatabase, ref, onValue } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const imageMap = {
  "raffles.png": require("../assets/raffles.png"),
  "family.png": require("../assets/family.png"),
  "healthway.png": require("../assets/healthway.png"),
};

export default function Health({ navigation }) {
  const [healthCenters, setHealthCenters] = useState([]);
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      setUserId(user.uid);
      const db = getDatabase();
      const userRef = ref(db, `users/${user.uid}`);

      // Fetch user name
      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        setUserName(data.name || 'User');
      });

      // Fetch health centers data
      const healthCentersRef = ref(db, 'Health');
      onValue(healthCentersRef, (snapshot) => {
        const data = snapshot.val();
        const fetchedCenters = Object.keys(data).map(key => ({
          ...data[key],
          key: key,
          image: imageMap[data[key].image],  // Ensure data[key].image matches a key in imageMap
        }));
        fetchedCenters.sort((a, b) => a.distance - b.distance);
        setHealthCenters(fetchedCenters);
      });
    }
  }, []);

  const formatDistance = (distance) => {
    if (distance >= 1000) {
      return `${(distance / 1000).toFixed(1)}km`;
    }
    return `${distance}m`;
  };

  const handleView = (center) => {
    navigation.navigate('HealthConfirm', { center, userId, userName });
  };

  return (
    <View style={styles.screenContainer}>
      <Background>
        <View style={styles.headerContainer}>
          <Text style={styles.welcome}>Welcome {userName}</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.activity}>HealthCare</Text>
        <View style={styles.container}>
          <View style={styles.rect}>
            {healthCenters.map((center, index) => (
              <View key={index} style={styles.row}>
                <Image
                  source={center.image}
                  resizeMode="contain"
                  style={styles.image}
                />
                <View style={styles.textContainer}>
                  <Text style={styles.title}>{center.title}</Text>
                  <Text style={styles.location}>Location: {center.location} (~{formatDistance(center.distance)} away)</Text>
                  <Text style={styles.time}>Operating Hour: {center.time}</Text>
                  <TouchableOpacity style={styles.registerButton} onPress={() => handleView(center)}>
                    <Text style={styles.registerButtonText}>View</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
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
  activity: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 'bold', 
    color: '#121212',
    fontSize: 26, 
    textAlign: 'center', 
    width: '100%',
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
  registerButton: {
    marginTop: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#4bb0eb',
    borderRadius: 200,
    alignItems: 'center',
  },
  registerButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
