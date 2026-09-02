import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, Platform } from 'react-native';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin } from 'lucide-react-native';

let MapView, Marker, Circle;
if (Platform.OS !== 'web') {
  const maps = require('react-native-maps');
  MapView = maps.default;
  Marker = maps.Marker;
  Circle = maps.Circle;
}

export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [mockNectarData, setMockNectarData] = useState([]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);

      // Generate some mock nectar flow data around the user's location
      const mockPoints = Array.from({ length: 5 }).map(() => ({
        latitude: loc.coords.latitude + (Math.random() - 0.5) * 0.05,
        longitude: loc.coords.longitude + (Math.random() - 0.5) * 0.05,
        intensity: Math.random() * 100, // 0 to 100%
      }));
      setMockNectarData(mockPoints);
    })();
  }, []);

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <SafeAreaView edges={['top']} style={styles.header}>
          <View style={styles.headerContent}>
            <MapPin size={24} color="#111827" />
            <Text style={styles.headerTitle}>Community Nectar Flow</Text>
          </View>
        </SafeAreaView>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Interactive Map is only available on iOS and Android.</Text>
        </View>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1D4ED8" />
        <Text style={styles.loadingText}>Loading Map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.header}>
        <View style={styles.headerContent}>
          <MapPin size={24} color="#111827" />
          <Text style={styles.headerTitle}>Community Nectar Flow</Text>
        </View>
      </SafeAreaView>

      <MapView 
        style={styles.map}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}
      >
        {/* We use colored circles to mock a heatmap overlay */}
        {mockNectarData.map((point, index) => (
          <Circle
            key={index}
            center={{ latitude: point.latitude, longitude: point.longitude }}
            radius={1000 + point.intensity * 20} // Radius scales with intensity
            fillColor={`rgba(234, 179, 8, ${point.intensity / 200})`} // Yellow color with varying opacity
            strokeColor="rgba(234, 179, 8, 0.2)"
            strokeWidth={1}
          />
        ))}

        {mockNectarData.map((point, index) => (
          <Marker
            key={`marker-${index}`}
            coordinate={{ latitude: point.latitude, longitude: point.longitude }}
            title="Nectar Flow"
            description={`Intensity: ${Math.round(point.intensity)}%`}
          />
        ))}
      </MapView>

      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Nectar Flow Intensity</Text>
        <View style={styles.legendRow}>
          <View style={[styles.legendColor, { backgroundColor: 'rgba(234, 179, 8, 0.2)' }]} />
          <Text style={styles.legendText}>Low</Text>
        </View>
        <View style={styles.legendRow}>
          <View style={[styles.legendColor, { backgroundColor: 'rgba(234, 179, 8, 0.6)' }]} />
          <Text style={styles.legendText}>High</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#6B7280',
  },
  header: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  map: {
    flex: 1,
  },
  legend: {
    position: 'absolute',
    bottom: 120, // above bottom navbar
    right: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  legendTitle: {
    fontWeight: '600',
    marginBottom: 8,
    color: '#374151',
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#4B5563',
  }
});
