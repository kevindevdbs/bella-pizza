import type { ReactNode } from "react";
import type {
  PressableProps,
  TextInputProps,
  TextStyle,
  ViewStyle,
} from "react-native";

export interface User {
  id: string;
  name: string;
  email: string;
  role?: "ADMIN" | "STAFF";
}

export interface UserAuth extends User {
  token: string;
}

export interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  disabled: boolean;
  categoryId: string;
  createdAt: string;
}

export interface Items {
  id: string;
  amount: number;
  note?: string | null;
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    description: string;
  };
}

export interface Order {
  id: string;
  name?: string;
  draft: boolean;
  table: number;
  status: boolean;
  createdAt: string;
  items?: Items[];
}

export interface AuthProviderProps {
  children: ReactNode;
}

export interface AuthContextData {
  signed: boolean;
  loading: boolean;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export type AppButtonProps = PressableProps & {
  title: string;
  variant?: "primary" | "secondary";
  loading?: boolean;
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
};

export type AppInputProps = TextInputProps & {
  label: string;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  inputStyle?: TextStyle;
};

export type SelectOption = {
  label: string;
  value: string;
};

export type AppSelectProps = {
  value?: string;
  options: SelectOption[];
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  containerStyle?: ViewStyle;
  triggerStyle?: ViewStyle;
  valueTextStyle?: TextStyle;
};

export type AppOrderItemProps = {
  name: string;
  quantity: number;
  price: number;
  note?: string | null;
  onEditNote?: () => void;
  onRemove: () => void;
  removing?: boolean;
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  removeButtonProps?: Omit<PressableProps, "onPress">;
};

export type DetailOrderResponse = {
  id: string;
  name?: string;
  table: number;
  draft: boolean;
  status: boolean;
  items: Items[];
};

export type CategoryProductsResponse = {
  result?: Product[];
};

export type CreateOrderResponse = {
  order?: Order;
};

export type OrderRouteParams = {
  order_id?: string;
  table?: string;
  mode?: "draft" | "sent";
};

export type ActiveOrderByTableResponse = {
  order?: Order;
};

export type SendOrderPayload = {
  order_id: string;
  name?: string;
};

export type SendOrderResponse = Order;
