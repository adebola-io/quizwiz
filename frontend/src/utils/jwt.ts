import jwtDecode from "jwt-decode";
import axios from "@/api";

const isValidToken = (accessToken: string) => {
   if (!accessToken) {
      return false;
   }
   const decoded: { exp: number } = jwtDecode(accessToken);
   console.log(decoded);
   const currentTime = Date.now() / 1000;

   return decoded.exp > currentTime;
};

const setSession = (accessToken: string | null) => {
   if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
      axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
   } else {
      localStorage.removeItem("accessToken");
      delete axios.defaults.headers.common.Authorization;
   }
};

export { isValidToken, setSession };
