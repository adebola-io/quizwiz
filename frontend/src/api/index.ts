import toast from "react-hot-toast";
import axios, { AxiosInstance } from "axios";
import { ENDPOINT_ROOT, USER_TOKEN_IDENT } from "@/constants";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: ENDPOINT_ROOT,
});

axiosInstance.interceptors.request.use((config: any) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }
  return config;
});

axiosInstance.interceptors.response.use(
  async (response) => {
    return response;
  },
  function (error) {
    if (error.response.status === 401) {
      toast.error(error.response.data.message);
      return Promise.reject(new Error(error.response.data.message));
    } else if (error.response.status === 504) {
      return Promise.reject(new Error("Network timeout try again"));
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
