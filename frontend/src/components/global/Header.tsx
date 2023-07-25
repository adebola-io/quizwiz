import { Button } from "../ui";

/**
 * App navigation bar.
 */
export function Header() {
   return (
      <header className="fixed top-0 z-10 flex justify-between min-h-[6.375rem] h-[6vh] w-full border-green-charcoal px-[--global-padding-left] bg-white border-b-4 border-solid">
         <Logo />
         <div className="border-l-4 border-green-charcoal flex items-center justify-items-end pl-14">
            <Button size="okay" className="bg-green-feldgrau text-[0.95238rem]">
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
      <span className="text-green-dark-slate-gray font-eras-bold text-[2.281713rem] text-center [font-style:normal] [font-weight:400] [line-height:normal]">
         QuizApp
      </span>
   );
}
