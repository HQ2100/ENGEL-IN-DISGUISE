import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import Background from '../components/Background';
import { getDatabase, ref, onValue } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const imageMap = {
  "walk.png": require("../assets/walk.png"),
  "taichi.png": require("../assets/taichi.png"),
  "dance.png": require("../assets/dance.png"),
};

export default function Activities({ navigation }) {
  const [activities, setActivities] = useState([]);
  const [registeredActivities, setRegisteredActivities] = useState({});
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        const db = getDatabase();
        const userRef = ref(db, `users/${user.uid}`);
        
        // Fetch user name and registered activities
        onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          setUserName(data.name);
          setRegisteredActivities(data.registeredActivities || {});
        });
      } else {
        // Handle user not logged in
      }
    });

    const db = getDatabase();
    const activitiesRef = ref(db, 'Activity');
    onValue(activitiesRef, (snapshot) => {
      const data = snapshot.val();
      const fetchedActivities = Object.keys(data).map(key => ({
        ...data[key],
        key: key,
        image: data[key].image,  // Pass image name
        imageSource: imageMap[data[key].image],  // Ensure data[key].image matches a key in imageMap
        distance: parseDistance(data[key].distance)
      }));
      fetchedActivities.sort((a, b) => a.distance - b.distance);
      setActivities(fetchedActivities);
    });
  }, []);

  const parseDistance = (distance) => {
    if (typeof distance === 'string') {
      distance = distance.trim().toLowerCase();
      if (distance.endsWith('km')) {
        return parseFloat(distance) * 1000;
      } else if (distance.endsWith('m')) {
        return parseFloat(distance);
      }
    }
    return parseFloat(distance); // Default case if distance is already in meters as a number
  };

  const formatDistance = (distance) => {
    if (distance >= 1000) {
      return `${(distance / 1000).toFixed(1)}km`;
    }
    return `${distance}m`;
  };

  const handleRegister = (activity) => {
    if (userId) {
      navigation.navigate('ActivityConfirm', { activity, userId });
    } else {
      console.error("User not authenticated");
    }
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
        <Text style={styles.activity}>Activities</Text>
        <View style={styles.container}>
          <View style={styles.rect}>
            {activities.map((activity, index) => (
              <View key={index} style={styles.row}>
                <Image
                  source={activity.imageSource}
                  resizeMode="contain"
                  style={styles.image}
                />
                <View style={styles.textContainer}>
                  <Text style={styles.title}>{activity.title}</Text>
                  <Text style={styles.location}>Location: {activity.location} (~{formatDistance(activity.distance)} away)</Text>
                  <Text style={styles.time}>Time: {activity.time}</Text>
                  <TouchableOpacity
                    style={[
                      styles.viewInfoButton,
                      registeredActivities[activity.key] && styles.registeredButton,
                    ]}
                    onPress={() => handleRegister(activity)}
                  >
                    <Text style={styles.registerButtonText}>View Info</Text>
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
  viewInfoButton: {
    marginTop: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#4bb0eb',
    borderRadius: 200,
    alignItems: 'center',
  },
  registeredButton: {
    backgroundColor: '#4CAF50', 
  },
  registerButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
