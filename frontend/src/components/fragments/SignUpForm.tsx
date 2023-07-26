import { useSignUp } from "@/hooks";
import { Button, Input, Loader } from "@/components/ui";

export function SignUpForm() {
   const { submitter, errors, isLoading } = useSignUp();

   return (
      <form onSubmit={submitter} className="w-full pr-[--global-padding-left]">
         <h1 className="animate-fade-in-from-right text-green-feldgrau uppercase font-bold font-avenir-next-lt-pro-bold text-[3.6875rem]">
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
            <Input
               error={errors.confirmPassword}
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
                  marginBottom: "1.36rem",
               }}
               className="hover:brightness-90 animate-fade-in-from-right effect-item-4"
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
                  "Create Account"
               )}
            </Button>
         </div>
      </form>
   );
}
