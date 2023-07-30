import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useCountdown } from "usehooks-ts";
import { useAuth } from "@/hooks";
import { useResendEmailMutation, useVerifyEmailMutation } from "@/api/user";
import { Button, Loader } from "@/components/ui";

/**
 * Page for user to verify and check email verification process.
 */
export default function VerifyEmailPage() {
   const { pathname } = useLocation();
   const token = pathname.split("/")[3];
   const { user } = useAuth();
   const [count, { startCountdown, resetCountdown }] = useCountdown({
      countStart: 5,
      intervalMs: 1000
   });
   const { mutate: resend, isLoading, isSuccess } = useResendEmailMutation();
   const { mutate: verify } = useVerifyEmailMutation();

   function handleResendEmail() {
      resend({ email: user?.email as string });
   }

   useEffect(() => {
      if (!token) {
         startCountdown();

         if (isSuccess) {
            resetCountdown();
            startCountdown();
         }
      } else {
         verify(token);
      }
   }, [token, isSuccess]);

   return (
      <div className="flex w-screen items-center justify-center lines h-screen px-[--global-padding-left]">
         {!token ? (
            <div className="flex flex-col justify-center items-center w-full h-full max-w-3xl gap-6">
               <p className="w-full text-[2.8rem] font-avenir-next-lt-pro-bold text-green-feldgrau [line-height:3rem] text-center">
                  A verification link has been sent to your email.{" "}
               </p>
               <Button
                  size="normal"
                  variant="override"
                  className="max-w-xl w-full font-poppins font-bold hover:shadow-[-0_0_0_0]"
                  loaderColor="#2f3e46"
                  isLoading={isLoading}
                  disabled={count > 0}
                  onClick={handleResendEmail}
               >
                  Resend Email {count > 0 ? `(${count}s)` : null}
               </Button>
            </div>
         ) : (
            <div className="flex flex-col items-center gap-4">
               <Loader />
               <p className="text-green-feldgrau font-poppins text-base">
                  Verifying...
               </p>
            </div>
         )}
      </div>
   );
}
