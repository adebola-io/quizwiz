import { useState } from "react";
import { clsxm } from "@/utils/clsxm";
import { Button } from "../ui";
import { SidebarToggle, Icon } from ".";
import { useModal } from "@/hooks";
import { Link } from "react-router-dom";
import { Logout } from "../fragments/Logout";

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
   const modal = useModal();
   const expanded = useState(false);
   const [showSettings, setShowSettings] = useState(false);

   function openLogOutModal() {
      expanded[1](false);
      setShowSettings(false);
      modal.setContent(<Logout />);
      modal.open();
   }

   const headerClassnames = clsxm(
      "fixed top-0 z-10 flex items-center min-[768px]:[box-shadow:0_0_8px_0_var(--green-charcoal)] justify-between h-[--header-height] w-full border-green-charcoal px-8 bg-white border-b-4 border-solid",
      "animate-drop-from-top effect-item-0",
      props.loggedIn
         ? "pl-[1.625rem] pr-[--global-padding-left]"
         : "px-[--global-padding-left]",
      "app_header"
   );
   return (
      <header className={headerClassnames}>
         {props.loggedIn && (
            <>
               <SidebarToggle
                  color="var(--green-charcoal)"
                  handler={expanded}
                  className="min-[913px]:hidden max-[414px]:absolute max-[414px]:left-[1.625rem] w-9 max-[414px]:w-7"
               />
               <aside
                  style={{
                     transform: expanded[0]
                        ? "translateX(0%)"
                        : "translateX(-100%)"
                  }}
                  className="min-[913px]:hidden flex flex-col duration-500 items-center justify-between pt-[7vh] pb-[12vh] text-white text-[3.75rem] max-[768px]:text-[3rem] max-[540px]:text-[2rem] fixed left-0 top-0 mt-[--header-height] w-full h-screen bg-green-charcoal"
               >
                  <div className="flex flex-col text-center">
                     <Link to="/dashboard/home">
                        <div onClick={() => expanded[1](false)}>Home</div>
                     </Link>
                     <Link to="/dashboard/leaderboard">
                        <div onClick={() => expanded[1](false)}>
                           Leaderboard
                        </div>
                     </Link>
                  </div>
                  <div>
                     <span onClick={() => setShowSettings(!showSettings)}>
                        Settings
                     </span>
                     {showSettings && (
                        <ul className="text-[2.5rem] max-[540px]:text-[1.3rem] max-[768px]:text-[2rem] animate-drop-from-top text-center effect-item-0">
                           <li onClick={openLogOutModal}>Log Out</li>
                        </ul>
                     )}
                  </div>
               </aside>
            </>
         )}
         <Icon className="h-[120%]" />
         <div className="header_box border-l-4 h-full border-green-charcoal flex items-center justify-items-end pl-14">
            {props.loggedIn ? (
               <div className="flex items-center justify-center text-white font-avenir-next-lt-pro-bold text-[80%] border-4 border-green-charcoal border-solid rounded-[50%] h-[2.925rem] max-[540px]:h-[2rem] aspect-square bg-green-feldgrau">
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

// /**
//  * App Logo
//  */
// function Logo() {
//    return (
//       <span className=>
//          QuizWiz
//       </span>
//    );
// }
