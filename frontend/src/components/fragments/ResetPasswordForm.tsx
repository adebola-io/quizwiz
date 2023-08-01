import { useLocation } from "react-router-dom";
import { useFormValidator } from "@/hooks";
import { useResetPasswordMutation } from "@/api/user";
import { Button, Input } from "@/components/ui";
import { FormObject, UserCreationParams } from "@/types";
import { showPasswordBriefly } from "@/utils/form";

interface ResetPasswordErrorObject {
   password?: string;
   confirmPassword?: string;
}

export function ResetPasswordForm() {
   const { pathname } = useLocation();
   const token = pathname.split("/")[3];
   const { mutate: forgotPassword, isLoading } = useResetPasswordMutation();

   const validator = useFormValidator(function (event) {
      event.preventDefault();
      const errors: ResetPasswordErrorObject = {};
      const { password, confirmPassword } =
         event.target as unknown as FormObject;
      password.type = "password";

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
      const { password, confirmPassword } = e.target as unknown as FormObject;
      const payload: Pick<UserCreationParams, "password" | "confirmPassword"> =
         {
            password: password.value,
            confirmPassword: confirmPassword.value
         };

      forgotPassword({ token, payload });
   };

   return (
      <form onSubmit={validator.submitter} className="mx-auto w-full px-4">
         <h1 className="animate-fade-in-from-right effect-item-0 text-green-feldgrau leading-tight font-bold font-avenir-next-lt-pro-bold text-[3rem] mb-5">
            Enter a new <br /> password.{" "}
         </h1>
         <div className="flex flex-col w-full">
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
               className="hover:brightness-90 animate-fade-in-from-right effect-item-3"
               isLoading={isLoading}
            >
               Reset Password
            </Button>
         </div>
      </form>
   );
}
