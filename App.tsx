import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import ChatScreen from './src/screens/ChatScreen';

const Stack = createStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleLogin = (phone: string) => {
    setPhoneNumber(phone);
    setIsLoggedIn(true);
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar 
          style="light" 
          backgroundColor="transparent"
          translucent={Platform.OS === 'android'}
        />
        {isLoggedIn ? (
          <Stack.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor: '#667eea',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          >
            <Stack.Screen name="Tabs" options={{ headerShown: false }}>
              {() => <BottomTabNavigator phoneNumber={phoneNumber} />}
            </Stack.Screen>
            <Stack.Screen 
              name="Chat" 
              component={ChatScreen} 
              options={{ 
                title: 'AI客服',
                headerShown: true,
              }} 
            />
          </Stack.Navigator>
        ) : (
          <LoginScreen onLogin={handleLogin} />
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
