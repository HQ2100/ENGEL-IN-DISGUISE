import React from 'react';
import { Provider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { theme } from './src/core/theme';
import {
  StartScreen,
  LoginScreen,
  RegisterScreen,
  ResetPasswordScreen,
  Dashboard,
} from './src/screens';
import Activities from './src/screens/Activities';
import ActivityConfirm from './src/screens/ActivityConfirm';
import Health from './src/screens/Health';
import HealthConfirm from './src/screens/HealthConfirm';
import RewardsPage from './src/screens/RewardsPage';
import RewardsConfirm from './src/screens/RewardsConfirm';
import Friends from './src/screens/Friends';

const Stack = createStackNavigator();

export default function App() {
  return (
    <Provider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="StartScreen"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="StartScreen" component={StartScreen} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />
          <Stack.Screen name="Activities" component={Activities} />
          <Stack.Screen name="ActivityConfirm" component={ActivityConfirm} />
          <Stack.Screen name="Health" component={Health} />
          <Stack.Screen name="HealthConfirm" component={HealthConfirm} />
          <Stack.Screen name="RewardsPage" component={RewardsPage} />
          <Stack.Screen name="RewardsConfirm" component={RewardsConfirm} />
          <Stack.Screen name="Friends" component={Friends} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
