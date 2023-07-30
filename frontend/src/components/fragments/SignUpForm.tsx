import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth, useFormValidator } from "@/hooks";
import { Button, Input } from "@/components/ui";
import { FormObject } from "@/types";

interface SignUpErrorObject {
   username?: string;
   email?: string;
   password?: string;
   confirmPassword?: string;
}

export function SignUpForm() {
   const { signup } = useAuth();
   const [isLoading, setIsLoading] = useState(false);

   const navigate = useNavigate();

   const validator = useFormValidator(function (event) {
      event.preventDefault();
      const errors: SignUpErrorObject = {};
      const { username, email, password, confirmPassword } =
         event.target as unknown as FormObject;
      password.type = "password";

      // Usernames
      if (username.value.length === 0) {
         errors.username = "Username required.";
      } else if (/[0-9]/.test(username.value[0])) {
         errors.username = "Usernames cannot start with numbers.";
      } else if (!/^[a-z_][a-z_0-9]+$/.test(username.value)) {
         errors.username =
            "Usernames must be lowercase alphanumeric characters or underscores.";
      }
      // Emails
      if (email.value.length === 0) {
         errors.email = "Email required.";
      } else if (!email.checkValidity()) {
         errors.email = "Enter a valid email.";
      }

      /// Passwords
      if (password.value.length === 0) {
         errors.password = "Password required.";
      } else if (
         !(
            /[0-9]/.test(password.value) &&
            /[a-z]/.test(password.value) &&
            /[A-Z]/.test(password.value)
         )
      ) {
         errors.password =
            "Passwords should contain digits and letters (upper and lower case).";
         showPasswordBriefly(password);
      } else if (password.value.length < 7) {
         errors.password = "Try a longer password.";
         showPasswordBriefly(password);
      } else if (password.value !== confirmPassword.value) {
         errors.confirmPassword = "Passwords do not match!";
         showPasswordBriefly(password);
         showPasswordBriefly(confirmPassword);
      }

      return errors;
   });

   validator.onValidate = (e) => {
      const { username, email, password, confirmPassword } =
         e.target as unknown as FormObject;
      setIsLoading(true);
      signup({
         username: username.value,
         password: password.value,
         email: email.value,
         confirmPassword: confirmPassword.value
      })
         .then(() => {
            toast.success(
               "egistration successful, kindly check your email for next step"
            );
            navigate("/dashboard/home");
         })
         .catch((err) => toast.error(err.message))
         .finally(() => setIsLoading(false));
   };

   return (
      <form
         onSubmit={validator.submitter}
         className="w-full pr-[--global-padding-left]"
      >
         <h1 className="animate-fade-in-from-right text-green-feldgrau uppercase font-bold font-avenir-next-lt-pro-bold text-[3.6875rem]">
            Create Account to Get Started.
         </h1>
         <div className="flex flex-col w-full">
            <Input
               error={validator.errors.username}
               id="username"
               containerClassName="animate-fade-in-from-right effect-item-1"
               className="w-full"
               type="text"
               placeholder="Username"
            />
            <Input
               error={validator.errors.email}
               id="email"
               containerClassName="animate-fade-in-from-right effect-item-2"
               className="w-full"
               type="email"
               placeholder="Email"
            />
            <Input
               error={validator.errors.password}
               containerClassName="animate-fade-in-from-right effect-item-3"
               className="w-full"
               id="password"
               type="password"
               placeholder="Password"
            />
            <Input
               error={validator.errors.confirmPassword}
               containerClassName="animate-fade-in-from-right effect-item-4"
               className="w-full"
               id="confirmPassword"
               type="password"
               placeholder="Confirm Password"
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
               className="hover:brightness-90 animate-fade-in-from-right effect-item-4"
               isLoading={isLoading}
            >
               Create Account
            </Button>
         </div>
      </form>
   );
}

function showPasswordBriefly(password: HTMLInputElement) {
   password.type = "text";
   setTimeout(() => {
      password.type = "password";
   }, 3000);
}
