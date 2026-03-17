import { useAuth } from "@/contexts/AuthContext";
import { Redirect, Stack } from "expo-router";

export default function AutheticatedLayout() {
  const { loading, signed } = useAuth();

  if (loading) {
    return null;
  }

  if (!signed) {
    return <Redirect href="/login" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="order" />
      <Stack.Screen name="send-order" />
    </Stack>
  );
}
