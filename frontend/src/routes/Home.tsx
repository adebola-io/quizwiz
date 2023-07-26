import { Header, Sidebar } from "@/components/global";
import { Loader } from "@/components/ui";
import { getAuthService, getUserStats } from "@/services";
import { useQuery } from "@tanstack/react-query";
import { Navigate } from "react-router-dom";

/**
 * @protected
 * User homepage.
 */
export function Home() {
   const { isLoading, isError, data } = useQuery({
      queryKey: ["userStats"],
      queryFn: getUserStats,
   });
   const authService = getAuthService();
   if (!authService.status.isAuthenticated) {
      return <Navigate to="/" />;
   }
   return (
      <>
         <Header loggedIn username={authService.status.username} />
         <main className="page-with-header pl-[--sidebar-width]">
            <Sidebar />
            {isLoading ? (
               <div className="w-full h-full flex items-center justify-center">
                  <Loader />
               </div>
            ) : (
               <>
                  <div className="flex justify-between"></div>
               </>
            )}
         </main>
      </>
   );
}
