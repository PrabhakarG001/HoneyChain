import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera as CameraIcon, Check, X, ScanSearch, Save } from 'lucide-react-native';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const cameraRef = useRef(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>We need your permission to show the camera</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true };
      const data = await cameraRef.current.takePictureAsync(options);
      setPhoto(data);
      processImage(data);
    }
  };

  const processImage = async (data) => {
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: data.uri,
        type: 'image/jpeg',
        name: 'photo.jpg',
      });
      // Replace with actual AI endpoint
      // const response = await api.post('/analysis/image', formData);
      // setAnalysisResult(response.data);
      
      // Fallback empty state since endpoint isn't fully known
      setAnalysisResult({
        type: 'Analysis Pending',
        count: 0,
        cappedBroodPercent: 0,
        boxes: []
      });
    } catch (e) {
      console.error('Analysis failed', e);
    } finally {
      setIsProcessing(false);
    }
  };

  const saveToHiveRecord = () => {
    console.log('Saved to Hive Record:', analysisResult);
    // In a real app, dispatch to store or save to DB here
    setPhoto(null);
    setAnalysisResult(null);
  };

  const retakePhoto = () => {
    setPhoto(null);
    setAnalysisResult(null);
  };

  if (photo) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.previewContainer}>
          <Image source={{ uri: photo.uri }} style={styles.preview} />
          
          {isProcessing && (
            <View style={styles.overlay}>
              <ActivityIndicator size="large" color="#FCD34D" />
              <Text style={styles.processingText}>Processing Image...</Text>
              <Text style={styles.processingSub}>Detecting Varroa Mites & Capped Brood</Text>
            </View>
          )}

          {!isProcessing && analysisResult && (
            <View style={styles.resultOverlay}>
              {/* Mock Bounding Boxes */}
              {analysisResult.boxes.map((box, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.boundingBox, 
                    { top: box.top, left: box.left, width: box.width, height: box.height }
                  ]} 
                />
              ))}
              
              <View style={styles.resultPanel}>
                <View style={styles.resultRow}>
                  <ScanSearch color="#10B981" size={24} />
                  <Text style={styles.resultTitle}>Inspection Complete</Text>
                </View>
                <Text style={styles.resultDetail}>
                  Varroa Mite Count: <Text style={styles.highlight}>{analysisResult.count}</Text>
                </Text>
                <Text style={styles.resultDetail}>
                  Capped Brood: <Text style={styles.highlight}>{analysisResult.cappedBroodPercent}%</Text>
                </Text>
              </View>
            </View>
          )}
        </View>

        {!isProcessing && (
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.secondaryButton} onPress={retakePhoto}>
              <X color="#4B5563" size={20} />
              <Text style={styles.secondaryButtonText}>Retake</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.primaryButton} onPress={saveToHiveRecord}>
              <Save color="#fff" size={20} />
              <Text style={styles.primaryButtonText}>Save to Hive</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <CameraView style={styles.camera} facing="back" ref={cameraRef}>
        <View style={styles.cameraOverlay}>
          <View style={styles.guideFrame} />
          <Text style={styles.guideText}>Align sticky board or frame within the guide</Text>
        </View>
        
        <View style={styles.cameraControls}>
          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
        </View>
      </CameraView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F9FAFB',
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#374151',
  },
  button: {
    backgroundColor: '#1D4ED8',
    padding: 14,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guideFrame: {
    width: '80%',
    height: '60%',
    borderWidth: 2,
    borderColor: 'rgba(252, 211, 77, 0.7)', // yellow-300
    borderRadius: 12,
    borderStyle: 'dashed',
  },
  guideText: {
    color: '#fff',
    marginTop: 16,
    fontSize: 14,
    fontWeight: '500',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  cameraControls: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff',
  },
  previewContainer: {
    flex: 1,
    position: 'relative',
  },
  preview: {
    flex: 1,
    resizeMode: 'contain',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
  },
  processingSub: {
    color: '#D1D5DB',
    fontSize: 14,
    marginTop: 8,
  },
  resultOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  boundingBox: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#EF4444', // red-500
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderRadius: 4,
  },
  resultPanel: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 12,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  resultDetail: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 8,
  },
  highlight: {
    color: '#1D4ED8',
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    gap: 8,
  },
  secondaryButtonText: {
    color: '#4B5563',
    fontWeight: '600',
    fontSize: 16,
  },
  primaryButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#1D4ED8',
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
