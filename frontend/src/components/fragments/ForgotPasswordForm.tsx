import { Link } from "react-router-dom";
import { useFormValidator } from "@/hooks";
import { useForgotPasswordMutation } from "@/api/user";
import { Button, Input } from "@/components/ui";
import { FormObject, UserCreationParams } from "@/types";

interface ForgotPasswordErrorObject {
   email?: string;
}

export function ForgotPasswordForm() {
   const { mutate: forgotPassword, isLoading } = useForgotPasswordMutation();

   const validator = useFormValidator(function (event) {
      event.preventDefault();
      const { email } = event.target as unknown as FormObject;
      const errors: ForgotPasswordErrorObject = {};

      if (email.value.length === 0) {
         errors.email = "Email required.";
      } else if (!email.checkValidity()) {
         errors.email = "Enter a valid email.";
      }

      return errors;
   });

   validator.onValidate = (e) => {
      const { email } = e.target as unknown as FormObject;
      const payload: Pick<UserCreationParams, "email"> = {
         email: email.value
      };

      forgotPassword(payload);
   };

   return (
      <form onSubmit={validator.submitter} className="mx-auto w-full">
         <h1 className="animate-fade-in-from-right effect-item-0 text-green-feldgrau leading-tight font-bold font-avenir-next-lt-pro-bold text-[3rem] mb-5">
            Enter the email used <br /> to verify your <br /> account.
         </h1>
         <div className="flex flex-col w-full">
            <Input
               error={validator.errors.email}
               id="email"
               containerClassName="animate-fade-in-from-right effect-item-1"
               className="w-full"
               type="email"
               placeholder="Email"
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
               Continue
            </Button>
         </div>
         <Link
            to="/auth/login"
            className="flex justify-end text-green-charcoal animate-fade-in-from-left effect-item-2 font-bold w-full text-right underline text-[1rem]"
         >
            Back to Login
         </Link>
      </form>
   );
}
