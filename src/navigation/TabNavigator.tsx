import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Home, 
  Dumbbell, 
  UtensilsCrossed, 
  TrendingUp, 
  Bot 
} from 'lucide-react-native';

import { Colors, Layout, BorderRadius } from '../constants/theme';
import { HomeScreen } from '../screens/HomeScreen';
import { WorkoutsScreen } from '../screens/WorkoutsScreen';
import { NutritionScreen } from '../screens/NutritionScreen';
import { ProgressScreen } from '../screens/ProgressScreen';
import { AIAssistantScreen } from '../screens/AIAssistantScreen';

export type TabParamList = {
  Home: undefined;
  Workouts: undefined;
  Nutrition: undefined;
  Progress: undefined;
  AI: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const TabIcon = ({ 
  IconComponent, 
  focused, 
  size = 24 
}: { 
  IconComponent: any; 
  focused: boolean; 
  size?: number; 
}) => {
  if (focused) {
    return (
      <LinearGradient
        colors={Colors.goldGradient}
        style={styles.activeIconContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <IconComponent 
          size={size} 
          color={Colors.background} 
          strokeWidth={2.5}
        />
      </LinearGradient>
    );
  }

  return (
    <View style={styles.inactiveIconContainer}>
      <IconComponent 
        size={size} 
        color={Colors.gray} 
        strokeWidth={2}
      />
    </View>
  );
};

export const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarBackground: () => (
          <View style={styles.tabBarBackground}>
            <LinearGradient
              colors={[Colors.background, Colors.secondary]}
              style={StyleSheet.absoluteFillObject}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          </View>
        ),
        tabBarShowLabel: false,
        tabBarActiveTintColor: Colors.gold,
        tabBarInactiveTintColor: Colors.gray,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon IconComponent={Home} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Workouts"
        component={WorkoutsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon IconComponent={Dumbbell} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Nutrition"
        component={NutritionScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon IconComponent={UtensilsCrossed} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon IconComponent={TrendingUp} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="AI"
        component={AIAssistantScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon IconComponent={Bot} focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    height: Layout.tabBarHeight,
    borderRadius: BorderRadius.xl,
    borderTopWidth: 0,
    elevation: 10,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    paddingBottom: 10,
    paddingTop: 10,
  },
  tabBarBackground: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  activeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 8,
  },
  inactiveIconContainer: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
