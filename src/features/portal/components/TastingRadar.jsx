import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

// Dynamically require recharts so it doesn't crash React Native Metro bundler
let Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer;
if (Platform.OS === 'web') {
  const recharts = require('recharts');
  Radar = recharts.Radar;
  RadarChart = recharts.RadarChart;
  PolarGrid = recharts.PolarGrid;
  PolarAngleAxis = recharts.PolarAngleAxis;
  PolarRadiusAxis = recharts.PolarRadiusAxis;
  ResponsiveContainer = recharts.ResponsiveContainer;
}

const flavorData = [
  { subject: 'Floral', A: 90, fullMark: 100 },
  { subject: 'Woody', A: 60, fullMark: 100 },
  { subject: 'Sweetness', A: 85, fullMark: 100 },
  { subject: 'Citrus', A: 40, fullMark: 100 },
  { subject: 'Earthy', A: 50, fullMark: 100 },
  { subject: 'Spicy', A: 30, fullMark: 100 },
];

export default function TastingRadar() {
  if (Platform.OS !== 'web') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Flavor Profile</Text>
        <Text style={styles.fallbackText}>
          Tasting notes are available on the web portal. Scan the QR code to view the interactive flavor radar!
        </Text>
        {flavorData.map(d => (
          <Text key={d.subject} style={styles.listItem}>• {d.subject}: {d.A}/100</Text>
        ))}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tasting Notes</Text>
      <Text style={styles.subtitle}>Fall 2026 Harvest Profile</Text>
      
      <View style={styles.chartContainer}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={flavorData}>
            <PolarGrid stroke="#E5E7EB" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#4B5563', fontSize: 12, fontWeight: 600 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar
              name="Batch Flavor"
              dataKey="A"
              stroke="#EAB308"
              fill="#FDE047"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ResponsiveContainer>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  chartContainer: {
    height: 250,
    width: '100%',
    marginTop: 8,
  },
  fallbackText: {
    marginTop: 8,
    marginBottom: 16,
    color: '#4B5563',
    lineHeight: 20,
  },
  listItem: {
    color: '#374151',
    fontWeight: '500',
    marginVertical: 2,
  }
});
