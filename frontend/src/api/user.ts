import {
   ApiResponse,
   RankedUsersResponse,
   RequestError,
   UserCreationParams
} from "@/types";
import axios from ".";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

/**
 * communicates with resend email service.
 * @route "/user/verify_email"
 * @param payload
 */

const _resendEmailRequest = async (
   payload: Pick<UserCreationParams, "email">
): Promise<ApiResponse<null>> => {
   const { data } = await axios.post("/user/resend_email", payload);
   return data;
};
/**
 * mutation wrapper hook for request
 * @returns
 */

export const useResendEmailMutation = () => {
   const resendEmailMutation = useMutation(_resendEmailRequest, {
      onSuccess: (data) => {
         toast.success(data.message);
      },
      onError: (error: RequestError) => {
         toast.error(error.response?.data?.message);
      }
   });

   return resendEmailMutation;
};

/**
 * communicates with verify email service.
 * @route "/user/verify_email"
 * @param token
 * @returns {ApiResponse}
 */

const _verifyEmailRequest = async (
   token: string
): Promise<ApiResponse<null>> => {
   const { data } = await axios.patch(`/user/verify_email/${token}`);
   return data;
};

/**
 * mutation wrapper hook for request
 * @returns
 */

export const useVerifyEmailMutation = () => {
   const verifyEmailMutation = useMutation(_verifyEmailRequest, {
      onSuccess: (data) => {
         toast.success(data.message);
         setTimeout(() => {
            window.location.pathname = "/dashboard/home";
         }, 2000);
      },
      onError: (error: RequestError) => {
         toast.error(error.response?.data?.message);
      }
   });

   return verifyEmailMutation;
};

/**
 * communicates with forgot password service.
 * @route "/user/forgot_password"
 * @param payload
 */

const _forgotPasswordRequest = async (
   payload: Pick<UserCreationParams, "email">
): Promise<ApiResponse<null>> => {
   const { data } = await axios.post("/user/forgot_password", payload);
   return data;
};
/**
 * mutation wrapper hook for request
 * @returns
 */

export const useForgotPasswordMutation = () => {
   const forgotPasswordlMutation = useMutation(_forgotPasswordRequest, {
      onSuccess: (data) => {
         toast.success(data.message);
      },
      onError: (error: RequestError) => {
         toast.error(error.response?.data?.message);
      }
   });

   return forgotPasswordlMutation;
};

/**
 * communicates with forgot password service.
 * @route "/user/forgot_password"
 * @param payload
 */

const _resetPasswordRequest = async (
   token: string,
   payload?: Pick<UserCreationParams, "password" | "confirmPassword">
): Promise<ApiResponse<null>> => {
   const { data } = await axios.post(`/user/reset_password/${token}`, payload);
   return data;
};
/**
 * mutation wrapper hook for request
 * @returns
 */

export const useResetPasswordMutation = () => {
   const resetPasswordMutation = useMutation({
      mutationFn: ({
         token,
         payload
      }: {
         token: string;
         payload?: Pick<UserCreationParams, "password" | "confirmPassword">;
      }) => _resetPasswordRequest(token, payload),
      onSuccess: (data) => {
         toast.success(data.message);
         setTimeout(() => {
            window.location.pathname = "/auth/login";
         }, 2000);
      },
      onError: (error: RequestError) => {
         toast.error(error.response?.data?.message);
      }
   });

   return resetPasswordMutation;
};

/**
 * query hook for getting ranked users.
 */
export const useGetRankedUsersQuery = () => {
   const getRankedUsersQuery = useQuery({
      queryKey: ["ranked"],
      retry: false,
      queryFn: async (): Promise<RankedUsersResponse> => {
         const { data } = await axios.get("/users/ranked");
         return data;
      }
   });
   return getRankedUsersQuery;
};
