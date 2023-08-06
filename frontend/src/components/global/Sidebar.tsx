import { useState } from "react";
import { useModal } from "@/hooks/useModal";
import { Tooltip } from "../ui/Tooltip";
import { Logout } from "../fragments/Logout";
import SettingsIcon from "@/assets/icons/Settings.png";
import { SidebarToggle } from ".";

export function Sidebar() {
   const expanded = useState(false);
   return (
      <div className="fixed z-[9] left-0 max-[912px]:hidden h-screen pt-[--header-height]">
         <aside
            style={{
               width: expanded[0] ? "30vw" : "var(--sidebar-width)"
            }}
            className="h-full py-[3vh] duration-300 w-[--sidebar-width] bg-green-charcoal"
         >
            <div className="w-[--sidebar-width] h-full flex flex-col justify-between items-center">
               <SidebarToggle color="white" handler={expanded} />
               <Settings />
            </div>
         </aside>
      </div>
   );
}

function Settings() {
   const modal = useModal();
   const [showTooltip, setShowtoolTip] = useState(false);

   function openLogoutModal() {
      modal.setContent(<Logout />);
      modal.morph({
         className: "aspect-auto min-h-[max-content] max-w-[44vw]"
      });
      modal.open();
   }

   return (
      <Tooltip content="Log out" onContentClick={openLogoutModal}>
         <div className="w-full flex items-center justify-center">
            <img
               style={{
                  rotate: showTooltip ? "60deg" : "none"
               }}
               onClick={() => setShowtoolTip(!showTooltip)}
               className="w-[50%] duration-300 cursor-pointer brightness-95"
               src={SettingsIcon}
               alt="Settings icon"
            />
         </div>
      </Tooltip>
   );
}
