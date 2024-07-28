import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, FlatList, Modal } from 'react-native';
import Background from '../components/Background';
import { getDatabase, ref, onValue, update, set } from 'firebase/database';
import { getAuth } from 'firebase/auth';

export default function Friends({ navigation }) {
  const [friends, setFriends] = useState([]);
  const [username, setUsername] = useState('');
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [friendRequests, setFriendRequests] = useState([]);
  const [allUsers, setAllUsers] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [friendActivities, setFriendActivities] = useState([]);
  const [activityModalVisible, setActivityModalVisible] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      setUserId(user.uid);
      const db = getDatabase();
      const userRef = ref(db, `users/${user.uid}`);
      const allUsersRef = ref(db, 'users');

      // Fetch user name and friends
      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setUserName(data.name || 'User');
          setFriends(data.friends || []);
          setFriendRequests(Object.keys(data.friendRequests || {}).map(key => ({
            id: key,
            name: data.friendRequests[key].name
          })));
        } else {
          // Initialize friends if not present
          set(userRef, { name: 'User', friends: [], friendRequests: {} });
          setUserName('User');
          setFriends([]);
          setFriendRequests([]);
        }
      });

      // Fetch all users
      onValue(allUsersRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setAllUsers(data);
        }
      });
    }
  }, []);

  const addFriend = () => {
    if (username.trim() === '') {
      setModalMessage("Username cannot be empty.");
      setModalVisible(true);
      return;
    }

    const db = getDatabase();
    const friendId = Object.keys(allUsers).find(id => allUsers[id].name === username.trim());

    if (!friendId) {
      setModalMessage("Username not found.");
      setModalVisible(true);
      return;
    }

    const friendRequestRef = ref(db, `users/${friendId}/friendRequests/${userId}`);

    onValue(friendRequestRef, (snapshot) => {
      if (snapshot.exists()) {
        setModalMessage("Friend request already sent.");
        setModalVisible(true);
      } else {
        update(friendRequestRef, { name: userName })
          .then(() => {
            setUsername('');
            setModalMessage("Friend request sent!");
            setModalVisible(true);
          })
          .catch(err => {
            setModalMessage("Failed to send friend request. Please try again.");
            setModalVisible(true);
          });
      }
    }, { onlyOnce: true });
  };

  const acceptFriendRequest = (requesterId) => {
    const db = getDatabase();

    const userFriendsRef = ref(db, `users/${userId}/friends`);
    const friendFriendsRef = ref(db, `users/${requesterId}/friends`);
    const requestRef = ref(db, `users/${userId}/friendRequests/${requesterId}`);

    onValue(userFriendsRef, (snapshot) => {
      const userFriends = snapshot.val() || [];
      const newUserFriends = [...userFriends, allUsers[requesterId].name];

      set(userFriendsRef, newUserFriends)
        .then(() => {
          onValue(friendFriendsRef, (friendSnapshot) => {
            const friendFriends = friendSnapshot.val() || [];
            const newFriendFriends = [...friendFriends, userName];

            set(friendFriendsRef, newFriendFriends)
              .then(() => {
                set(requestRef, null)
                  .then(() => {
                    setFriendRequests(friendRequests.filter(request => request.id !== requesterId));
                    setFriends(newUserFriends);
                  })
                  .catch(err => {
                    setModalMessage("Failed to remove friend request. Please try again.");
                    setModalVisible(true);
                  });
              })
              .catch(err => {
                setModalMessage("Failed to add you to friend's friend list. Please try again.");
                setModalVisible(true);
              });
          }, { onlyOnce: true });
        })
        .catch(err => {
          setModalMessage("Failed to add friend. Please try again.");
          setModalVisible(true);
        });
    }, { onlyOnce: true });
  };

  const rejectFriendRequest = (requesterId) => {
    const db = getDatabase();
    const requestRef = ref(db, `users/${userId}/friendRequests/${requesterId}`);

    set(requestRef, null)
      .then(() => {
        setFriendRequests(friendRequests.filter(request => request.id !== requesterId));
        setModalMessage("Friend request rejected.");
        setModalVisible(true);
      })
      .catch(err => {
        setModalMessage("Failed to reject friend request. Please try again.");
        setModalVisible(true);
      });
  };

  const viewFriendActivities = (friendId) => {
    const db = getDatabase();
    const activitiesRef = ref(db, `users/${friendId}/registeredActivities`);

    onValue(activitiesRef, (snapshot) => {
      const data = snapshot.val() || {};
      const activities = Object.keys(data).map(key => ({
        ...data[key],
        key: key
      }));
      setFriendActivities(activities);
      setActivityModalVisible(true);
    }, { onlyOnce: true });
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
        <Text style={styles.activity}>Friends</Text>

        <View style={styles.container}>
          <TextInput
            style={styles.input}
            placeholder="Enter friend's username"
            value={username}
            onChangeText={setUsername}
          />
          <TouchableOpacity style={styles.addButton} onPress={addFriend}>
            <Text style={styles.buttonText}>Add Friend</Text>
          </TouchableOpacity>

          <Text style={styles.subheader}>Friends List:</Text>
          <FlatList
            data={friends}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => {
              const friendId = Object.keys(allUsers).find(id => allUsers[id].name === item);
              return (
                <View style={styles.friendItem}>
                  <Text style={styles.friendText}>{item}</Text>
                  <View style={styles.buttonGap}></View>
                  <TouchableOpacity
                    style={styles.viewButton}
                    onPress={() => viewFriendActivities(friendId)}
                  >
                    <Text style={styles.buttonText}>View</Text>
                  </TouchableOpacity>
                </View>
              );
            }}
          />

          <Text style={styles.subheader}>Friend Requests:</Text>
          <FlatList
            data={friendRequests}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.friendItem}>
                <Text style={styles.friendText}>{item.name}</Text>
                <View style={styles.buttonGap}></View>
                <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={() => acceptFriendRequest(item.id)}
                >
                  <Text style={styles.buttonText}>Accept</Text>
                </TouchableOpacity>
                <View style={styles.buttonGap}></View>
                <TouchableOpacity
                  style={styles.rejectButton}
                  onPress={() => rejectFriendRequest(item.id)}
                >
                  <Text style={styles.buttonText}>Reject</Text>
                </TouchableOpacity>
              </View>
            )}
          />
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
            <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={activityModalVisible}
        onRequestClose={() => setActivityModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Registered Activities</Text>
            <FlatList
              data={friendActivities}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.friendItem}>
                  <Text style={styles.friendText}>{item.title}</Text>
                  <View style={styles.buttonGap}></View>
                  <TouchableOpacity
                    style={styles.viewButton}
                    onPress={() => {
                      setActivityModalVisible(false);
                      navigation.navigate('ActivityConfirm', { activity: item, userId });
                    }}
                  >
                    <Text style={styles.buttonText}>View</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
            <View style={styles.buttonGap}></View>
            <TouchableOpacity style={styles.modalButton} onPress={() => setActivityModalVisible(false)}>
              <Text style={styles.buttonText}>Close</Text>
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
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  addButton: {
    width: '100%',
    paddingVertical: 10,
    backgroundColor: '#4bb0eb',
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  subheader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  friendItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  friendText: {
    fontSize: 16,
  },
  buttonGap: {
    width: 20,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 5,
  },
  rejectButton: {
    backgroundColor: '#eb4b4b',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 5,
  },
  viewButton: {
    backgroundColor: '#4bb0eb',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 5,
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
    marginTop: 20, 
});
