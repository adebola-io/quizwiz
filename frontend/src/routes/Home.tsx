import { Header } from "@/components/global";
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
         <Header />
         <main className="page-with-header">Hello World!</main>
      </>
   );
}
