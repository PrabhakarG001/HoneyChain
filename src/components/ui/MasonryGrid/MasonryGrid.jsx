import React from 'react';
import { View, ScrollView } from 'react-native';
import styles from './MasonryGrid.styles';

export default function MasonryGrid({ data, renderItem, numColumns = 2 }) {
  // Distribute items into columns
  const columns = Array.from({ length: numColumns }, () => []);
  
  data.forEach((item, index) => {
    // Simple distribution, could be improved by calculating actual heights
    columns[index % numColumns].push(item);
  });

  return (
    <View style={styles.container}>
      {columns.map((col, colIndex) => (
        <View key={`col-${colIndex}`} style={styles.column}>
          {col.map((item, index) => (
            <View key={`item-${colIndex}-${index}`} style={styles.itemContainer}>
              {renderItem({ item, index, columnIndex: colIndex })}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}
