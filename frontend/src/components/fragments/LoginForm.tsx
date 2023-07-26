import { useLogin, useNotification } from "@/hooks";
import { Button, Input, Loader } from "@/components/ui";
import { useState } from "react";
import { FormObject, LoginParams } from "@/types";
import { useNavigate } from "react-router-dom";
import { loginUser } from "@/services";

export function LoginForm() {
   const validator = useLogin();
   const [isLoading, setIsLoading] = useState(false);
   const navigate = useNavigate();
   const notifyUser = useNotification();

   validator.next = (e) => {
      setIsLoading(true);
      const { usernameOrEmail, password } = e.target as unknown as FormObject;
      // TODO: Perform more thorough check.
      const payload: LoginParams = usernameOrEmail.value.includes("@")
         ? {
              email: usernameOrEmail.value,
              password: password.value,
           }
         : { username: usernameOrEmail.value, password: password.value };
      loginUser(payload)
         .then(() => navigate("/home"))
         .catch((err) => {
            notifyUser(err.message, "error", 2000);
         })
         .finally(() => setIsLoading(false));
   };

   return (
      <form
         onSubmit={validator.submitter}
         className="w-full pr-[--global-padding-left]"
      >
         <h1 className="animate-fade-in-from-right effect-item-0 text-green-feldgrau uppercase font-bold font-avenir-next-lt-pro-bold text-[4.6875rem]">
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
                  marginBottom: "1.36rem",
               }}
               className="hover:brightness-90 animate-fade-in-from-right effect-item-3"
            >
               {isLoading ? (
                  <Loader
                     className="animate-pop"
                     style={{
                        animationDuration: "300ms",
                     }}
                     size={40}
                     variant="outlined"
                     color="white"
                     shadow={false}
                  />
               ) : (
                  "Log In"
               )}
            </Button>
         </div>
         <div className="text-green-charcoal animate-fade-in-from-left effect-item-2 font-bold w-full text-right underline text-[1rem] [line-height:4.375rem]">
            Forgot Password?
         </div>
      </form>
   );
}
