import { FormEvent, useState } from "react";
import { Button, Input } from "../ui";

interface ErrorObject {
   username?: string;
   email?: string;
   password?: string;
}

export function SignUpForm() {
   const [errors, setErrors] = useState<ErrorObject>({});
   function handleSubmit(event: FormEvent) {
      setErrors({});
      const newErrorObject: ErrorObject = {};
      event.preventDefault();
      const { username, email, password } = event.target as unknown as {
         [key in "username" | "email" | "password"]: HTMLInputElement;
      };
      if (username.value.length === 0) {
         newErrorObject.username = "Username required.";
      }
      if (email.value.length === 0) {
         newErrorObject.email = "Email required.";
      }
      if (password.value.length === 0) {
         newErrorObject.password = "Password required.";
      }
      setErrors(newErrorObject);
   }
   return (
      <form
         onSubmit={handleSubmit}
         className="w-full pr-[--global-padding-left]"
      >
         <h1 className="animate-fade-in-from-right text-green-feldgrau uppercase font-bold font-avenir-next-lt-pro text-[4.6875rem]">
            Create Account to Get Started.
         </h1>
         <div className="flex flex-col w-full">
            <Input
               error={errors.username}
               id="username"
               containerClassName="animate-fade-in-from-right effect-item-1"
               className="w-full"
               type="text"
               placeholder="Username"
            />
            <Input
               error={errors.email}
               id="email"
               containerClassName="animate-fade-in-from-right effect-item-2"
               className="w-full"
               type="email"
               placeholder="Email"
            />
            <Input
               error={errors.password}
               containerClassName="animate-fade-in-from-right effect-item-3"
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
               className="hover:brightness-90 animate-fade-in-from-right effect-item-4"
            >
               Create Account
            </Button>
         </div>
      </form>
   );
}
