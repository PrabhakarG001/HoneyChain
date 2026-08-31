import React from 'react';
import { View, Text } from 'react-native';
import { Circle } from 'lucide-react-native';
import { theme } from '../../../theme';
import styles from './ActivityTimeline.styles';

export default function ActivityTimeline({ activities }) {
  if (!activities || activities.length === 0) return null;

  return (
    <View style={styles.container}>
      {activities.map((activity, index) => {
        const isLast = index === activities.length - 1;
        return (
          <View key={`activity-${index}`} style={styles.activityRow}>
            <View style={styles.timeColumn}>
              <Text style={styles.timeText}>{activity.time}</Text>
            </View>
            
            <View style={styles.timelineColumn}>
              <View style={styles.dot}>
                <Circle size={10} color={theme.colors.primaryDark} fill={theme.colors.primaryDark} />
              </View>
              {!isLast && <View style={styles.line} />}
            </View>
            
            <View style={styles.contentColumn}>
              <Text style={styles.title}>{activity.title}</Text>
              {activity.description && (
                <Text style={styles.description}>{activity.description}</Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}
