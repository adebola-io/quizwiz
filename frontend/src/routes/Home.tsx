import { Header, Sidebar } from "@/components/global";
import { Button, Loader } from "@/components/ui";
import { getAuthService, getUserStats } from "@/services";
import { useQuery } from "@tanstack/react-query";
import { Navigate } from "react-router-dom";

/**
 * @protected
 * User homepage.
 */
export function Home() {
   const statsQuery = useQuery({
      queryKey: ["stats"],
      queryFn: getUserStats,
   });
   const authService = getAuthService();
   if (!authService.status.isAuthenticated) {
      return <Navigate to="/" />;
   }
   return (
      <>
         <Header loggedIn username={authService.status.username} />
         <Sidebar />
         <main className="page_with_header pl-[--sidebar-width]">
            {statsQuery.isLoading ? (
               <div className="w-full h-[calc(100vh-var(--header-height))] flex items-center justify-center">
                  <Loader />
               </div>
            ) : (
               <div className="w-full flex-col gap-6 h-[calc(100vh-var(--header-height))] font-poppins opacity-70 flex items-center justify-center">
                  <span>Something went wrong. Please try loading again</span>
                  <Button
                     variant="outlined"
                     onClick={() => statsQuery.refetch()}
                  >
                     Retry
                  </Button>
               </div>
            )}
         </main>
      </>
   );
}
