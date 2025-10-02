import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Activity, 
  Target, 
  Zap, 
  TrendingUp,
  Plus,
  Scale,
  X
} from 'lucide-react-native';

import { Colors, Typography, Spacing, BorderRadius, Layout } from '../constants/theme';
import { GlassCard } from '../components/ui/GlassCard';
import { LuxuryButton } from '../components/ui/LuxuryButton';
import { ProgressChart } from '../components/ui/ProgressChart';
import { databaseService } from '../services/database';
import { FoodEntry, BodyMeasurement, MacroNutrients } from '../types';

const { width: screenWidth } = Dimensions.get('window');

export const HomeScreen: React.FC = () => {
  const [todayEntries, setTodayEntries] = useState<FoodEntry[]>([]);
  const [dailyTotals, setDailyTotals] = useState<MacroNutrients>({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });
  const [recentWeights, setRecentWeights] = useState<BodyMeasurement[]>([]);
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [weightInput, setWeightInput] = useState('');
  const [currentWeight, setCurrentWeight] = useState<number | null>(null);

  const targetCalories = 2200;
  const targetProtein = 180;
  const targetCarbs = 275;
  const targetFat = 75;

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load today's food entries
      const today = new Date();
      const entries = await databaseService.getFoodEntriesByDate('user-1', today);
      setTodayEntries(entries);

      // Calculate daily totals
      const totals = entries.reduce(
        (acc, entry) => {
          const multiplier = entry.quantity;
          return {
            calories: acc.calories + (entry.food.calories * multiplier),
            protein: acc.protein + (entry.food.protein * multiplier),
            carbs: acc.carbs + (entry.food.carbs * multiplier),
            fat: acc.fat + (entry.food.fat * multiplier),
          };
        },
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      );
      setDailyTotals(totals);

      // Load recent weight measurements
      const weights = await databaseService.getBodyMeasurements('user-1', 'weight', 7);
      setRecentWeights(weights);
      if (weights.length > 0) {
        setCurrentWeight(weights[0].value);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const logWeight = async () => {
    const weight = parseFloat(weightInput);
    if (isNaN(weight) || weight <= 0) {
      Alert.alert('Invalid Weight', 'Please enter a valid weight.');
      return;
    }

    try {
      const measurement: Omit<BodyMeasurement, 'createdAt'> = {
        id: `weight_${Date.now()}`,
        userId: 'user-1',
        type: 'weight',
        value: weight,
        unit: 'lbs',
        measuredAt: new Date(),
      };

      await databaseService.createBodyMeasurement(measurement);
      setCurrentWeight(weight);
      setShowWeightModal(false);
      setWeightInput('');
      
      // Reload weight data
      const weights = await databaseService.getBodyMeasurements('user-1', 'weight', 7);
      setRecentWeights(weights);
      
      Alert.alert('Success', 'Weight logged successfully!');
    } catch (error) {
      console.error('Error logging weight:', error);
      Alert.alert('Error', 'Failed to log weight. Please try again.');
    }
  };

  // Generate weight chart data
  const weightChartData = recentWeights
    .reverse()
    .map((measurement, index) => ({
      x: index,
      y: measurement.value,
    }));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.username}>Champion</Text>
        </View>

        {/* Daily Rings */}
        <GlassCard style={styles.ringsCard}>
          <Text style={styles.cardTitle}>Today's Progress</Text>
          <View style={styles.ringsContainer}>
            {/* Calories Ring */}
            <View style={styles.ringItem}>
              <View style={styles.ringWrapper}>
                <LinearGradient
                  colors={Colors.goldGradient}
                  style={styles.ring}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.ringInner}>
                    <Target size={24} color={Colors.gold} />
                  </View>
                </LinearGradient>
              </View>
              <Text style={styles.ringLabel}>Calories</Text>
              <Text style={styles.ringValue}>
                {Math.round(dailyTotals.calories)} / {targetCalories}
              </Text>
            </View>

            {/* Activity Ring */}
            <View style={styles.ringItem}>
              <View style={styles.ringWrapper}>
                <LinearGradient
                  colors={[Colors.emerald, Colors.protein]}
                  style={styles.ring}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.ringInner}>
                    <Activity size={24} color={Colors.emerald} />
                  </View>
                </LinearGradient>
              </View>
              <Text style={styles.ringLabel}>Activity</Text>
              <Text style={styles.ringValue}>45 / 60 min</Text>
            </View>

            {/* Weight Ring */}
            <View style={styles.ringItem}>
              <View style={styles.ringWrapper}>
                <LinearGradient
                  colors={[Colors.primary, Colors.secondary]}
                  style={styles.ring}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.ringInner}>
                    <Scale size={24} color={Colors.primary} />
                  </View>
                </LinearGradient>
              </View>
              <Text style={styles.ringLabel}>Weight</Text>
              <Text style={styles.ringValue}>
                {currentWeight ? `${currentWeight} lbs` : 'Not logged'}
              </Text>
            </View>
          </View>
        </GlassCard>

        {/* Macro Bars */}
        <GlassCard style={styles.macroCard}>
          <Text style={styles.cardTitle}>Macronutrients</Text>
          
          {/* Protein */}
          <View style={styles.macroItem}>
            <View style={styles.macroHeader}>
              <Text style={styles.macroLabel}>Protein</Text>
              <Text style={styles.macroValue}>
                {Math.round(dailyTotals.protein)}g / {targetProtein}g
              </Text>
            </View>
            <View style={styles.macroBarContainer}>
              <LinearGradient
                colors={[Colors.protein, Colors.protein + '80']}
                style={[styles.macroBar, { 
                  width: `${Math.min((dailyTotals.protein / targetProtein) * 100, 100)}%` 
                }]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </View>
          </View>

          {/* Carbs */}
          <View style={styles.macroItem}>
            <View style={styles.macroHeader}>
              <Text style={styles.macroLabel}>Carbs</Text>
              <Text style={styles.macroValue}>
                {Math.round(dailyTotals.carbs)}g / {targetCarbs}g
              </Text>
            </View>
            <View style={styles.macroBarContainer}>
              <LinearGradient
                colors={[Colors.carbs, Colors.carbs + '80']}
                style={[styles.macroBar, { 
                  width: `${Math.min((dailyTotals.carbs / targetCarbs) * 100, 100)}%` 
                }]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </View>
          </View>

          {/* Fat */}
          <View style={styles.macroItem}>
            <View style={styles.macroHeader}>
              <Text style={styles.macroLabel}>Fat</Text>
              <Text style={styles.macroValue}>
                {Math.round(dailyTotals.fat)}g / {targetFat}g
              </Text>
            </View>
            <View style={styles.macroBarContainer}>
              <LinearGradient
                colors={[Colors.fat, Colors.fat + '80']}
                style={[styles.macroBar, { 
                  width: `${Math.min((dailyTotals.fat / targetFat) * 100, 100)}%` 
                }]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </View>
          </View>
        </GlassCard>

        {/* Weight Progress Chart */}
        {weightChartData.length > 1 && (
          <ProgressChart
            data={weightChartData}
            title="Weight Progress (Last 7 Days)"
            color={Colors.primary}
            height={180}
          />
        )}

        {/* Workout Tile */}
        <GlassCard style={styles.workoutCard} withGoldBorder>
          <View style={styles.workoutHeader}>
            <Text style={styles.cardTitle}>Today's Workout</Text>
            <TrendingUp size={24} color={Colors.gold} />
          </View>
          <Text style={styles.workoutTitle}>Push Day - Upper Body</Text>
          <Text style={styles.workoutDescription}>
            Chest, Shoulders, Triceps • 6 exercises • 45-60 min
          </Text>
          <LuxuryButton
            title="Start Workout"
            variant="gold"
            onPress={() => {}}
            style={styles.workoutButton}
            icon={<Plus size={20} color={Colors.background} />}
          />
        </GlassCard>

        {/* Quick Log */}
        <GlassCard style={styles.quickLogCard}>
          <Text style={styles.cardTitle}>Quick Log</Text>
          <View style={styles.quickLogButtons}>
            <LuxuryButton
              title="Weight"
              variant="outline"
              size="small"
              onPress={() => setShowWeightModal(true)}
              style={styles.quickLogButton}
              icon={<Scale size={16} color={Colors.gold} />}
            />
            <LuxuryButton
              title="Meal"
              variant="outline"
              size="small"
              onPress={() => {}}
              style={styles.quickLogButton}
            />
            <LuxuryButton
              title="Water"
              variant="outline"
              size="small"
              onPress={() => {}}
              style={styles.quickLogButton}
            />
          </View>
        </GlassCard>

        {/* AI Insight Card */}
        <GlassCard style={styles.aiCard}>
          <View style={styles.aiHeader}>
            <LinearGradient
              colors={Colors.goldGradient}
              style={styles.aiIcon}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.aiIconText}>AI</Text>
            </LinearGradient>
            <Text style={styles.cardTitle}>Daily Insight</Text>
          </View>
          <Text style={styles.aiInsight}>
            {dailyTotals.calories > 0 
              ? `You've consumed ${Math.round(dailyTotals.calories)} calories today. ${
                  dailyTotals.protein >= targetProtein * 0.8 
                    ? "Great protein intake! " 
                    : "Consider adding more protein. "
                }Keep up the great work!`
              : "Start logging your meals to get personalized insights and track your progress towards your fitness goals."
            }
          </Text>
        </GlassCard>

        {/* Bottom padding for tab bar */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Weight Logging Modal */}
      <Modal
        visible={showWeightModal}
        animationType="slide"
        presentationStyle="pageSheet"
        transparent
      >
        <View style={styles.modalOverlay}>
          <GlassCard style={styles.weightModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Log Weight</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowWeightModal(false)}
              >
                <X size={24} color={Colors.white} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.weightInputContainer}>
              <TextInput
                style={styles.weightInput}
                value={weightInput}
                onChangeText={setWeightInput}
                placeholder="Enter weight"
                placeholderTextColor={Colors.gray}
                keyboardType="numeric"
                autoFocus
              />
              <Text style={styles.weightUnit}>lbs</Text>
            </View>
            
            <LuxuryButton
              title="Log Weight"
              variant="gold"
              onPress={logWeight}
              style={styles.logButton}
              disabled={!weightInput.trim()}
            />
          </GlassCard>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Layout.screenPadding,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  greeting: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.normal,
    color: Colors.gray,
    marginBottom: Spacing.xs,
  },
  username: {
    fontSize: Typography.fontSize['4xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
  },
  
  // Cards
  ringsCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  macroCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  workoutCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  quickLogCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  aiCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  
  cardTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
    marginBottom: Spacing.md,
  },
  
  // Rings
  ringsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  ringItem: {
    alignItems: 'center',
  },
  ringWrapper: {
    marginBottom: Spacing.sm,
  },
  ring: {
    width: 80,
    height: 80,
    borderRadius: 40,
    padding: 3,
  },
  ringInner: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 37,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.gray,
    marginBottom: Spacing.xs,
  },
  ringValue: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
  },
  
  // Macros
  macroItem: {
    marginBottom: Spacing.md,
  },
  macroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  macroLabel: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.white,
  },
  macroValue: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.gray,
  },
  macroBarContainer: {
    height: 8,
    backgroundColor: Colors.darkGray,
    borderRadius: 4,
    overflow: 'hidden',
  },
  macroBar: {
    height: '100%',
    borderRadius: 4,
  },
  
  // Workout
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  workoutTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
    marginBottom: Spacing.sm,
  },
  workoutDescription: {
    fontSize: Typography.fontSize.base,
    color: Colors.gray,
    marginBottom: Spacing.lg,
  },
  workoutButton: {
    marginTop: Spacing.sm,
  },
  
  // Quick Log
  quickLogButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  quickLogButton: {
    flex: 1,
  },
  
  // AI Insight
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  aiIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  aiIconText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.background,
  },
  aiInsight: {
    fontSize: Typography.fontSize.base,
    color: Colors.gray,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
    fontStyle: 'italic',
  },
  
  bottomPadding: {
    height: 120, // Space for floating tab bar
  },
  
  // Weight Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  weightModal: {
    width: '100%',
    maxWidth: 320,
    padding: Spacing.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  modalTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.darkGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weightInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  weightInput: {
    flex: 1,
    height: 48,
    backgroundColor: Colors.darkGray,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    fontSize: Typography.fontSize.xl,
    color: Colors.white,
    textAlign: 'center',
    marginRight: Spacing.sm,
  },
  weightUnit: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.gray,
  },
  logButton: {
    marginTop: Spacing.sm,
  },
});
