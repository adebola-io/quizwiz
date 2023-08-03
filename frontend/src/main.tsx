import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { ModalProvider } from "@/stores";
import App from "./App";
import "./styles/index.css";

const client = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
   <QueryClientProvider client={client}>
      <AuthProvider>
         <BrowserRouter>
            <ModalProvider>
               <App />
            </ModalProvider>
         </BrowserRouter>
      </AuthProvider>
   </QueryClientProvider>
);
