import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Dumbbell, 
  Clock, 
  Target, 
  Plus, 
  Play, 
  Pause, 
  RotateCcw,
  X,
  Search,
  Timer,
  CheckCircle,
  TrendingUp,
  Calendar
} from 'lucide-react-native';

import { Colors, Typography, Spacing, Layout, BorderRadius } from '../constants/theme';
import { GlassCard } from '../components/ui/GlassCard';
import { LuxuryButton } from '../components/ui/LuxuryButton';
import { databaseService } from '../services/database';
import { Exercise, Workout, WorkoutExercise, WorkoutSet, WorkoutTemplate } from '../types';

interface RestTimerProps {
  isActive: boolean;
  timeLeft: number;
  onComplete: () => void;
  onStop: () => void;
}

const RestTimer: React.FC<RestTimerProps> = ({ isActive, timeLeft, onComplete, onStop }) => {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  return (
    <GlassCard style={styles.timerCard} withGoldBorder={isActive}>
      <View style={styles.timerHeader}>
        <Timer size={24} color={Colors.gold} />
        <Text style={styles.timerTitle}>Rest Timer</Text>
        {isActive && (
          <TouchableOpacity onPress={onStop} style={styles.timerStop}>
            <X size={20} color={Colors.crimson} />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.timerDisplay}>
        <Text style={styles.timerTime}>
          {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
        </Text>
        {isActive && timeLeft <= 10 && (
          <Text style={styles.timerWarning}>Almost ready!</Text>
        )}
      </View>
      
      {!isActive && (
        <View style={styles.timerButtons}>
          <LuxuryButton
            title="60s"
            variant="outline"
            size="small"
            onPress={() => {}}
            style={styles.timerButton}
          />
          <LuxuryButton
            title="90s"
            variant="outline"
            size="small"
            onPress={() => {}}
            style={styles.timerButton}
          />
          <LuxuryButton
            title="120s"
            variant="outline"
            size="small"
            onPress={() => {}}
            style={styles.timerButton}
          />
        </View>
      )}
    </GlassCard>
  );
};

export const WorkoutsScreen: React.FC = () => {
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [showExerciseSearch, setShowExerciseSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Exercise[]>([]);
  const [recentWorkouts, setRecentWorkouts] = useState<Workout[]>([]);
  const [restTimer, setRestTimer] = useState({ isActive: false, timeLeft: 0 });
  const [workoutStartTime, setWorkoutStartTime] = useState<Date | null>(null);

  useEffect(() => {
    loadExercises();
    loadRecentWorkouts();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (restTimer.isActive && restTimer.timeLeft > 0) {
      interval = setInterval(() => {
        setRestTimer(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1
        }));
      }, 1000);
    } else if (restTimer.timeLeft === 0 && restTimer.isActive) {
      setRestTimer({ isActive: false, timeLeft: 0 });
      // Could add haptic feedback or notification here
    }
    return () => clearInterval(interval);
  }, [restTimer]);

  const loadExercises = async () => {
    try {
      const allExercises = await databaseService.getAllExercises();
      setExercises(allExercises);
    } catch (error) {
      console.error('Error loading exercises:', error);
    }
  };

  const loadRecentWorkouts = async () => {
    // This would load from database in a real app
    setRecentWorkouts([]);
  };

  const startWorkout = () => {
    const newWorkout: Workout = {
      id: `workout_${Date.now()}`,
      userId: 'user-1',
      name: 'Quick Workout',
      exercises: [],
      startTime: new Date(),
      isCompleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setCurrentWorkout(newWorkout);
    setWorkoutStartTime(new Date());
  };

  const addExerciseToWorkout = (exercise: Exercise) => {
    if (!currentWorkout) return;

    const workoutExercise: WorkoutExercise = {
      id: `we_${Date.now()}`,
      workoutId: currentWorkout.id,
      exerciseId: exercise.id,
      exercise,
      sets: [],
      order: currentWorkout.exercises.length,
      createdAt: new Date(),
    };

    setCurrentWorkout(prev => prev ? {
      ...prev,
      exercises: [...prev.exercises, workoutExercise]
    } : null);
    
    setShowExerciseSearch(false);
  };

  const addSetToExercise = (exerciseId: string) => {
    if (!currentWorkout) return;

    const newSet: WorkoutSet = {
      id: `set_${Date.now()}`,
      exerciseId,
      reps: 0,
      weight: 0,
      createdAt: new Date(),
    };

    setCurrentWorkout(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        exercises: prev.exercises.map(ex => 
          ex.exerciseId === exerciseId 
            ? { ...ex, sets: [...ex.sets, newSet] }
            : ex
        )
      };
    });
  };

  const updateSet = (exerciseId: string, setId: string, field: 'reps' | 'weight', value: number) => {
    if (!currentWorkout) return;

    setCurrentWorkout(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        exercises: prev.exercises.map(ex => 
          ex.exerciseId === exerciseId 
            ? {
                ...ex,
                sets: ex.sets.map(set => 
                  set.id === setId ? { ...set, [field]: value } : set
                )
              }
            : ex
        )
      };
    });
  };

  const startRestTimer = (seconds: number) => {
    setRestTimer({ isActive: true, timeLeft: seconds });
  };

  const stopRestTimer = () => {
    setRestTimer({ isActive: false, timeLeft: 0 });
  };

  const finishWorkout = async () => {
    if (!currentWorkout || !workoutStartTime) return;

    try {
      const endTime = new Date();
      const duration = Math.floor((endTime.getTime() - workoutStartTime.getTime()) / 1000);
      
      const completedWorkout: Workout = {
        ...currentWorkout,
        endTime,
        duration,
        isCompleted: true,
        updatedAt: new Date(),
      };

      // Save to database here
      Alert.alert(
        'Workout Complete!',
        `Great job! You worked out for ${Math.floor(duration / 60)} minutes.`,
        [{ text: 'OK', onPress: () => setCurrentWorkout(null) }]
      );
    } catch (error) {
      console.error('Error finishing workout:', error);
    }
  };

  const handleExerciseSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    const filtered = exercises.filter(exercise =>
      exercise.name.toLowerCase().includes(query.toLowerCase()) ||
      exercise.category.toLowerCase().includes(query.toLowerCase()) ||
      exercise.primaryMuscles.some(muscle => 
        muscle.toLowerCase().includes(query.toLowerCase())
      )
    );
    
    setSearchResults(filtered);
  };

  if (currentWorkout) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.workoutHeader}>
          <View style={styles.workoutInfo}>
            <Text style={styles.workoutTitle}>{currentWorkout.name}</Text>
            <Text style={styles.workoutTime}>
              {workoutStartTime && `${Math.floor((Date.now() - workoutStartTime.getTime()) / 60000)} min`}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.finishButton}
            onPress={finishWorkout}
          >
            <CheckCircle size={24} color={Colors.emerald} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.workoutContent}>
          {restTimer.isActive && (
            <RestTimer
              isActive={restTimer.isActive}
              timeLeft={restTimer.timeLeft}
              onComplete={() => {}}
              onStop={stopRestTimer}
            />
          )}

          {currentWorkout.exercises.map((workoutExercise) => (
            <GlassCard key={workoutExercise.id} style={styles.exerciseCard}>
              <View style={styles.exerciseHeader}>
                <Text style={styles.exerciseName}>{workoutExercise.exercise.name}</Text>
                <Text style={styles.exerciseCategory}>
                  {workoutExercise.exercise.category.toUpperCase()}
                </Text>
              </View>

              <View style={styles.setsContainer}>
                <View style={styles.setsHeader}>
                  <Text style={styles.setHeaderText}>Set</Text>
                  <Text style={styles.setHeaderText}>Weight</Text>
                  <Text style={styles.setHeaderText}>Reps</Text>
                  <Text style={styles.setHeaderText}>✓</Text>
                </View>

                {workoutExercise.sets.map((set, index) => (
                  <View key={set.id} style={styles.setRow}>
                    <Text style={styles.setNumber}>{index + 1}</Text>
                    <TextInput
                      style={styles.setInput}
                      value={set.weight?.toString() || ''}
                      onChangeText={(text) => updateSet(workoutExercise.exerciseId, set.id, 'weight', parseFloat(text) || 0)}
                      keyboardType="numeric"
                      placeholder="0"
                      placeholderTextColor={Colors.gray}
                    />
                    <TextInput
                      style={styles.setInput}
                      value={set.reps?.toString() || ''}
                      onChangeText={(text) => updateSet(workoutExercise.exerciseId, set.id, 'reps', parseInt(text) || 0)}
                      keyboardType="numeric"
                      placeholder="0"
                      placeholderTextColor={Colors.gray}
                    />
                    <TouchableOpacity
                      style={styles.setCheck}
                      onPress={() => startRestTimer(90)}
                    >
                      <CheckCircle size={20} color={Colors.emerald} />
                    </TouchableOpacity>
                  </View>
                ))}

                <LuxuryButton
                  title="Add Set"
                  variant="outline"
                  size="small"
                  onPress={() => addSetToExercise(workoutExercise.exerciseId)}
                  style={styles.addSetButton}
                  icon={<Plus size={16} color={Colors.gold} />}
                />
              </View>
            </GlassCard>
          ))}

          <LuxuryButton
            title="Add Exercise"
            variant="gold"
            onPress={() => setShowExerciseSearch(true)}
            style={styles.addExerciseButton}
            icon={<Plus size={20} color={Colors.background} />}
          />

          <View style={styles.bottomPadding} />
        </ScrollView>

        {/* Exercise Search Modal */}
        <Modal
          visible={showExerciseSearch}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Exercise</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowExerciseSearch(false)}
              >
                <X size={24} color={Colors.white} />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search exercises..."
                placeholderTextColor={Colors.gray}
                value={searchQuery}
                onChangeText={handleExerciseSearch}
                autoFocus
              />
            </View>

            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.exerciseSearchItem}
                  onPress={() => addExerciseToWorkout(item)}
                >
                  <View style={styles.exerciseSearchInfo}>
                    <Text style={styles.exerciseSearchName}>{item.name}</Text>
                    <Text style={styles.exerciseSearchCategory}>
                      {item.category.toUpperCase()} • {item.primaryMuscles.join(', ')}
                    </Text>
                  </View>
                  <Plus size={20} color={Colors.gold} />
                </TouchableOpacity>
              )}
              style={styles.searchResults}
              showsVerticalScrollIndicator={false}
            />
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Workouts</Text>
          <Text style={styles.subtitle}>Track your strength journey</Text>
        </View>

        {/* Quick Start */}
        <GlassCard style={styles.card} withGoldBorder>
          <View style={styles.cardHeader}>
            <Dumbbell size={28} color={Colors.gold} />
            <Text style={styles.cardTitle}>Quick Start</Text>
          </View>
          <Text style={styles.cardDescription}>
            Jump into your workout with smart suggestions
          </Text>
          <LuxuryButton
            title="Start Empty Workout"
            variant="gold"
            onPress={startWorkout}
            style={styles.button}
            icon={<Play size={20} color={Colors.background} />}
          />
        </GlassCard>

        {/* Templates */}
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>Workout Templates</Text>
          <View style={styles.templateList}>
            <TouchableOpacity style={styles.templateItem}>
              <View style={styles.templateInfo}>
                <Text style={styles.templateName}>Push Day</Text>
                <Text style={styles.templateDetails}>Chest, Shoulders, Triceps • 6 exercises</Text>
              </View>
              <Play size={20} color={Colors.gold} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.templateItem}>
              <View style={styles.templateInfo}>
                <Text style={styles.templateName}>Pull Day</Text>
                <Text style={styles.templateDetails}>Back, Biceps • 5 exercises</Text>
              </View>
              <Play size={20} color={Colors.gold} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.templateItem}>
              <View style={styles.templateInfo}>
                <Text style={styles.templateName}>Leg Day</Text>
                <Text style={styles.templateDetails}>Quads, Hamstrings, Glutes • 7 exercises</Text>
              </View>
              <Play size={20} color={Colors.gold} />
            </TouchableOpacity>
          </View>
        </GlassCard>

        {/* Recent Workouts */}
        <GlassCard style={styles.card}>
          <View style={styles.cardHeader}>
            <Calendar size={24} color={Colors.gold} />
            <Text style={styles.cardTitle}>Recent Workouts</Text>
          </View>
          
          {recentWorkouts.length > 0 ? (
            <View style={styles.recentList}>
              {recentWorkouts.map((workout) => (
                <View key={workout.id} style={styles.recentItem}>
                  <View style={styles.recentInfo}>
                    <Text style={styles.recentName}>{workout.name}</Text>
                    <Text style={styles.recentDate}>
                      {workout.duration && `${Math.floor(workout.duration / 60)} min`}
                    </Text>
                  </View>
                  <View style={styles.recentStats}>
                    <Text style={styles.recentVolume}>{workout.totalVolume || 0} lbs</Text>
                    <Target size={16} color={Colors.emerald} />
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <TrendingUp size={48} color={Colors.gray} />
              <Text style={styles.emptyStateText}>No workouts yet</Text>
              <Text style={styles.emptyStateSubtext}>Start your first workout to see your progress here</Text>
            </View>
          )}
        </GlassCard>

        {/* Bottom padding for tab bar */}
        <View style={styles.bottomPadding} />
      </ScrollView>
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
  title: {
    fontSize: Typography.fontSize['4xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.fontSize.lg,
    color: Colors.gray,
  },
  
  card: {
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  cardTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
    marginBottom: Spacing.md,
  },
  cardDescription: {
    fontSize: Typography.fontSize.base,
    color: Colors.gray,
    marginBottom: Spacing.lg,
  },
  button: {
    marginTop: Spacing.sm,
  },
  
  // Templates
  templateList: {
    gap: Spacing.md,
  },
  templateItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.darkGray,
  },
  templateInfo: {
    flex: 1,
  },
  templateName: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.white,
    marginBottom: Spacing.xs,
  },
  templateDetails: {
    fontSize: Typography.fontSize.sm,
    color: Colors.gray,
  },
  
  // Recent
  recentList: {
    gap: Spacing.md,
  },
  recentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.darkGray,
  },
  recentInfo: {
    flex: 1,
  },
  recentName: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.white,
    marginBottom: Spacing.xs,
  },
  recentDate: {
    fontSize: Typography.fontSize.sm,
    color: Colors.gray,
  },
  recentStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  recentVolume: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.emerald,
  },
  
  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyStateText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.gray,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  emptyStateSubtext: {
    fontSize: Typography.fontSize.sm,
    color: Colors.gray,
    textAlign: 'center',
  },
  
  // Workout in progress styles
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.darkGray,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
    marginBottom: Spacing.xs,
  },
  workoutTime: {
    fontSize: Typography.fontSize.base,
    color: Colors.gold,
    fontWeight: Typography.fontWeight.medium,
  },
  finishButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.darkGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  workoutContent: {
    flex: 1,
    padding: Spacing.lg,
  },
  
  // Timer styles
  timerCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  timerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  timerTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
    flex: 1,
    marginLeft: Spacing.sm,
  },
  timerStop: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.darkGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerDisplay: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  timerTime: {
    fontSize: Typography.fontSize['5xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.gold,
    marginBottom: Spacing.xs,
  },
  timerWarning: {
    fontSize: Typography.fontSize.sm,
    color: Colors.crimson,
    fontWeight: Typography.fontWeight.semibold,
  },
  timerButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  timerButton: {
    flex: 1,
  },
  
  // Exercise styles
  exerciseCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  exerciseName: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
    flex: 1,
  },
  exerciseCategory: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.gold,
    backgroundColor: Colors.darkGray,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  
  // Sets styles
  setsContainer: {
    gap: Spacing.sm,
  },
  setsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.darkGray,
    borderRadius: BorderRadius.sm,
  },
  setHeaderText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.gray,
    flex: 1,
    textAlign: 'center',
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  setNumber: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
    width: 30,
    textAlign: 'center',
  },
  setInput: {
    flex: 1,
    height: 40,
    backgroundColor: Colors.darkGray,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    fontSize: Typography.fontSize.base,
    color: Colors.white,
    textAlign: 'center',
  },
  setCheck: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.darkGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addSetButton: {
    marginTop: Spacing.sm,
    alignSelf: 'flex-start',
  },
  addExerciseButton: {
    marginTop: Spacing.lg,
  },
  
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.darkGray,
  },
  modalTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.darkGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Search styles
  searchContainer: {
    padding: Spacing.lg,
  },
  searchInput: {
    height: 48,
    backgroundColor: Colors.darkGray,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    fontSize: Typography.fontSize.base,
    color: Colors.white,
  },
  searchResults: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  exerciseSearchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.darkGray,
    borderRadius: BorderRadius.md,
  },
  exerciseSearchInfo: {
    flex: 1,
  },
  exerciseSearchName: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.white,
    marginBottom: Spacing.xs,
  },
  exerciseSearchCategory: {
    fontSize: Typography.fontSize.sm,
    color: Colors.gray,
  },
  
  bottomPadding: {
    height: 120,
  },
});
