import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '../theme';

const tones = {
  Bajo: { backgroundColor: colors.successBg, borderColor: colors.green, textColor: colors.green },
  Medio: { backgroundColor: colors.warningBg, borderColor: colors.yellow, textColor: colors.yellow },
  Alto: { backgroundColor: colors.dangerBg, borderColor: colors.red, textColor: colors.red },
};

export default function RiskBadge({ level }) {
  const tone = tones[level] || tones.Medio;

  return (
    <View style={[styles.badge, { backgroundColor: tone.backgroundColor, borderColor: tone.borderColor }]}>
      <Text style={[styles.text, { color: tone.textColor }]}>{level || 'Medio'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  text: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
});
