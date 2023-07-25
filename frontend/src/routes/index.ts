import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { LoginOrSignUpPage } from "./LoginOrSignUpPage";

export * from "./LandingPage";
export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
  },
  {
    path: "/login",
    Component: LoginOrSignUpPage,
  },
  {
    path: "/sign-up",
    Component: LoginOrSignUpPage,
  },
]);
