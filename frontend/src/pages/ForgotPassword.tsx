import { Input, Button } from "@/components/ui";
import SignInBackground from "@/assets/signin-background.png";

export default function ForgotPassword() {
   return (
      <main className="lines h-fit flex flex-col-reverse md:flex-row md:h-screen items-center">
         <section className="flex items-center h-full md:w-[48%] w-full">
            <img
               src={SignInBackground}
               alt="background"
               className="w-full h-[500px] object-cover rounded-[0.625rem] md:w-[80%] md:mx-auto md:h-[85%] shadow-components/shadow border-[6px] border-green-charcoal"
            />
         </section>

         <section className="h-full flex items-center justify-end md:w-[48%] w-[100%] md:pt-0 pt-8 px-4">
            <div className="mx-auto">
               <p className="font-bold text-[3.25rem] leading-tight w-[70%] text-green-feldgrau font-avenir-next-lt-pro-bold">
                  Enter the email used to verify your account.
               </p>

               <Input
                  placeholder="email"
                  type="email"
                  id="email"
                  className="w-full mt-4"
                  containerClassName="animate-fade-in-from-right w-[80%] effect-item-1"
               />

               <Button
                  type="submit"
                  className="w-[80%] hover:brightness-90 animate-fade-in-from-right effect-item-3"
                  variant="override"
                  style={{
                     boxShadow: "none",
                     color: "var(--white)",
                     backgroundColor: "var(--green-feldgrau)",
                     borderWidth: "4px",
                     height: "4.125rem",
                     marginBottom: "1.36rem"
                  }}
               >
                  Continue
               </Button>
            </div>
         </section>
      </main>
   );
}
