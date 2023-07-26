import { Header, Sidebar } from "@/components/global";
import { Loader } from "@/components/ui";
import { getAuthService } from "@/services";
import { Navigate } from "react-router-dom";

/**
 * @protected
 * User homepage.
 */
export function Home() {
   const authService = getAuthService();
   if (!authService.status.isAuthenticated) {
      return <Navigate to="/" />;
   }
   return (
      <>
         <Header loggedIn username={authService.status.username} />
         <Sidebar />
         <main className="page_with_header pl-[--sidebar-width]">
            <div className="w-full h-[calc(100vh-var(--header-height))] flex items-center justify-center">
               <Loader />
            </div>
         </main>
      </>
   );
}
