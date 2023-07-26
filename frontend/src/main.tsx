import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { AuthService } from "@/services";
import "./styles/index.css";

const client = new QueryClient();
const authService = new AuthService();

authService.setup().then(() => {
   ReactDOM.createRoot(document.getElementById("root")!).render(
      <React.StrictMode>
         <QueryClientProvider client={client}>
            <RouterProvider router={router} />
         </QueryClientProvider>
      </React.StrictMode>
   );
});
