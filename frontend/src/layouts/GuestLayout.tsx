import { Outlet } from "react-router-dom";
import { Header } from "@/components/global";

export function GuestLayout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
