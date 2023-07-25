import { Button } from "../ui";

/**
 * App navigation bar.
 */
export function Header() {
   return (
      <header className="fixed top-0 z-10 flex items-center justify-between min-h-[6.375rem] h-[6vh] w-full border-green-charcoal px-[--global-padding-left] bg-white border-b-4 border-solid">
         <Logo />
         <div className="border-l-4 h-full border-green-charcoal flex items-center justify-items-end pl-14">
            <Button size="okay" as="link" to="/login">
               Sign In
            </Button>
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
