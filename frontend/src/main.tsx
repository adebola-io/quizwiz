import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { ModalProvider } from "@/stores";
import App from "./App";
import "./styles/index.css";
import { queryClient } from "./api";

ReactDOM.createRoot(document.getElementById("root")!).render(
   <QueryClientProvider client={queryClient}>
      <AuthProvider>
         <BrowserRouter>
            <ModalProvider>
               <App />
            </ModalProvider>
         </BrowserRouter>
      </AuthProvider>
   </QueryClientProvider>
);
