import { ModalProps } from "@/types";
import { clsxm } from "@/utils/clsxm";
import { ElementRef, MouseEvent, useCallback, useEffect, useRef } from "react";

/**
 * A generic modal for questions and user dialog boxes.
 *
 * You should ideally not use this modal directly, but access it using the [useModal](../../hooks/useModal.tsx) hook.
 */
export const Modal: React.FC<ModalProps> = (props: ModalProps) => {
   const {
      onClose,
      closeOnClickOutside,
      closeButtonRef,
      style,
      children,
      className,
   } = props;

   const dialogRef = useRef<ElementRef<"dialog">>(null);
   const containerRef = useRef<ElementRef<"div">>(null);

   const containerClassnames = clsxm(
      "fixed animate-fade-in effect-item-0 top w-full h-full z-[9998] flex items-center justify-center",
      "before:block before:[content:''] before:duration-[500ms] before:[backdrop-filter:blur(10px)] before:absolute before:w-full before:h-full"
   );
   const dialogClassName = clsxm(
      "hover:scale-[0.99]",
      "animate-pop [animation-duration:500ms] duration-300 shadow-components/shadow",
      "relative bg-[#00000047] overflow-hidden min-h-[25vh] aspect-[1.5] p-[--modal-padding] bg-white",
      "border-green-charcoal border-[6.778px] rounded-[1.1015rem]",
      className
   );
   const closeButtonClassnames = clsxm(
      "absolute text-green-charcoal duration-300 bg-white aspect-square w-[45px] flex items-center justify-center rounded-[50%] border-green-charcoal border-[3px] top-0 right-0 mr-5 mt-3",
      "hover:scale-[0.9] hover:bg-green-charcoal hover:text-white"
   );

   /**
    * Load animation before passing event.
    * @param event Click event
    */
   const handleClose = useCallback(
      (event: MouseEvent) => {
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
               onClose(event);
            };
         } else onClose(event);
      },
      [onClose]
   );

   /**
    * Listener for outside clicks.
    */
   const handleClickOutside = useCallback(
      (event: globalThis.MouseEvent) => {
         const dialog = dialogRef.current;
         const { target } = event as unknown as { target: HTMLElement };
         if (dialog && !dialog.contains(target)) {
            handleClose(event as unknown as MouseEvent);
         }
      },
      [handleClose]
   );

   useEffect(() => {
      const container = containerRef.current;
      if (closeOnClickOutside && container) {
         container.addEventListener("click", handleClickOutside);
      }
      return () => {
         container?.removeEventListener("click", handleClickOutside);
      };
   }, [closeOnClickOutside, handleClickOutside]);

   return (
      <div ref={containerRef} className={containerClassnames}>
         <div className="relative">
            <dialog
               style={style}
               className={dialogClassName}
               ref={dialogRef}
               open
            >
               {children}
               <button
                  onClick={handleClose}
                  ref={closeButtonRef}
                  className={closeButtonClassnames}
               >
                  <svg
                     xmlns="http://www.w3.org/2000/svg"
                     width="50%"
                     height="50%"
                     viewBox="0 0 25 25"
                     fill="none"
                  >
                     <path
                        d="M1.55261 23.4473L23.4473 1.55262"
                        stroke="currentColor"
                        strokeWidth="2.8615"
                        strokeLinecap="round"
                     />
                     <path
                        d="M1.55261 1.55261L23.4473 23.4473"
                        stroke="currentColor"
                        strokeWidth="2.8615"
                        strokeLinecap="round"
                     />
                  </svg>
               </button>
            </dialog>
         </div>
      </div>
   );
};
