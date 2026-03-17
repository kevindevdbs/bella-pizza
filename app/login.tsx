import { AppButton } from "@/components/app-button";
import { AppInput } from "@/components/app-input";
import { colors, fontSize, spacing } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signed } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (signed) {
      router.replace("/(authenticated)/dashboard");
    }
  }, [signed, router]);

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Atenção", "Preencha todos os campos");
      return;
    }

    try {
      setLoading(true);
      await signIn(email, password);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Erro ao fazer login");
    } finally {
      setLoading(false);
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
          <View style={styles.header}>
            <Text style={styles.logoText}>
              Bella<Text style={styles.logoHighlight}>Pizza</Text>
            </Text>
          </View>

          <View style={styles.form}>
            <AppInput
              label="Digite seu email"
              placeholder="Seu email completo..."
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />

            <AppInput
              label="Digite sua senha"
              placeholder="Sua senha..."
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
            />

            <AppButton
              title="Acessar"
              loading={loading}
              onPress={handleLogin}
            />
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
    flexGrow: 1,
    justifyContent: "center",
  },
  header: {
    marginBottom: spacing.xxl,
    alignItems: "center",
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
  form: {
    gap: spacing.md,
  },
});
