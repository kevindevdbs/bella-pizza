export interface User{
    id: string,
    name: string,
    email: string,
    role: "ADMIN" | "STAFF",
    createdAt: string
}

export interface Session {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "STAFF";
  token: string
}