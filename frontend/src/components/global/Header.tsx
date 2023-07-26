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
   return (
      <header className="fixed top-0 z-10 flex items-center justify-between h-[--header-height] w-full border-green-charcoal px-[--global-padding-left] bg-white border-b-4 border-solid">
         <Logo />
         <div className="border-l-4 h-full border-green-charcoal flex items-center justify-items-end pl-14">
            {props.loggedIn ? (
               <div className="flex items-center justify-center [box-shadow:-2px_2px_0px_0px_rgba(53,79,82,0.78)] text-white font-avenir-next-lt-pro-bold text-[1.63519rem] border-4 border-green-charcoal border-solid rounded-[50%] h-[3.625rem] aspect-square bg-green-dark-slate-gray">
                  {props.username[0].toUpperCase()}
               </div>
            ) : (
               <Button size="okay" as="link" to="/login">
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
      <span className="text-green-dark-slate-gray font-bold font-eras-bold text-[2.081713rem] text-center [font-style:normal] [line-height:normal]">
         QuizApp
      </span>
   );
}
