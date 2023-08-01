import { useState, useRef, useEffect, forwardRef, ReactNode } from "react";
import { clsxm } from "@/utils/clsxm";

interface TooltipProps {
   content: string;
   className?: string;
   contentClassName?: string;
   children: ReactNode;
   /**
    * Set to true to open the tooltip to the left side, false to the right (default).
    */
   openToLeft?: boolean;
   /**
    * Function to be called when the content of the tooltip is clicked.
    */
   onContentClick?: () => void;
}

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
   (props, ref) => {
      const [showTooltip, setShowTooltip] = useState(false);
      const tooltipRef = useRef<HTMLDivElement>(null);
      const [tooltipWidth, setTooltipWidth] = useState(0);

      const contentClassName = clsxm(
         "absolute flex animate-fade-in effect-item-0 top-3 left-1/2 transform -translate-x-1/2  bg-white text-black shadow-[-4px_4px_0_0_rgba(53,79,82,0.78)] rounded-md border-[3px] border-green-charcoal py-2.5 pr-2.5 pl-3.5 w-[214px] hover:shadow-[-0_0_0_0] transition duration-500 hover:scale-95 cursor-pointer text-[1.036875rem]",
         props.openToLeft
            ? "tooltip-left left-auto right-full -translate-x-8"
            : "tooltip-right left-full translate-x-8",

         props.contentClassName
      );

      const tooltipStyle: React.CSSProperties = {
         left: props.openToLeft ? `-${tooltipWidth}px` : "100%",
         opacity: showTooltip ? 1 : 0,
         transition: "opacity 0.3s, left 0.3s"
      };

      useEffect(() => {
         if (tooltipRef.current) {
            setTooltipWidth(tooltipRef.current.offsetWidth);
         }
      }, []);

      function handleTooltipClick() {
         setShowTooltip(!showTooltip);
      }

      function handleContentClick() {
         if (props.onContentClick) {
            props.onContentClick();
         }
      }

      return (
         <div
            className={clsxm("relative", props.className)}
            onClick={handleTooltipClick}
            ref={ref}
         >
            {showTooltip && (
               <div
                  className={contentClassName}
                  ref={tooltipRef}
                  style={tooltipStyle}
                  onClick={handleContentClick}
               >
                  {props.content}
               </div>
            )}
            {props.children}
         </div>
      );
   }
);
