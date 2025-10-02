import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { AppNavigator } from './src/navigation/AppNavigator';
import { databaseService } from './src/services/database';
import { Colors, Typography } from './src/constants/theme';

export default function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      await databaseService.initialize();
      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to initialize app:', error);
      setInitError('Failed to initialize the app. Please restart.');
    }
  };

  if (initError) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{initError}</Text>
      </View>
    );
  }

  if (!isInitialized) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.gold} />
        <Text style={styles.loadingText}>Initializing Luxury Gym...</Text>
      </View>
    );
  }

  return <AppNavigator />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: Typography.fontSize.lg,
    color: Colors.white,
    marginTop: 16,
  },
  errorText: {
    fontSize: Typography.fontSize.base,
    color: Colors.crimson,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
