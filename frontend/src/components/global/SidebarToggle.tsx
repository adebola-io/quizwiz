import { clsxm } from "@/utils/clsxm";
import { Property } from "csstype";

export function SidebarToggle(props: {
   handler: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
   color: Property.Color;
   className?: string;
}) {
   const [expanded, setExpanded] = props.handler;

   const className = clsxm(
      "relative flex justify-center duration-300 flex-col gap-2 max-[390px]:gap-1 cursor-pointer w-[38%] max-w-[60px] aspect-square",
      props.className
   );

   return (
      <div
         title="Expand Sidebar"
         className={className}
         style={{
            rotate: expanded ? "180deg" : "0deg"
         }}
         onClick={() => setExpanded(!expanded)}
      >
         <div
            style={{
               position: expanded ? "absolute" : "relative",
               backgroundColor: props.color,
               rotate: expanded ? "45deg" : ""
            }}
            className="duration-500 h-[10%] w-full rounded"
         ></div>
         <div
            style={{
               display: expanded ? "none" : "initial",
               backgroundColor: props.color
            }}
            className="h-[10%] w-full rounded"
         ></div>
         <div
            style={{
               position: expanded ? "absolute" : "relative",
               rotate: expanded ? "-45deg" : "",
               backgroundColor: props.color
            }}
            className="duration-500 h-[10%] w-full rounded"
         ></div>
      </div>
   );
}
