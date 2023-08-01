import { ApiResponse, RequestError, UserCreationParams } from "@/types";
import axios from ".";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

/**
 * communicate with resend email service.
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
 * communicate with verify email service.
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
