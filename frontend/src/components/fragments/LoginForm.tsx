import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth, useFormValidator } from "@/hooks";
import { Button, Input } from "@/components/ui";
import { FormObject, LoginParams, RequestError } from "@/types";
import { AxiosError } from "axios";

interface LoginErrorObject {
   usernameOrEmail?: string;
   password?: string;
}

export function LoginForm() {
   const { login } = useAuth();
   const [isLoading, setIsLoading] = useState(false);
   const navigate = useNavigate();

   const validator = useFormValidator(function (event) {
      event.preventDefault();
      const { usernameOrEmail, password } =
         event.target as unknown as FormObject;
      const errors: LoginErrorObject = {};

      if (usernameOrEmail.value.length === 0) {
         errors.usernameOrEmail = "Please provide a username.";
      }
      if (password.value.length === 0) {
         errors.password = "Please provide a password.";
      }
      return errors;
   });

   validator.onValidate = (e) => {
      setIsLoading(true);
      const { usernameOrEmail, password } = e.target as unknown as FormObject;
      // TODO: Perform more thorough check.
      const payload: LoginParams = {
         username: usernameOrEmail.value,
         password: password.value
      };

      login(payload)
         .then(() => navigate("/dashboard/home"))
         .catch(
            (
               err: AxiosError<RequestError["response"]["data"]> | RequestError
            ) => {
               if (err.response === undefined && err instanceof AxiosError) {
                  toast.error(err?.message);
               } else {
                  toast.error(
                     err?.response?.data.message ?? "Something went wrong"
                  );
               }
            }
         )
         .finally(() => setIsLoading(false));
   };

   return (
      <form
         onSubmit={validator.submitter}
         className="w-full lg:pr-[--global-padding-left]"
      >
         <h1 className="animate-fade-in-from-right effect-item-0 text-green-feldgrau uppercase font-bold font-avenir-next-lt-pro-bold text-xl 2xl:text-[4.6875rem] mb-5">
            Sign In to Use App.
         </h1>
         <div className="flex flex-col w-full">
            <Input
               error={validator.errors.usernameOrEmail}
               id="usernameOrEmail"
               containerClassName="animate-fade-in-from-right effect-item-1"
               className="w-full"
               type="text"
               placeholder="Username or Email"
            />
            <Input
               error={validator.errors.password}
               containerClassName="animate-fade-in-from-right effect-item-2"
               className="w-full"
               id="password"
               type="password"
               placeholder="Password"
            />
            <Button
               type="submit"
               variant="override"
               style={{
                  boxShadow: "none",
                  color: "var(--white)",
                  backgroundColor: "var(--green-feldgrau)",
                  borderWidth: "4px",
                  height: "4.125rem",
                  marginBottom: "1.36rem"
               }}
               className="hover:brightness-90 animate-fade-in-from-right effect-item-3"
               isLoading={isLoading}
            >
               Log In
            </Button>
         </div>
         <div className="text-green-charcoal animate-fade-in-from-left effect-item-2 font-bold w-full text-right underline text-[1rem] [line-height:4.375rem]">
            Forgot Password?
         </div>
      </form>
   );
}
