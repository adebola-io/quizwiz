import { useState } from "react";
import { useModal } from "@/hooks/useModal";
import { Tooltip } from "../ui/Tooltip";
import { Logout } from "../fragments/Logout";
import SettingsIcon from "@/assets/icons/Settings.png";
import { SidebarToggle, HomeIcon, Page, SidebarIconProps } from ".";
import { useNavigate } from "react-router-dom";

export function Sidebar() {
   const expanded = useState(false);
   const page = useState<Page>(
      window.location.pathname.split("/").at(-1) as Page
   );
   return (
      <div className="fixed z-[9] left-0 max-[912px]:hidden h-screen pt-[--header-height]">
         <aside
            style={{
               width: expanded[0] ? "30vw" : "var(--sidebar-width)"
            }}
            className="h-full py-[3vh] duration-300 w-[--sidebar-width] bg-green-charcoal"
         >
            <div className="w-[--sidebar-width] h-full flex flex-col justify-between items-center">
               <div className="w-full gap-5 flex flex-col items-center">
                  <SidebarToggle color="white" handler={expanded} />
                  <HomeIcon handler={page} />
                  <ScoreboardIcon handler={page} />
               </div>
               <Settings />
            </div>
         </aside>
      </div>
   );
}

function ScoreboardIcon(props: SidebarIconProps) {
   const [page, setPage] = props.handler;
   const navigate = useNavigate();

   function handleClick() {
      setPage("leaderboard");
      navigate("/dashboard/leaderboard");
   }
   return (
      <div
         onClick={handleClick}
         className="cursor-pointer scale-75"
         title="Leaderboard"
      >
         <div className="flex items-end gap-1">
            <div
               id="bar-chart-1"
               style={{
                  background: page === "leaderboard" ? "white" : undefined
               }}
               className="h-[22px] duration-300 w-[12px] border-[3px] border-white"
            ></div>
            <div
               id="bar-chart-2"
               style={{
                  background: page === "leaderboard" ? "white" : undefined
               }}
               className="h-[32px] duration-300 w-[12px] border-[3px] border-white"
            ></div>
            <div
               id="bar-chart-3"
               style={{
                  background: page === "leaderboard" ? "white" : undefined
               }}
               className="h-[15px] duration-300 w-[12px] border-[3px] border-white"
            ></div>
         </div>
         <div className="bg-white h-1 mt-2"></div>
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
         <div
            title="Settings"
            className="w-full flex items-center justify-center"
         >
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
