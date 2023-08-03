import { clsxm } from "@/utils/clsxm";
import { Button } from "../ui";

type HeaderProps =
   | {
        loggedIn?: false;
     }
   | {
        loggedIn: true;
        username: string;
     };

/**
 * App navigation bar.
 */
export function Header(props: HeaderProps) {
   const headerClassnames = clsxm(
      "fixed top-0 z-10 flex items-center justify-between h-[--header-height] w-full border-green-charcoal px-8 bg-white border-b-4 border-solid",
      props.loggedIn
         ? "pl-[1.625rem] pr-[--global-padding-left]"
         : "px-[--global-padding-left]"
   );
   return (
      <header className={headerClassnames}>
         <Logo />
         <div className="border-l-4 h-full border-green-charcoal flex items-center justify-items-end pl-14">
            {props.loggedIn ? (
               <div className="flex items-center justify-center text-white font-avenir-next-lt-pro-bold text-[1.33519rem] border-4 border-green-charcoal border-solid rounded-[50%] h-[2.925rem] aspect-square bg-green-feldgrau">
                  {props.username[0].toUpperCase()}
               </div>
            ) : (
               <Button size="okay" as="link" to="/auth/login">
                  Sign In
               </Button>
            )}
         </div>
      </header>
   );
}

/**
 * App Logo
 */
function Logo() {
   return (
      <span className="logo_text text-green-dark-slate-gray font-bold font-eras-bold text-[2.081713rem] text-center [font-style:normal] [line-height:normal]">
         QuizWiz
      </span>
   );
}
