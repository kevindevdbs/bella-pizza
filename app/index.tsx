import { colors } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { Redirect } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function Index() {
  const { signed, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.secondary} />
      </View>
    );
  }

  return signed ? (
    <Redirect href="/(authenticated)/dashboard" />
  ) : (
    <Redirect href="/login" />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
});
