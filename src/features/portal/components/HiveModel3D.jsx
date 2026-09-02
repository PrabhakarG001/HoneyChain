import React, { useRef } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box } from '@react-three/drei';

function HiveBox({ position }) {
  return (
    <Box args={[2, 1.5, 2.5]} position={position} castShadow receiveShadow>
      <meshStandardMaterial color="#EAB308" roughness={0.7} />
    </Box>
  );
}

function FloatingData({ position, text, color }) {
  const ref = useRef();
  
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <Text
      ref={ref}
      position={position}
      color={color}
      fontSize={0.4}
      maxWidth={200}
      lineHeight={1}
      letterSpacing={0.02}
      textAlign={'left'}
      font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
      anchorX="center"
      anchorY="middle"
    >
      {text}
    </Text>
  );
}

export default function HiveModel3D() {
  // Safe guard in case expo-gl fails on some specific unconfigured environments,
  // but generally Canvas works seamlessly on web and native if expo-gl is installed.
  return (
    <View style={styles.container}>
      <Canvas shadows camera={{ position: [5, 5, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        
        {/* Hive Base */}
        <Box args={[2.2, 0.2, 2.7]} position={[0, -1.6, 0]}>
          <meshStandardMaterial color="#854D0E" />
        </Box>
        
        {/* Hive Boxes (Brood & Supers) */}
        <HiveBox position={[0, -0.7, 0]} />
        <HiveBox position={[0, 0.9, 0]} />
        
        {/* Hive Roof */}
        <Box args={[2.4, 0.4, 2.9]} position={[0, 1.85, 0]}>
          <meshStandardMaterial color="#A16207" />
        </Box>

        {/* Floating Data Particles */}
        <FloatingData position={[-2, 2, 0]} text="34.5°C" color="#EF4444" />
        <FloatingData position={[2, 1.5, 1]} text="Wildflower" color="#10B981" />
        <FloatingData position={[0, 3, 0]} text="Harvest: Fall 2026" color="#3B82F6" />

        <OrbitControls enablePan={false} minDistance={4} maxDistance={12} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 300,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    overflow: 'hidden',
  }
});
