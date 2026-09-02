import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, TouchableOpacity, Linking, Platform } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShieldCheck, ExternalLink, Leaf, MapPin, CalendarDays, Droplets, FlaskConical, Network, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react-native';
import Svg, { Path, Rect, Text as SvgText } from 'react-native-svg';

// Mini Genealogy Graph SVG Component
const MiniGenealogyGraph = () => {
  const DAG_DATA = {
    nodes: [
      { id: 'h1', type: 'hive', label: 'Hive 1', x: 20, y: 20 },
      { id: 'h2', type: 'hive', label: 'Hive 2', x: 180, y: 20 },
      { id: 'hv1', type: 'harvest', label: 'Harvest A', x: 20, y: 90 },
      { id: 'hv2', type: 'harvest', label: 'Harvest B', x: 180, y: 90 },
      { id: 'b1', type: 'batch', label: 'Batch X', x: 100, y: 160 },
      { id: 'p1', type: 'product', label: 'You!', x: 100, y: 230 },
    ],
    edges: [
      { source: 'h1', target: 'hv1' },
      { source: 'h2', target: 'hv2' },
      { source: 'hv1', target: 'b1' },
      { source: 'hv2', target: 'b1' },
      { source: 'b1', target: 'p1' },
    ]
  };

  const renderEdges = () => {
    return DAG_DATA.edges.map((edge, index) => {
      const sourceNode = DAG_DATA.nodes.find(n => n.id === edge.source);
      const targetNode = DAG_DATA.nodes.find(n => n.id === edge.target);
      if (!sourceNode || !targetNode) return null;

      const path = `M ${sourceNode.x + 35} ${sourceNode.y + 30} C ${sourceNode.x + 35} ${sourceNode.y + 50}, ${targetNode.x + 35} ${targetNode.y - 15}, ${targetNode.x + 35} ${targetNode.y}`;

      return (
        <Path 
          key={`edge-${index}`}
          d={path}
          stroke="#D1D5DB"
          strokeWidth="2"
          fill="none"
        />
      );
    });
  };

  const getNodeColor = (type) => {
    switch (type) {
      case 'hive': return '#FEF08A'; // yellow-200
      case 'harvest': return '#FDE047'; // yellow-300
      case 'batch': return '#FACC15'; // yellow-400
      case 'product': return '#10B981'; // emerald-500
      default: return '#E5E7EB';
    }
  };

  return (
    <View style={styles.graphContainer}>
      <Svg width={270} height={280}>
        {renderEdges()}
        {DAG_DATA.nodes.map(node => (
          <React.Fragment key={node.id}>
            <Rect
              x={node.x}
              y={node.y}
              width={70}
              height={30}
              rx={6}
              fill={getNodeColor(node.type)}
            />
            <SvgText
              x={node.x + 35}
              y={node.y + 19}
              fontSize="10"
              fontWeight="bold"
              fill={node.type === 'product' ? '#fff' : '#374151'}
              textAnchor="middle"
            >
              {node.label}
            </SvgText>
          </React.Fragment>
        ))}
      </Svg>
    </View>
  );
};

export default function VerificationLanding() {
  const { productId } = useLocalSearchParams();
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const [isGraphOpen, setIsGraphOpen] = useState(false);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      ])
    ).start();
  }, []);

  const openExplorer = () => {
    // Mock URL to Polygon Amoy Explorer
    Linking.openURL('https://amoy.polygonscan.com/tx/0xmockhash1234567890');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Verification Header */}
        <View style={styles.header}>
          <Animated.View style={[styles.shieldWrapper, { transform: [{ scale: scaleAnim }] }]}>
            <ShieldCheck color="#10B981" size={64} strokeWidth={1.5} />
          </Animated.View>
          <Text style={styles.verifiedTitle}>Authenticity Verified</Text>
          <Text style={styles.productId}>Product ID: {productId || 'PROD_0000'}</Text>
          
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreTitle}>Traceability Confidence Score</Text>
            <View style={styles.scoreMeter}>
              <View style={[styles.scoreFill, { width: '98%' }]} />
            </View>
            <Text style={styles.scoreText}>98% Complete Chain of Custody</Text>
          </View>
          
          <TouchableOpacity style={styles.explorerLink} onPress={openExplorer}>
            <Text style={styles.explorerText}>View on Polygon Blockchain</Text>
            <ExternalLink size={16} color="#1D4ED8" />
          </TouchableOpacity>
        </View>

        {/* Honey Origin & Journey Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Origin Profile</Text>
          <View style={styles.profileCard}>
            <View style={styles.profileRow}>
              <CalendarDays color="#6B7280" size={20} />
              <View>
                <Text style={styles.profileLabel}>Bottling Date</Text>
                <Text style={styles.profileValue}>Oct 20, 2026</Text>
              </View>
            </View>
            <View style={styles.profileRow}>
              <Leaf color="#6B7280" size={20} />
              <View>
                <Text style={styles.profileLabel}>Botanical Origin</Text>
                <Text style={styles.profileValue}>Wildflower & Eucalyptus</Text>
              </View>
            </View>
            <View style={styles.profileRow}>
              <MapPin color="#6B7280" size={20} />
              <View>
                <Text style={styles.profileLabel}>Apiary Region</Text>
                <Text style={styles.profileValue}>Nilgiris Biosphere Cluster</Text>
              </View>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Journey Timeline</Text>
          <View style={styles.timeline}>
            <View style={styles.timelineStep}>
              <View style={styles.timelineDot} />
              <View style={styles.timelineContent}>
                <Text style={styles.stepTitle}>Harvest Date</Text>
                <Text style={styles.stepDesc}>Oct 15, 2026 - Extracted from hives</Text>
              </View>
            </View>
            <View style={styles.timelineLine} />
            <View style={styles.timelineStep}>
              <View style={styles.timelineDot} />
              <View style={styles.timelineContent}>
                <Text style={styles.stepTitle}>Collection Center Intake</Text>
                <Text style={styles.stepDesc}>Oct 16, 2026 - Weighed & logged</Text>
              </View>
            </View>
            <View style={styles.timelineLine} />
            <View style={styles.timelineStep}>
              <View style={styles.timelineDot} />
              <View style={styles.timelineContent}>
                <Text style={styles.stepTitle}>Filtration & Quality Check</Text>
                <Text style={styles.stepDesc}>Oct 18, 2026 - Filtered at 400 mesh</Text>
              </View>
            </View>
            <View style={styles.timelineLine} />
            <View style={styles.timelineStep}>
              <View style={[styles.timelineDot, { backgroundColor: '#10B981', borderColor: '#D1FAE5' }]} />
              <View style={styles.timelineContent}>
                <Text style={[styles.stepTitle, { color: '#10B981' }]}>Bottled & Sealed</Text>
                <Text style={styles.stepDesc}>Oct 20, 2026 - QR code applied</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Mini Batch Genealogy View */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.collapseHeader} 
            onPress={() => setIsGraphOpen(!isGraphOpen)}
          >
            <View style={styles.collapseTitleRow}>
              <Network color="#111827" size={20} />
              <Text style={styles.sectionTitle}>Source Transparency</Text>
            </View>
            {isGraphOpen ? <ChevronUp color="#6B7280" /> : <ChevronDown color="#6B7280" />}
          </TouchableOpacity>
          <Text style={styles.graphSummary}>This bottle traces to 2 harvests across 2 registered hives.</Text>
          
          {isGraphOpen && (
            <View style={styles.graphWrapper}>
              <MiniGenealogyGraph />
            </View>
          )}
        </View>

        {/* Lab Test Results */}
        <View style={styles.section}>
          <View style={styles.collapseTitleRow}>
            <FlaskConical color="#111827" size={20} />
            <Text style={styles.sectionTitle}>Lab Test Results</Text>
          </View>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Droplets color="#3B82F6" size={24} />
              <Text style={styles.statValue}>17.5%</Text>
              <Text style={styles.statLabel}>Moisture Content</Text>
            </View>
            <View style={styles.statCard}>
              <Leaf color="#EAB308" size={24} />
              <Text style={styles.statValue}>A+</Text>
              <Text style={styles.statLabel}>Pollen Purity</Text>
            </View>
          </View>

          <View style={styles.complianceCard}>
            <CheckCircle2 color="#10B981" size={24} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.complianceTitle}>FSSAI Standard Compliant</Text>
              <Text style={styles.complianceHash}>Cert Hash: 8f4e2b...9d1a3c</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Powered by HoneyChain Blockchain</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 20,
  },
  shieldWrapper: {
    marginBottom: 16,
    backgroundColor: '#ECFDF5',
    padding: 16,
    borderRadius: 50,
  },
  verifiedTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },
  productId: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    marginTop: 4,
    marginBottom: 20,
  },
  scoreContainer: {
    width: '100%',
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  scoreMeter: {
    width: '100%',
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  scoreFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  scoreText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '700',
  },
  explorerLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  explorerText: {
    color: '#1D4ED8',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  profileCard: {
    marginTop: 16,
    gap: 16,
    marginBottom: 24,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  profileLabel: {
    fontSize: 12,
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  profileValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  timeline: {
    marginTop: 16,
  },
  timelineStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timelineDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#D1D5DB',
    borderWidth: 4,
    borderColor: '#F3F4F6',
    marginTop: 2,
  },
  timelineLine: {
    width: 2,
    height: 24,
    backgroundColor: '#E5E7EB',
    marginLeft: 7,
    marginVertical: 4,
  },
  timelineContent: {
    marginLeft: 16,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  stepDesc: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  collapseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  collapseTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  graphSummary: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 22,
  },
  graphWrapper: {
    marginTop: 20,
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
  },
  graphContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginTop: 4,
  },
  complianceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    padding: 16,
    borderRadius: 12,
  },
  complianceTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#065F46',
  },
  complianceHash: {
    fontSize: 12,
    color: '#047857',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    marginTop: 2,
  },
  footer: {
    alignItems: 'center',
    marginTop: 16,
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  }
});
