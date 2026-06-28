import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../theme';

export default function StatBar({ label, value, accent }) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}%</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${Math.min(Math.max(value, 0), 100)}%`, backgroundColor: accent }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  value: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  track: {
    height: 12,
    borderRadius: radius.sm,
    backgroundColor: '#0B1324',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radius.sm,
  },
});
