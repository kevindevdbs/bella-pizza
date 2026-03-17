import { borderRadius, colors, fontSize, spacing } from "@/constants/theme";
import { AppOrderItemProps } from "@/types";
import { Feather } from "@expo/vector-icons";
import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export function AppOrderItem({
  name,
  quantity,
  price,
  note,
  onEditNote,
  onRemove,
  removing = false,
  containerStyle,
  titleStyle,
  subtitleStyle,
  removeButtonProps,
}: AppOrderItemProps) {
  const formattedPrice = useMemo(
    () =>
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(price),
    [price],
  );

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.infoContent}>
        <Text style={[styles.title, titleStyle]} numberOfLines={1}>
          {name}
        </Text>

        <Text style={[styles.subtitle, subtitleStyle]}>
          {quantity}x - {formattedPrice}
        </Text>

        {note ? <Text style={styles.noteText}>Obs: {note}</Text> : null}
      </View>

      <Pressable
        style={styles.editButton}
        onPress={onEditNote}
        disabled={removing || !onEditNote}
      >
        <Feather name="edit-2" size={16} color={colors.secondaryForeground} />
      </Pressable>

      <Pressable
        style={[styles.removeButton, removing && styles.removeButtonDisabled]}
        onPress={onRemove}
        disabled={removing}
        {...removeButtonProps}
      >
        <Feather name="trash-2" size={18} color={colors.primaryForeground} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 72,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  infoContent: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: "500",
  },
  subtitle: {
    color: colors.mutedText,
    fontSize: fontSize.md,
    fontWeight: "400",
  },
  noteText: {
    color: colors.primary,
    fontSize: fontSize.sm,
    fontWeight: "600",
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  removeButton: {
    width: 38,
    height: 38,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  removeButtonDisabled: {
    opacity: 0.6,
  },
});
