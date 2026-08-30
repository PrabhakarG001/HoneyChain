import React from 'react';
import { View, useWindowDimensions } from 'react-native';
import styles from './MasonryGrid.styles';

export default function MasonryGrid({ data, renderItem, numColumns: overrideColumns }) {
  const { width } = useWindowDimensions();
  
  // Calculate default columns based on width if not overridden
  const numColumns = overrideColumns || (width < 600 ? 2 : width < 900 ? 3 : 4);

  // Distribute items into columns
  const columns = Array.from({ length: numColumns }, () => []);
  
  data.forEach((item, index) => {
    // Simple distribution
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
