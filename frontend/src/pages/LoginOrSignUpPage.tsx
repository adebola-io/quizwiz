import { Link, useLocation } from "react-router-dom";
import { LoginForm, SignUpForm } from "@/components/fragments";

/**
 * Page for user signing in and creating account.
 */
export default function LoginOrSignUpPage() {
   const { pathname } = useLocation();
   const isSignUp = pathname.includes("/sign-up");
   return (
      <div className="flex w-screen items-center justify-between lines min-h-screen px-8 md:px-[--global-padding-left] lg:px-12 xl:px-[--global-padding-left]">
         {/* Text */}
         <div className="flex flex-col justify-center items-center w-full lg:w-[50%] py-10 lg:py-0 h-full">
            {!isSignUp ? <LoginForm /> : <SignUpForm />}
            <div className="flex lg:pr-[--global-padding-left] items-center w-full opacity-[0.699999988079071] gap-[0.825rem] my-5">
               <hr className="w-full bg-green-charcoal h-[5px] border-none" />
               OR
               <hr className="w-full bg-green-charcoal h-[5px] border-none" />
            </div>
            <div className="w-full text-[1.3125rem] font-poppins text-green-charcoal font-bold text-center">
               {!isSignUp ? (
                  <>
                     Dont't have an account?{" "}
                     <Link className="text-green-viridian" to="/auth/sign-up">
                        Sign Up.
                     </Link>
                  </>
               ) : (
                  <>
                     Already have an account?{" "}
                     <Link className="text-green-viridian" to="/auth/login">
                        Sign In.
                     </Link>
                  </>
               )}
            </div>
         </div>
         {/* Diagram */}
         <div className="hidden animate-expand backgrounds_sign_in z-50 h-[85vh] max-w-[50%] aspect-[0.9] rounded-[0.625rem] border-[6px] border-green-charcoal shadow-components/shadow lg:flex"></div>
      </div>
   );
}
