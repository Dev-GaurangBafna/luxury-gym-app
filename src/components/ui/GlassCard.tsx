import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, BorderRadius, Shadows } from '../../constants/theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  borderRadius?: keyof typeof BorderRadius;
  withShadow?: boolean;
  withGoldBorder?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  borderRadius = 'xl',
  withShadow = true,
  withGoldBorder = false,
}) => {
  const cardStyle = [
    styles.container,
    {
      borderRadius: BorderRadius[borderRadius],
      ...(withShadow && Shadows.md),
    },
    style,
  ];

  if (withGoldBorder) {
    return (
      <LinearGradient
        colors={Colors.goldGradient}
        style={[cardStyle, { padding: 2 }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={[styles.innerContainer, { borderRadius: BorderRadius[borderRadius] - 2 }]}>
          {children}
        </View>
      </LinearGradient>
    );
  }

  return (
    <View style={cardStyle}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.glassBackground,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    backdropFilter: 'blur(10px)',
    overflow: 'hidden',
  },
  innerContainer: {
    backgroundColor: Colors.glassBackground,
    flex: 1,
    overflow: 'hidden',
  },
});
