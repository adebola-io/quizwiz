import toast from "react-hot-toast";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { ENDPOINT_ROOT } from "@/constants";
import { QueryClient } from "@tanstack/react-query";

const axiosInstance: AxiosInstance = axios.create({
   baseURL: ENDPOINT_ROOT
});

axiosInstance.interceptors.request.use((config) => {
   const token = localStorage.getItem("accessToken");
   if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
      config.headers["Content-Type"] = "application/json";
   }
   return config;
});

interface RetryConfig extends AxiosRequestConfig {
   retry: number;
   retryDelay: number;
}

export const globalConfig: RetryConfig = {
   retry: 5,
   retryDelay: 1000
};

axiosInstance.interceptors.response.use(
   async (response) => {
      return response;
   },
   function (error) {
      const { config } = error;

      if (error.code === "ERR_NETWORK") {
         toast.error(error.message);
      } else if (error.response.status === 401) {
         toast.error(error.response.data.message);
         localStorage.removeItem("accessToken");
      } else if (!config || !config.retry) {
         return Promise.reject(error);
      } else {
         config.retry -= 1;
         const delayRetryRequest = new Promise<void>((resolve) => {
            setTimeout(() => {
               if (config.retry === 0) {
                  toast.error(
                     error.response.data.message ??
                        "Failed to log request due to an error on our end"
                  );
               }
               resolve();
            }, config.retryDelay || 1000);
         });
         return delayRetryRequest.then(() => axiosInstance(config));
      }
   }
);

export const queryClient = new QueryClient();
export default axiosInstance;
