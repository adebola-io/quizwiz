import { Outlet } from "react-router-dom";
import { useAuth } from "@/hooks";
import { Header, Sidebar } from "@/components/global";

export function ProtectedLayout() {
  const { user } = useAuth();
  console.log({ user });
  return (
    <>
      <Header loggedIn username={user?.username!} />
      <Sidebar />
      <Outlet />
    </>
  );
}
