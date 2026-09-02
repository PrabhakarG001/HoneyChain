import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Modal, ScrollView, Dimensions, Platform } from 'react-native';
import Svg, { Path, Rect, Text as SvgText, Circle } from 'react-native-svg';
import { X, ShieldCheck } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const DAG_DATA = {
  nodes: [
    { id: 'h1', type: 'hive', label: 'Hive 001', x: 50, y: 50, data: 'Apiary A' },
    { id: 'h2', type: 'hive', label: 'Hive 003', x: 250, y: 50, data: 'Apiary B' },
    { id: 'hv1', type: 'harvest', label: 'Harvest A', x: 50, y: 150, data: '30 lbs' },
    { id: 'hv2', type: 'harvest', label: 'Harvest B', x: 250, y: 150, data: '25 lbs' },
    { id: 'b1', type: 'batch', label: 'Batch X', x: 150, y: 250, data: 'Merged: 55 lbs, Pasteurized' },
    { id: 'p1', type: 'product', label: 'Product Units', x: 150, y: 350, data: 'PROD_0001 - 0480' },
  ],
  edges: [
    { source: 'h1', target: 'hv1' },
    { source: 'h2', target: 'hv2' },
    { source: 'hv1', target: 'b1' },
    { source: 'hv2', target: 'b1' },
    { source: 'b1', target: 'p1' },
  ]
};

export default function GenealogyGraph() {
  const [selectedNode, setSelectedNode] = useState(null);

  const renderEdges = () => {
    return DAG_DATA.edges.map((edge, index) => {
      const sourceNode = DAG_DATA.nodes.find(n => n.id === edge.source);
      const targetNode = DAG_DATA.nodes.find(n => n.id === edge.target);
      if (!sourceNode || !targetNode) return null;

      // Draw a curved path
      const path = `M ${sourceNode.x + 40} ${sourceNode.y + 40} C ${sourceNode.x + 40} ${sourceNode.y + 70}, ${targetNode.x + 40} ${targetNode.y - 20}, ${targetNode.x + 40} ${targetNode.y}`;

      return (
        <Path 
          key={`edge-${index}`}
          d={path}
          stroke="#9CA3AF"
          strokeWidth="2"
          fill="none"
        />
      );
    });
  };

  const getNodeColor = (type) => {
    switch (type) {
      case 'hive': return '#FDE047'; // yellow-300
      case 'harvest': return '#FCD34D'; // amber-300
      case 'batch': return '#F59E0B'; // amber-500
      case 'product': return '#10B981'; // emerald-500
      default: return '#E5E7EB';
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal>
        <Svg width={350} height={420}>
          {renderEdges()}
          
          {DAG_DATA.nodes.map(node => (
            <React.Fragment key={node.id}>
              <Rect
                x={node.x}
                y={node.y}
                width={80}
                height={40}
                rx={8}
                fill={getNodeColor(node.type)}
                onPress={() => setSelectedNode(node)}
              />
              <SvgText
                x={node.x + 40}
                y={node.y + 24}
                fontSize="12"
                fontWeight="bold"
                fill="#111827"
                textAnchor="middle"
                onPress={() => setSelectedNode(node)}
              >
                {node.label}
              </SvgText>
            </React.Fragment>
          ))}
        </Svg>
      </ScrollView>

      {/* Node Details Modal */}
      <Modal visible={!!selectedNode} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.titleRow}>
                <ShieldCheck color="#10B981" size={24} />
                <Text style={styles.modalTitle}>{selectedNode?.label}</Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedNode(null)}>
                <X color="#6B7280" size={24} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <Text style={styles.detailLabel}>Type:</Text>
              <Text style={styles.detailValue}>{selectedNode?.type.toUpperCase()}</Text>
              
              <Text style={styles.detailLabel}>Details:</Text>
              <Text style={styles.detailValue}>{selectedNode?.data}</Text>
              
              <Text style={styles.detailLabel}>On-chain Hash:</Text>
              <Text style={styles.hashText}>0x{(Math.random() * 1e16).toString(16)}...{(Math.random() * 1e16).toString(16)}</Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    marginVertical: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  modalBody: {
    gap: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
    marginTop: 8,
  },
  detailValue: {
    fontSize: 16,
    color: '#111827',
  },
  hashText: {
    fontSize: 14,
    color: '#1D4ED8',
    fontFamily: Platform?.OS === 'ios' ? 'Menlo' : 'monospace',
    backgroundColor: '#EFF6FF',
    padding: 8,
    borderRadius: 6,
    marginTop: 4,
  }
});
