import { AppButton } from "@/components/app-button";
import { borderRadius, colors, fontSize, spacing } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/services/api";
import { ActiveOrderByTableResponse, Order } from "@/types";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function Dashboard() {
  const router = useRouter();
  const { signOut } = useAuth();
  const [tableNumber, setTableNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingEditSentOrder, setLoadingEditSentOrder] = useState(false);

  function isWrappedOrderResponse(data: unknown): data is { order?: Order } {
    return typeof data === "object" && data !== null && "order" in data;
  }

  async function handleSignOut() {
    try {
      await signOut();
    } catch {
      Alert.alert("Erro", "Nao foi possivel sair da conta.");
    }
  }

  async function handleOpenOrder() {
    if (!tableNumber.trim()) {
      Alert.alert("Atenção", "Informe o numero da mesa para continuar.");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post<{ order?: Order } | Order>("/order", {
        table: Number(tableNumber),
      });

      const orderData = isWrappedOrderResponse(response.data)
        ? response.data.order
        : response.data;

      if (!orderData?.id) {
        throw new Error("Resposta de criação de pedido inválida.");
      }

      router.push({
        pathname: "/(authenticated)/order",
        params: {
          order_id: orderData.id,
          table: String(orderData.table),
        },
      });
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Falha ao abrir mesa, tente novamente mais tarde");
    } finally {
      setLoading(false);
    }
  }

  async function handleEditSentOrder() {
    if (!tableNumber.trim()) {
      Alert.alert("Atenção", "Informe o numero da mesa para continuar.");
      return;
    }

    try {
      setLoadingEditSentOrder(true);
      const response = await api.get<ActiveOrderByTableResponse>(
        "/order/active-by-table",
        {
          params: {
            table: Number(tableNumber),
          },
        },
      );

      const orderData = response.data.order;

      if (!orderData?.id) {
        throw new Error("Pedido ativo não encontrado para esta mesa.");
      }

      router.push({
        pathname: "/(authenticated)/order",
        params: {
          order_id: orderData.id,
          table: String(orderData.table),
          mode: "sent",
        },
      });
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Atenção",
        "Não encontramos pedido em produção para esta mesa.",
      );
    } finally {
      setLoadingEditSentOrder(false);
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.topBar}>
            <AppButton
              title="Sair"
              variant="primary"
              onPress={handleSignOut}
              buttonStyle={styles.signOutButton}
              textStyle={styles.signOutText}
            />
          </View>

          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.logoText}>
                Bella<Text style={styles.logoHighlight}>Pizza</Text>
              </Text>
            </View>

            <View style={styles.form}>
              <Text style={styles.sectionTitle}>Novo pedido</Text>

              <TextInput
                style={styles.input}
                placeholder="Numero da mesa"
                placeholderTextColor={colors.mutedText}
                keyboardType="number-pad"
                value={tableNumber}
                onChangeText={setTableNumber}
              />

              <AppButton
                title="Abrir mesa"
                loading={loading}
                onPress={handleOpenOrder}
              />

              <AppButton
                title="Alterar pedido enviado"
                loading={loadingEditSentOrder}
                onPress={handleEditSentOrder}
                disabled={loading}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
    flexGrow: 1,
  },
  topBar: {
    alignItems: "flex-end",
    marginBottom: spacing.lg,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  header: {
    marginBottom: spacing.xxl,
    alignItems: "center",
  },
  form: {
    gap: spacing.md,
  },
  signOutButton: {
    marginTop: 0,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    minWidth: 96,
    height: 36,
  },
  signOutText: {
    color: colors.primaryForeground,
    fontSize: fontSize.sm,
    fontWeight: "700",
  },
  logoText: {
    color: colors.secondary,
    fontSize: fontSize.xxl + 10,
    fontWeight: "800",
    lineHeight: fontSize.xxl + 16,
  },
  logoHighlight: {
    color: colors.primary,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: spacing.xs,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    backgroundColor: colors.card,
    color: colors.text,
    fontSize: fontSize.md,
    paddingHorizontal: spacing.md,
  },
});
