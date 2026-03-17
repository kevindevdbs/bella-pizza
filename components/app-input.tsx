import { borderRadius, colors, fontSize, spacing } from "@/constants/theme";
import { AppInputProps } from "@/types";
import { StyleSheet, Text, TextInput, View } from "react-native";

export function AppInput({
  label,
  containerStyle,
  labelStyle,
  inputStyle,
  ...props
}: AppInputProps) {
  return (
    <View style={[styles.fieldGroup, containerStyle]}>
      <Text style={[styles.label, labelStyle]}>{label}</Text>
      <TextInput
        style={[styles.input, inputStyle]}
        placeholderTextColor={colors.gray}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fieldGroup: {
    gap: spacing.sm,
  },
  label: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: "700",
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    height: 52,
    paddingHorizontal: spacing.md,
    color: colors.text,
    fontSize: fontSize.md,
  },
});
