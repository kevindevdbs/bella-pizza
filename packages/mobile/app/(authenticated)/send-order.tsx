import { AppButton } from "@/components/app-button";
import { AppInput } from "@/components/app-input";
import { borderRadius, colors, fontSize, spacing } from "@/constants/theme";
import api from "@/services/api";
import { OrderRouteParams, SendOrderPayload, SendOrderResponse } from "@/types";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function SendOrder() {
  const router = useRouter();
  const params = useLocalSearchParams<OrderRouteParams>();

  const orderId = params.order_id;
  const tableFromParams = params.table;

  const [customerName, setCustomerName] = useState("");
  const [sendingOrder, setSendingOrder] = useState(false);

  useEffect(() => {
    if (!orderId) {
      Alert.alert("Erro", "Pedido não encontrado.", [
        {
          text: "Voltar",
          onPress: () => router.replace("/(authenticated)/dashboard"),
        },
      ]);
    }
  }, [orderId, router]);

  function handleGoBack() {
    if (!orderId) {
      router.replace("/(authenticated)/dashboard");
      return;
    }

    router.replace({
      pathname: "/(authenticated)/order",
      params: {
        order_id: orderId,
        table: tableFromParams ?? "",
      },
    });
  }

  async function handleSendOrder() {
    if (!orderId || sendingOrder) return;

    try {
      setSendingOrder(true);

      const payload: SendOrderPayload = {
        order_id: orderId,
      };

      const trimmedName = customerName.trim();
      if (trimmedName) {
        payload.name = trimmedName;
      } else {
        payload.name = "Cliente";
      }

      await api.put<SendOrderResponse>("/order/send", payload);
      Alert.alert("Pedido enviado", "O pedido foi enviado para a cozinha.", [
        {
          text: "OK",
          onPress: () => router.replace("/(authenticated)/dashboard"),
        },
      ]);
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível finalizar o pedido.");
    } finally {
      setSendingOrder(false);
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
            <Pressable style={styles.backButton} onPress={handleGoBack}>
              <Feather name="arrow-left" size={20} color={colors.text} />
            </Pressable>

            <Text style={styles.topTitle}>Finalizando</Text>
          </View>

          <View style={styles.content}>
            <Text style={styles.subtitle}>Você deseja finalizar o pedido?</Text>
            <Text style={styles.tableTitle}>
              Mesa {tableFromParams ?? "--"}
            </Text>

            <AppInput
              label="Nome do cliente (opcional)"
              placeholder="Nome do cliente..."
              value={customerName}
              onChangeText={setCustomerName}
              containerStyle={styles.inputContainer}
            />

            <AppButton
              title="Finalizar pedido"
              loading={sendingOrder}
              onPress={handleSendOrder}
              buttonStyle={styles.submitButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xxl,
    gap: spacing.sm,
  },
  backButton: {
    width: 30,
    height: 30,
    borderRadius: borderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  topTitle: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  subtitle: {
    color: colors.text,
    fontSize: fontSize.lg,
    textAlign: "center",
    marginBottom: spacing.md,
  },
  tableTitle: {
    color: colors.text,
    fontSize: fontSize.xxl,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  submitButton: {
    backgroundColor: colors.secondary,
  },
});
