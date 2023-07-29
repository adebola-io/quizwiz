import { ModalProps } from "@/types";
import { clsxm } from "@/utils/clsxm";
import { ElementRef, MouseEvent, forwardRef, useRef } from "react";

/**
 * A generic modal for questions and user dialog boxes.
 *
 * You should ideally not use this modal directly, but access it using the [useModal](../../hooks/useModal.tsx) hook.
 */
// eslint-disable-next-line react-refresh/only-export-components
export const Modal = forwardRef(
   (props: ModalProps, ref: React.ForwardedRef<HTMLDivElement>) => {
      const dialogRef = useRef<ElementRef<"dialog">>(null);
      const className = clsxm(
         "animate-pop effect-item-0 duration-300 shadow-component-shadow relative px-[3rem] py-[5rem] border-green-charcoal border-[5px] rounded-[15px]",
         props.className
      );
      const containerClassnames = clsxm(
         "fixed top w-full h-full z-[9998] flex items-center justify-center",
         "before:block before:[content:''] before:bg-black before:absolute before:opacity-[0.5] before:w-full before:h-full"
      );

      /**
       * Load animation before passing event.
       * @param event Click event
       */
      function handleClose(event: MouseEvent) {
         if (dialogRef.current) {
            const dialog = dialogRef.current;
            const animation = dialog.animate(
               [
                  {
                     opacity: 1,
                     transform: "scale(1)",
                  },
                  {
                     opacity: 1,
                     transform: "scale(1.1)",
                     offset: 0.3,
                  },
                  {
                     opacity: 0,
                     transform: "scale(0.7)",
                  },
               ],
               { duration: 400 }
            );
            animation.onfinish = () => {
               props.onClose(event);
            };
         } else props.onClose(event);
      }

      return (
         <div className={containerClassnames}>
            <div className="relative" ref={ref}>
               <dialog
                  style={props.style}
                  className={className}
                  ref={dialogRef}
                  open
               >
                  <button
                     onClick={handleClose}
                     className="absolute hover:brightness-95 bg-white aspect-square w-[50px]  flex items-center justify-center rounded-[50%] border-green-charcoal border-[3px] top-0 right-0 mr-5 mt-3"
                  ></button>
                  {props.children}
               </dialog>
            </div>
         </div>
      );
   }
);
