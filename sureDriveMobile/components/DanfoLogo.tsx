import * as React from 'react';
import Svg, { Rect, Circle, Path } from 'react-native-svg';
import { View, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function DanfoLogo() {
  return (
    <View style={styles.container}>
      <Svg width={90} height={60} viewBox="0 0 90 60">
        {/* Bus body */}
        <Rect x={10} y={25} rx={8} width={70} height={20} fill="#FFB300" stroke="#222" strokeWidth={2} />
        {/* Windows */}
        <Rect x={18} y={30} width={15} height={10} fill="#fff" stroke="#222" strokeWidth={1} />
        <Rect x={36} y={30} width={15} height={10} fill="#fff" stroke="#222" strokeWidth={1} />
        <Rect x={54} y={30} width={18} height={10} fill="#fff" stroke="#222" strokeWidth={1} />
        {/* Wheels */}
        <Circle cx={22} cy={48} r={5} fill="#222" />
        <Circle cx={68} cy={48} r={5} fill="#222" />
        {/* Door */}
        <Rect x={60} y={35} width={6} height={10} fill="#eee" stroke="#222" strokeWidth={1} />
        {/* Black stripe */}
        <Path d="M10 40 h70" stroke="#222" strokeWidth={3} />
      </Svg>
      {/* Verified badge */}
      <View style={styles.badge}>
        <MaterialIcons name="verified" size={28} color="#4CAF50" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  badge: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 2,
    elevation: 3,
  },
}); 