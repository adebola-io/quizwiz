import { Suspense, lazy } from "react";
import { useRoutes, useLocation, Navigate } from "react-router-dom";
import { AuthGuard, GuestGuard } from "@/guards";
import { Loader } from "@/components/ui";
import { GuestLayout, ProtectedLayout } from "@/layouts";

const Loadable = (Component: any) => (props: any) => {
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
          ),
        },
        {
          path: "sign-up",
          element: (
            <GuestGuard>
              <LoginOrSignUpPage />
            </GuestGuard>
          ),
        },
      ],
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
        { element: <Navigate to="/dashboard/home" replace />, index: true },
        { path: "home", element: <Home /> },
      ],
    },

    {
      path: "/",
      element: (
        <GuestGuard>
          <GuestLayout />
        </GuestGuard>
      ),
      children: [{ element: <LandingPage />, index: true }],
    },
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);
}

// Guest
const LandingPage = Loadable(lazy(() => import("../pages/LandingPage")));

// Auth
const LoginOrSignUpPage = Loadable(
  lazy(() => import("../pages/LoginOrSignUpPage"))
);

// Protected
const Home = Loadable(lazy(() => import("../pages/Home")));
