import api from "@/services/api";
import { AuthContextData, AuthProviderProps, User, UserAuth } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function loadData() {
      await loadStoredData();
    }
    loadData();
  }, []);

  async function loadStoredData() {
    try {
      setLoading(true);
      const storedToken = await AsyncStorage.getItem("@token:pizzaria");
      const storedUser = await AsyncStorage.getItem("@user:pizzaria");

      if (storedToken && storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const response = await api.post<UserAuth>("/session", {
        email,
        password,
      });

      const { token, ...userdata } = response.data;

      await AsyncStorage.setItem("@token:pizzaria", token);
      await AsyncStorage.setItem("@user:pizzaria", JSON.stringify(userdata));

      setUser(userdata);
    } catch (error) {
      console.log(error);
      throw new Error("Não foi possivel fazer o login");
    }
  }

  async function signOut() {
    await AsyncStorage.multiRemove(["@token:pizzaria", "@user:pizzaria"]);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        loading,
        user,
        signOut,
        signIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) throw new Error("Contexto não foi encontrado");
  return context;
}
