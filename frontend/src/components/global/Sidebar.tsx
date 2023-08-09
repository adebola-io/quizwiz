import { useState } from "react";
import { useModal } from "@/hooks/useModal";
import { Tooltip } from "../ui/Tooltip";
import { Logout } from "../fragments/Logout";
import SettingsIcon from "@/assets/icons/Settings.png";
import { SidebarToggle, HomeIcon, Page, SidebarIconProps } from ".";
import { useNavigate } from "react-router-dom";
import { clsxm } from "@/utils/clsxm";

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
            <div className="w-[--sidebar-width] relative h-full flex flex-col justify-between items-center">
               <div
                  style={{ overflow: expanded[0] ? "visible" : "hidden" }}
                  className="w-full relative gap-5 flex flex-col items-center"
               >
                  <SidebarToggle color="white" handler={expanded} />
                  <HomeIcon handlers={{ page, expanded }} />
                  <ScoreboardIcon handlers={{ page, expanded }} />
               </div>
               <Settings expanded={expanded[0]} />
            </div>
         </aside>
      </div>
   );
}

function ScoreboardIcon(props: SidebarIconProps) {
   const [page, setPage] = props.handlers.page;
   const setSidebarExpanded = props.handlers.expanded[1];
   const navigate = useNavigate();

   function handleClick() {
      setPage("leaderboard");
      setSidebarExpanded(false);
      navigate("/dashboard/leaderboard");
   }
   return (
      <div
         onClick={handleClick}
         className="flex relative cursor-pointer w-full pl-[calc(var(--sidebar-width)/3.5)] [--line-height:0] [--line-width:0] hover:[--line-width:100%] hover:[--line-height:2px]"
      >
         <div className=" scale-75" title="Leaderboard">
            <div className="flex relative items-end gap-1">
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
         <span className="absolute left-[var(--sidebar-width)] w-full h-full flex flex-col justify-center font-poppins text-[14pt] text-white">
            Leaderboard
            <div className="h-[--line-height] bg-white w-[--line-width] duration-300"></div>
         </span>
      </div>
   );
}

function Settings(props: { expanded: boolean }) {
   const modal = useModal();
   const [showTooltip, setShowtoolTip] = useState(false);

   function openLogoutModal() {
      modal.setContent(<Logout />);
      modal.morph({
         className: "aspect-auto min-h-[max-content] max-w-[44vw]"
      });
      modal.open();
   }

   function handleClick() {
      setShowtoolTip(!showTooltip);
   }

   return (
      <Tooltip
         contentClassName={clsxm(
            "duration-300",
            props.expanded ? "ml-[25vw]" : "ml-[2vw]"
         )}
         content="Log out"
         onContentClick={openLogoutModal}
      >
         <div
            style={{ overflow: props.expanded ? "visible" : "hidden" }}
            title="Settings"
            onClick={handleClick}
            className="w-full relative cursor-pointer flex items-center justify-center"
         >
            <img
               style={{
                  rotate: showTooltip ? "60deg" : "none"
               }}
               className="h-[50px] relative duration-300 cursor-pointer brightness-95"
               src={SettingsIcon}
               alt="Settings icon"
            />
            <span className="absolute left-[calc(var(--sidebar-width)/1.2)] w-full h-full flex flex-col justify-center font-poppins text-[14pt] text-white">
               Settings
               <div className="h-[--line-height] bg-white w-[--line-width] duration-300"></div>
            </span>
         </div>
      </Tooltip>
   );
}
