import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks";
import { LandingPage } from "@/routes";

/**
 * Entry to Quiz App.
 */
function App() {
   const authService = useAuth();
   if (authService.status.isAuthenticated) {
      return <Navigate to={"/home"} />;
   }
   return <LandingPage />;
}

export default App;
