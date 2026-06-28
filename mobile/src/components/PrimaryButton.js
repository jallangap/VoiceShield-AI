import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, radius, spacing } from '../theme';

export default function PrimaryButton({ label, onPress, disabled = false, tone = 'cyan' }) {
  const borderColor =
    tone === 'green' ? colors.green : tone === 'yellow' ? colors.yellow : colors.cyan;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        {
          borderColor,
          opacity: disabled ? 0.45 : pressed ? 0.88 : 1,
        },
      ]}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 54,
    borderRadius: radius.md,
    borderWidth: 1,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  label: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
