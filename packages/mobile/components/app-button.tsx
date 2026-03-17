import { borderRadius, colors, fontSize, spacing } from "@/constants/theme";
import { AppButtonProps } from "@/types";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export function AppButton({
  title,
  variant = "secondary",
  loading = false,
  buttonStyle,
  textStyle,
  disabled,
  ...props
}: AppButtonProps) {
  const isPrimary = variant === "primary";
  const isDisabled = disabled || loading;
  const spinnerColor = isPrimary
    ? colors.primaryForeground
    : colors.secondaryForeground;

  return (
    <Pressable
      style={[
        styles.button,
        isPrimary ? styles.buttonPrimary : styles.buttonSecondary,
        isDisabled && styles.buttonDisabled,
        buttonStyle,
      ]}
      disabled={isDisabled}
      {...props}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="small" color={spinnerColor} />
        ) : null}

        <Text
          style={[
            styles.buttonText,
            isPrimary ? styles.buttonTextPrimary : styles.buttonTextSecondary,
            loading && styles.buttonTextLoading,
            textStyle,
          ]}
        >
          {title}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: spacing.sm,
    height: 52,
    borderRadius: borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
  },
  buttonSecondary: {
    backgroundColor: colors.secondary,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  buttonText: {
    fontSize: fontSize.lg,
    fontWeight: "800",
  },
  buttonTextLoading: {
    opacity: 0.95,
  },
  buttonTextPrimary: {
    color: colors.primaryForeground,
  },
  buttonTextSecondary: {
    color: colors.secondaryForeground,
  },
});
