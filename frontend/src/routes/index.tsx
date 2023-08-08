import { Suspense, lazy } from "react";
import { useRoutes, useLocation, Navigate } from "react-router-dom";
import { AuthGuard, GuestGuard } from "@/guards";
import { Loader } from "@/components/ui";
import { GuestLayout, ProtectedLayout } from "@/layouts";

function Loadable<T extends JSX.IntrinsicAttributes>(Component: React.FC<T>) {
   return (props: T) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { pathname } = useLocation();

      return (
         <Suspense
            fallback={
               !pathname.includes("/dashboard") ? (
                  <div className="w-full h-[calc(100vh-var(--header-height))] flex items-center justify-center">
                     <Loader />
                  </div>
               ) : null
            }
         >
            <Component {...props} />
         </Suspense>
      );
   };
}

// Guest
const LandingPage = Loadable(lazy(() => import("../pages/LandingPage")));

// Auth
const LoginOrSignUpPage = Loadable(
   lazy(() => import("../pages/LoginOrSignUpPage"))
);
const VerifyEmailPage = Loadable(
   lazy(() => import("../pages/VerifyEmailPage"))
);
const ForgotPassword = Loadable(lazy(() => import("../pages/ForgotPassword")));
const ResetPassword = Loadable(lazy(() => import("../pages/ResetPassword")));

// Protected
const Home = Loadable(lazy(() => import("../pages/Home")));
const Leaderboard = Loadable(lazy(() => import("../pages/Leaderboard")));

export default function Router() {
   return useRoutes([
      {
         path: "auth",
         children: [
            {
               path: "login",
               element: (
                  <GuestGuard>
                     <LoginOrSignUpPage />
                  </GuestGuard>
               )
            },
            {
               path: "sign-up",
               element: (
                  <GuestGuard>
                     <LoginOrSignUpPage />
                  </GuestGuard>
               )
            },
            {
               path: "forgot-password",
               element: (
                  <GuestGuard>
                     <ForgotPassword />
                  </GuestGuard>
               )
            },
            {
               path: "reset-password/:token",
               element: (
                  <GuestGuard>
                     <ResetPassword />
                  </GuestGuard>
               )
            }
         ]
      },

      // Protected Routes
      {
         path: "dashboard",
         element: (
            <AuthGuard>
               <ProtectedLayout />
            </AuthGuard>
         ),
         children: [
            {
               element: <Navigate to="/dashboard/home" replace />,
               index: true
            },
            { path: "home", element: <Home /> },
            { path: "leaderboard", element: <Leaderboard /> },
            {
               path: "verify-email/:token",
               element: (
                  <GuestGuard>
                     <VerifyEmailPage />
                  </GuestGuard>
               )
            }
         ]
      },

      {
         path: "/",
         element: (
            <GuestGuard>
               <GuestLayout />
            </GuestGuard>
         ),
         children: [{ element: <LandingPage />, index: true }]
      },

      { path: "*", element: <Navigate to="/404" replace /> }
   ]);
}
