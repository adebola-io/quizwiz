import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import App from "./App";
import "./styles/index.css";

const client = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
   <AuthProvider>
      <QueryClientProvider client={client}>
         <BrowserRouter>
            <App />
         </BrowserRouter>
      </QueryClientProvider>
   </AuthProvider>
);
