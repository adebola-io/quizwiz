import jwtDecode from "jwt-decode";
import axios from "@/api";

const isValidToken = (accessToken: string) => {
  if (!accessToken) {
    return false;
  }

  const decoded: any = jwtDecode(accessToken);
  console.log(decoded);
  const currentTime = Date.now() / 1000;

  return decoded.exp > currentTime;
};

const handleTokenExpired = (exp: number) => {
  let expiredTimer;

  window.clearTimeout(expiredTimer);
  const currentTime = Date.now();
  const timeLeft = exp * 1000 - currentTime;
  console.log(timeLeft);
  expiredTimer = window.setTimeout(() => {
    console.log("expired");
    // You can do what ever you want here, like show a notification
  }, timeLeft);
};

const setSession = (accessToken: string | null) => {
  if (accessToken) {
    localStorage.setItem("accessToken", accessToken);
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    // This function below will handle when token is expired
    const { exp }: any = jwtDecode(accessToken);
    handleTokenExpired(exp);
  } else {
    localStorage.removeItem("accessToken");
    delete axios.defaults.headers.common.Authorization;
  }
};

export { isValidToken, setSession };
