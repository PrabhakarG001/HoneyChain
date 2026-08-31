import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, ScrollView } from 'react-native';
import { Box, Sun, Droplet, FlaskConical, Package, ShieldCheck } from 'lucide-react-native';
import { theme } from '../../../theme';
import styles from './HoneyJourney.styles';

const JOURNEY_STEPS = [
  { id: 'hive', label: 'Hive', icon: Box },
  { id: 'environment', label: 'Environment', icon: Sun },
  { id: 'harvest', label: 'Harvest', icon: Droplet },
  { id: 'quality', label: 'Quality', icon: FlaskConical },
  { id: 'processing', label: 'Processing', icon: Package },
  { id: 'verification', label: 'Verification', icon: ShieldCheck },
];

export default function HoneyJourney({ currentStepIndex = 5 }) {
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: currentStepIndex,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [currentStepIndex, progressAnim]);

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.trackContainer}>
          {/* Background track line */}
          <View style={styles.trackBackground} />
          
          {/* Animated active track line */}
          <Animated.View 
            style={[
              styles.trackActive, 
              {
                width: progressAnim.interpolate({
                  inputRange: [0, JOURNEY_STEPS.length - 1],
                  outputRange: ['0%', '100%'],
                })
              }
            ]} 
          />
          
          <View style={styles.stepsRow}>
            {JOURNEY_STEPS.map((step, index) => {
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              const Icon = step.icon;
              
              return (
                <View key={step.id} style={styles.stepContainer}>
                  <View style={[
                    styles.iconWrapper,
                    isCompleted ? styles.iconWrapperCompleted : styles.iconWrapperPending,
                    isCurrent && styles.iconWrapperCurrent
                  ]}>
                    <Icon 
                      size={20} 
                      color={isCompleted ? theme.colors.white : theme.colors.text.muted} 
                    />
                  </View>
                  <Text style={[
                    styles.label,
                    isCompleted ? styles.labelCompleted : styles.labelPending
                  ]}>
                    {step.label}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
