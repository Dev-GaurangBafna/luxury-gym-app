import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle, Line, Text as SvgText } from 'react-native-svg';

import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';

const { width: screenWidth } = Dimensions.get('window');

interface DataPoint {
  x: number;
  y: number;
  label?: string;
}

interface ProgressChartProps {
  data: DataPoint[];
  title: string;
  color?: string;
  height?: number;
  showGrid?: boolean;
  animated?: boolean;
}

export const ProgressChart: React.FC<ProgressChartProps> = ({
  data,
  title,
  color = Colors.gold,
  height = 200,
  showGrid = true,
  animated = true,
}) => {
  const chartWidth = screenWidth - 64; // Account for padding
  const chartHeight = height - 60; // Account for title and labels
  const padding = 20;

  if (data.length === 0) {
    return (
      <View style={[styles.container, { height }]}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.emptyChart}>
          <Text style={styles.emptyText}>No data available</Text>
        </View>
      </View>
    );
  }

  // Calculate bounds
  const minX = Math.min(...data.map(d => d.x));
  const maxX = Math.max(...data.map(d => d.x));
  const minY = Math.min(...data.map(d => d.y));
  const maxY = Math.max(...data.map(d => d.y));

  // Add some padding to Y range
  const yRange = maxY - minY;
  const yPadding = yRange * 0.1;
  const adjustedMinY = minY - yPadding;
  const adjustedMaxY = maxY + yPadding;

  // Scale functions
  const scaleX = (x: number) => 
    padding + ((x - minX) / (maxX - minX)) * (chartWidth - 2 * padding);
  
  const scaleY = (y: number) => 
    chartHeight - padding - ((y - adjustedMinY) / (adjustedMaxY - adjustedMinY)) * (chartHeight - 2 * padding);

  // Generate path for line chart
  const generatePath = () => {
    if (data.length < 2) return '';
    
    let path = `M ${scaleX(data[0].x)} ${scaleY(data[0].y)}`;
    
    for (let i = 1; i < data.length; i++) {
      const prevPoint = data[i - 1];
      const currPoint = data[i];
      
      // Create smooth curve using quadratic bezier
      const cpX = (scaleX(prevPoint.x) + scaleX(currPoint.x)) / 2;
      const cpY = (scaleY(prevPoint.y) + scaleY(currPoint.y)) / 2;
      
      path += ` Q ${cpX} ${scaleY(prevPoint.y)} ${scaleX(currPoint.x)} ${scaleY(currPoint.y)}`;
    }
    
    return path;
  };

  // Generate gradient area path
  const generateAreaPath = () => {
    if (data.length < 2) return '';
    
    let path = `M ${scaleX(data[0].x)} ${chartHeight - padding}`;
    path += ` L ${scaleX(data[0].x)} ${scaleY(data[0].y)}`;
    
    for (let i = 1; i < data.length; i++) {
      const prevPoint = data[i - 1];
      const currPoint = data[i];
      
      const cpX = (scaleX(prevPoint.x) + scaleX(currPoint.x)) / 2;
      const cpY = (scaleY(prevPoint.y) + scaleY(currPoint.y)) / 2;
      
      path += ` Q ${cpX} ${scaleY(prevPoint.y)} ${scaleX(currPoint.x)} ${scaleY(currPoint.y)}`;
    }
    
    path += ` L ${scaleX(data[data.length - 1].x)} ${chartHeight - padding}`;
    path += ` Z`;
    
    return path;
  };

  const linePath = generatePath();
  const areaPath = generateAreaPath();

  return (
    <View style={[styles.container, { height }]}>
      <Text style={styles.title}>{title}</Text>
      
      <View style={styles.chartContainer}>
        <Svg width={chartWidth} height={chartHeight}>
          {/* Grid lines */}
          {showGrid && (
            <>
              {/* Horizontal grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
                const y = padding + ratio * (chartHeight - 2 * padding);
                return (
                  <Line
                    key={`h-grid-${index}`}
                    x1={padding}
                    y1={y}
                    x2={chartWidth - padding}
                    y2={y}
                    stroke={Colors.darkGray}
                    strokeWidth={0.5}
                    opacity={0.3}
                  />
                );
              })}
              
              {/* Vertical grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
                const x = padding + ratio * (chartWidth - 2 * padding);
                return (
                  <Line
                    key={`v-grid-${index}`}
                    x1={x}
                    y1={padding}
                    x2={x}
                    y2={chartHeight - padding}
                    stroke={Colors.darkGray}
                    strokeWidth={0.5}
                    opacity={0.3}
                  />
                );
              })}
            </>
          )}
          
          {/* Gradient area */}
          <Path
            d={areaPath}
            fill={`url(#gradient-${color.replace('#', '')})`}
            opacity={0.2}
          />
          
          {/* Main line */}
          <Path
            d={linePath}
            stroke={color}
            strokeWidth={3}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Data points */}
          {data.map((point, index) => (
            <Circle
              key={index}
              cx={scaleX(point.x)}
              cy={scaleY(point.y)}
              r={4}
              fill={color}
              stroke={Colors.background}
              strokeWidth={2}
            />
          ))}
          
          {/* Y-axis labels */}
          <SvgText
            x={5}
            y={padding + 5}
            fontSize={10}
            fill={Colors.gray}
            textAnchor="start"
          >
            {adjustedMaxY.toFixed(0)}
          </SvgText>
          
          <SvgText
            x={5}
            y={chartHeight - padding + 5}
            fontSize={10}
            fill={Colors.gray}
            textAnchor="start"
          >
            {adjustedMinY.toFixed(0)}
          </SvgText>
          
          {/* Define gradient */}
          <defs>
            <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
        </Svg>
        
        {/* Value indicators */}
        <View style={styles.valueIndicators}>
          <View style={styles.valueIndicator}>
            <Text style={styles.valueLabel}>Current</Text>
            <Text style={[styles.valueText, { color }]}>
              {data[data.length - 1]?.y.toFixed(1)}
            </Text>
          </View>
          
          <View style={styles.valueIndicator}>
            <Text style={styles.valueLabel}>Change</Text>
            <Text style={[
              styles.valueText, 
              { color: data[data.length - 1]?.y > data[0]?.y ? Colors.emerald : Colors.crimson }
            ]}>
              {data.length > 1 
                ? `${data[data.length - 1].y > data[0].y ? '+' : ''}${(data[data.length - 1].y - data[0].y).toFixed(1)}`
                : '0'
              }
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.glassBackground,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  chartContainer: {
    position: 'relative',
  },
  emptyChart: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.darkGray,
    borderRadius: BorderRadius.md,
  },
  emptyText: {
    fontSize: Typography.fontSize.base,
    color: Colors.gray,
  },
  valueIndicators: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.darkGray,
  },
  valueIndicator: {
    alignItems: 'center',
  },
  valueLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.gray,
    marginBottom: Spacing.xs,
  },
  valueText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
  },
});

