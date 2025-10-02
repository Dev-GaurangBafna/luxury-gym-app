import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrendingUp, Award, Camera, Scale } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Colors, Typography, Spacing, Layout } from '../constants/theme';
import { GlassCard } from '../components/ui/GlassCard';
import { LuxuryButton } from '../components/ui/LuxuryButton';

export const ProgressScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Progress</Text>
          <Text style={styles.subtitle}>Track your transformation</Text>
        </View>

        {/* Stats Overview */}
        <GlassCard style={styles.card} withGoldBorder>
          <View style={styles.cardHeader}>
            <TrendingUp size={28} color={Colors.gold} />
            <Text style={styles.cardTitle}>This Week</Text>
          </View>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>4</Text>
              <Text style={styles.statLabel}>Workouts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>12.5k</Text>
              <Text style={styles.statLabel}>Total Volume</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>-1.2</Text>
              <Text style={styles.statLabel}>Weight (lbs)</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>8.2</Text>
              <Text style={styles.statLabel}>Avg Sleep</Text>
            </View>
          </View>
        </GlassCard>

        {/* Personal Records */}
        <GlassCard style={styles.card}>
          <View style={styles.cardHeader}>
            <Award size={24} color={Colors.gold} />
            <Text style={styles.cardTitle}>Recent PRs</Text>
          </View>
          
          <View style={styles.prList}>
            <View style={styles.prItem}>
              <LinearGradient
                colors={Colors.goldGradient}
                style={styles.prBadge}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Award size={16} color={Colors.background} />
              </LinearGradient>
              <View style={styles.prInfo}>
                <Text style={styles.prExercise}>Bench Press</Text>
                <Text style={styles.prDetails}>225 lbs × 5 reps</Text>
              </View>
              <Text style={styles.prDate}>2 days ago</Text>
            </View>

            <View style={styles.prItem}>
              <LinearGradient
                colors={Colors.goldGradient}
                style={styles.prBadge}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Award size={16} color={Colors.background} />
              </LinearGradient>
              <View style={styles.prInfo}>
                <Text style={styles.prExercise}>Deadlift</Text>
                <Text style={styles.prDetails}>315 lbs × 3 reps</Text>
              </View>
              <Text style={styles.prDate}>1 week ago</Text>
            </View>

            <View style={styles.prItem}>
              <LinearGradient
                colors={Colors.goldGradient}
                style={styles.prBadge}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Award size={16} color={Colors.background} />
              </LinearGradient>
              <View style={styles.prInfo}>
                <Text style={styles.prExercise}>Squat</Text>
                <Text style={styles.prDetails}>275 lbs × 4 reps</Text>
              </View>
              <Text style={styles.prDate}>2 weeks ago</Text>
            </View>
          </View>
        </GlassCard>

        {/* Body Tracking */}
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>Body Tracking</Text>
          
          <View style={styles.trackingActions}>
            <LuxuryButton
              title="Log Weight"
              variant="outline"
              size="small"
              onPress={() => {}}
              style={styles.trackingButton}
              icon={<Scale size={18} color={Colors.gold} />}
            />
            <LuxuryButton
              title="Progress Photo"
              variant="outline"
              size="small"
              onPress={() => {}}
              style={styles.trackingButton}
              icon={<Camera size={18} color={Colors.gold} />}
            />
          </View>

          <View style={styles.bodyStats}>
            <View style={styles.bodyStatItem}>
              <Text style={styles.bodyStatLabel}>Current Weight</Text>
              <Text style={styles.bodyStatValue}>178.3 lbs</Text>
              <Text style={styles.bodyStatChange}>-1.2 lbs this week</Text>
            </View>
            <View style={styles.bodyStatItem}>
              <Text style={styles.bodyStatLabel}>Body Fat</Text>
              <Text style={styles.bodyStatValue}>12.8%</Text>
              <Text style={styles.bodyStatChange}>-0.3% this month</Text>
            </View>
          </View>
        </GlassCard>

        {/* Strength Progress */}
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>Strength Progress</Text>
          
          <View style={styles.strengthList}>
            <View style={styles.strengthItem}>
              <Text style={styles.strengthExercise}>Bench Press</Text>
              <View style={styles.strengthProgress}>
                <Text style={styles.strengthCurrent}>225 lbs</Text>
                <Text style={styles.strengthChange}>+15 lbs</Text>
              </View>
            </View>
            <View style={styles.strengthItem}>
              <Text style={styles.strengthExercise}>Squat</Text>
              <View style={styles.strengthProgress}>
                <Text style={styles.strengthCurrent}>275 lbs</Text>
                <Text style={styles.strengthChange}>+25 lbs</Text>
              </View>
            </View>
            <View style={styles.strengthItem}>
              <Text style={styles.strengthExercise}>Deadlift</Text>
              <View style={styles.strengthProgress}>
                <Text style={styles.strengthCurrent}>315 lbs</Text>
                <Text style={styles.strengthChange}>+20 lbs</Text>
              </View>
            </View>
          </View>
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
  
  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.darkGray,
    borderRadius: 12,
  },
  statValue: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.gray,
  },
  
  // PR List
  prList: {
    gap: Spacing.md,
  },
  prItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.darkGray,
  },
  prBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  prInfo: {
    flex: 1,
  },
  prExercise: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.white,
    marginBottom: Spacing.xs,
  },
  prDetails: {
    fontSize: Typography.fontSize.sm,
    color: Colors.gray,
  },
  prDate: {
    fontSize: Typography.fontSize.sm,
    color: Colors.gold,
  },
  
  // Body Tracking
  trackingActions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  trackingButton: {
    flex: 1,
  },
  bodyStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  bodyStatItem: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.darkGray,
    borderRadius: 12,
  },
  bodyStatLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.gray,
    marginBottom: Spacing.xs,
  },
  bodyStatValue: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
    marginBottom: Spacing.xs,
  },
  bodyStatChange: {
    fontSize: Typography.fontSize.xs,
    color: Colors.emerald,
    fontWeight: Typography.fontWeight.semibold,
  },
  
  // Strength Progress
  strengthList: {
    gap: Spacing.md,
  },
  strengthItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.darkGray,
  },
  strengthExercise: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.white,
  },
  strengthProgress: {
    alignItems: 'flex-end',
  },
  strengthCurrent: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
    marginBottom: Spacing.xs,
  },
  strengthChange: {
    fontSize: Typography.fontSize.sm,
    color: Colors.emerald,
    fontWeight: Typography.fontWeight.semibold,
  },
  
  bottomPadding: {
    height: 120,
  },
});
