import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import "./styles/index.css";

const client = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
   <React.StrictMode>
      <QueryClientProvider client={client}>
         <RouterProvider router={router} />
      </QueryClientProvider>
   </React.StrictMode>
);
