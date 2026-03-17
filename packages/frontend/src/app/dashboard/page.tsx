import ContentOrder from "@/components/dashboard/order";
import { getToken } from "@/lib/auth";

export default async function Dashboard() {

  const token = await getToken() as string

  return (
    <ContentOrder  token= {token}/>
  );
}
