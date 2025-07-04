import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import GetLoanScreen from '../screens/GetLoanScreen';
import FAQScreen from '../screens/FAQScreen';

const Tab = createBottomTabNavigator();

interface BottomTabNavigatorProps {
  phoneNumber: string;
}

const BottomTabNavigator: React.FC<BottomTabNavigatorProps> = ({ phoneNumber }) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'GetLoan') {
            iconName = focused ? 'card' : 'card-outline';
          } else if (route.name === 'FAQ') {
            iconName = focused ? 'help-circle' : 'help-circle-outline';
          } else {
            iconName = 'home-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#667eea',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#e1e1e1',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ tabBarLabel: '首页' }}
        initialParams={{ phoneNumber }}
      />
      <Tab.Screen 
        name="GetLoan" 
        component={GetLoanScreen}
        options={{ tabBarLabel: '申请贷款' }}
      />
      <Tab.Screen 
        name="FAQ" 
        component={FAQScreen}
        options={{ tabBarLabel: '帮助' }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator; 