import { borderRadius, colors, fontSize, spacing } from "@/constants/theme";
import { AppSelectProps } from "@/types";
import { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export function AppSelect({
  value,
  options,
  onValueChange,
  placeholder = "Selecione",
  disabled = false,
  containerStyle,
  triggerStyle,
  valueTextStyle,
}: AppSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedLabel = useMemo(() => {
    if (!value) return "";
    return options.find((option) => option.value === value)?.label ?? "";
  }, [options, value]);

  function handleSelect(optionValue: string) {
    onValueChange(optionValue);
    setIsOpen(false);
  }

  return (
    <View style={containerStyle}>
      <Pressable
        style={[
          styles.trigger,
          disabled && styles.triggerDisabled,
          triggerStyle,
        ]}
        onPress={() => setIsOpen(true)}
        disabled={disabled}
      >
        <Text
          style={[
            styles.triggerText,
            !selectedLabel && styles.placeholderText,
            valueTextStyle,
          ]}
        >
          {selectedLabel || placeholder}
        </Text>

        <Text style={styles.chevron}>▾</Text>
      </Pressable>

      <Modal
        animationType="fade"
        transparent
        visible={isOpen}
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setIsOpen(false)}>
          <Pressable style={styles.sheet} onPress={() => null}>
            <ScrollView
              style={styles.optionsList}
              contentContainerStyle={styles.optionsContent}
              showsVerticalScrollIndicator={false}
            >
              {options.map((option) => {
                const isSelected = option.value === value;

                return (
                  <Pressable
                    key={option.value}
                    style={[styles.option, isSelected && styles.optionSelected]}
                    onPress={() => handleSelect(option.value)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.optionTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  trigger: {
    height: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    backgroundColor: colors.card,
    paddingHorizontal: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  triggerDisabled: {
    opacity: 0.6,
  },
  triggerText: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: "500",
  },
  placeholderText: {
    color: colors.mutedText,
    fontWeight: "400",
  },
  chevron: {
    color: colors.mutedText,
    fontSize: fontSize.md,
    fontWeight: "700",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    padding: spacing.lg,
  },
  sheet: {
    maxHeight: "60%",
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    overflow: "hidden",
  },
  optionsList: {
    width: "100%",
  },
  optionsContent: {
    paddingVertical: spacing.xs,
  },
  option: {
    minHeight: 48,
    justifyContent: "center",
    paddingHorizontal: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  optionSelected: {
    backgroundColor: colors.muted,
  },
  optionText: {
    color: colors.text,
    fontSize: fontSize.md,
  },
  optionTextSelected: {
    color: colors.primary,
    fontWeight: "700",
  },
});
