import { LandingPage } from "@/routes";
import { getAuthService } from "@/services";
import { Navigate } from "react-router-dom";

/**
 * Entry to Quiz App.
 */
function App() {
   return <Portal />;
}

function Portal() {
   const authService = getAuthService();
   if (authService.status.isAuthenticated) {
      return <Navigate to="/home" />;
   }
   return <LandingPage />;
}

export default App;
