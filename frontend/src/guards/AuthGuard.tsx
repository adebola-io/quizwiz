import { ReactNode, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks";
import { Loader } from "@/components/ui";
import LoginOrSignUpPage from "@/pages/LoginOrSignUpPage";
import VerifyEmailPage from "@/pages/VerifyEmailPage";

interface AuthGuardProps {
   children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
   const { isAuthenticated, isVerified, isInitialized } = useAuth();
   const { pathname } = useLocation();
   const [requestedLocation, setRequestedLocation] = useState<string | null>(
      null
   );

   if (!isInitialized) {
      return (
         <div className="w-full h-[calc(100vh-var(--header-height))] flex items-center justify-center">
            <Loader />
         </div>
      );
   }

   if (!isAuthenticated) {
      if (pathname !== requestedLocation) {
         setRequestedLocation(pathname);
      }
      return <LoginOrSignUpPage />;
   }

   if (isAuthenticated && !isVerified) {
      if (pathname !== requestedLocation) {
         setRequestedLocation(pathname);
      }
      return <VerifyEmailPage />;
   }

   if (requestedLocation && pathname !== requestedLocation) {
      setRequestedLocation(null);
      return <Navigate to={requestedLocation} />;
   }

   return <>{children}</>;
}
