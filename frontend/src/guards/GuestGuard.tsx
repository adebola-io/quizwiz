import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks";
import { ReactNode } from "react";

interface GuestGuardProps {
   children: ReactNode;
}

export function GuestGuard({ children }: GuestGuardProps) {
   const { isAuthenticated } = useAuth();

   if (isAuthenticated) {
      return <Navigate to="/dashboard/home" />;
   }

   return <>{children}</>;
}
