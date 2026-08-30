import React from 'react';
import { View, Text } from 'react-native';
import { CheckCircle2, Circle } from 'lucide-react-native';
import { theme } from '../../../theme';
import styles from './Timeline.styles';

export default function Timeline({ events }) {
  return (
    <View style={styles.container}>
      {events.map((event, index) => {
        const isLast = index === events.length - 1;
        const isCompleted = event.completed;
        const Icon = isCompleted ? CheckCircle2 : Circle;
        
        return (
          <View key={`event-${index}`} style={styles.eventContainer}>
            {/* Timeline Line */}
            {!isLast && (
              <View style={[styles.line, isCompleted ? styles.lineCompleted : null]} />
            )}
            
            {/* Timeline Icon */}
            <View style={styles.iconContainer}>
              <Icon 
                size={24} 
                color={isCompleted ? theme.colors.status.success : theme.colors.borderDark} 
              />
            </View>
            
            {/* Event Content */}
            <View style={styles.contentContainer}>
              <Text style={[styles.title, !isCompleted && styles.textMuted]}>
                {event.title}
              </Text>
              {event.description && (
                <Text style={styles.description}>
                  {event.description}
                </Text>
              )}
              {event.date && (
                <Text style={styles.date}>
                  {event.date}
                </Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}
