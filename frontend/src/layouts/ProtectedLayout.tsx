import { Outlet } from "react-router-dom";
import { useAuth } from "@/hooks";
import { Header, Sidebar } from "@/components/global";
import { User } from "@/types";

export function ProtectedLayout() {
   const { user } = useAuth();
   console.log({ user });
   return (
      <>
         <Header loggedIn username={(user as User).username} />
         <Sidebar />
         <Outlet />
      </>
   );
}
