import { Button, Input } from "../ui";

export function LoginForm() {
   return (
      <form className="w-full pr-[--global-padding-left]">
         <h1 className="animate-fade-in-from-right effect-item-0 text-green-feldgrau uppercase font-bold font-avenir-next-lt-pro-bold text-[4.6875rem]">
            Sign In to Use App.
         </h1>
         <div className="flex flex-col w-full">
            <Input
               id="usernameOrEmail"
               containerClassName="animate-fade-in-from-right effect-item-1"
               className="w-full"
               type="email"
               placeholder="Username or Email"
            />
            <Input
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
               Log In
            </Button>
         </div>
         <div className="text-green-charcoal animate-fade-in-from-left effect-item-2 font-bold w-full text-right underline text-[1rem] [line-height:4.375rem]">
            Forgot Password?
         </div>
      </form>
   );
}
