import { MouseEvent } from "react";
import { Link } from "react-router-dom";
import { Property } from "csstype";
import { Loader } from "@/components/ui";
import { clsxm } from "@/utils/clsxm";
import "./Button.css";

type ButtonProps = {
   children: React.ReactNode;
   style?: React.CSSProperties;
   /** Button styles */
   className?: string;
   /** Sets predefined size for button */
   size?: "small" | "okay" | "normal" | "large";
   /** Button height. Takes precedence over class styling and size attribute. */
   height?: Property.Height;
   /** Button width. Takes precedence over class styling and size attribute. */
   width?: Property.Width;
   /** Predefined styling for the button */
   variant?: "override" | "outlined" | "filled";
   /** Predefined styling for the button */
   loaderColor?: string;
   isLoading?: boolean;
   disabled?: boolean;
   onClick?(event: MouseEvent): void;
} & (
   | {
        as?: "button";
        type?: "reset" | "button" | "submit";
     }
   | {
        /** Button should render as anchor or button tag. */
        as: "link";
        to: string;
     }
);

/**
 * Generic button component.
 */
export function Button(props: ButtonProps) {
   const disabled = props.isLoading || props.disabled;

   const className = clsxm(
      "app_button",
      props.size ?? "normal",
      props.variant ?? "filled",
      props.className
   );

   return props.as === "link" ? (
      <Link
         onClick={props.onClick}
         style={{
            height: props.height,
            width: props.width,
            ...(props.style ?? {})
         }}
         className={className}
         to={props.to}
      >
         {props.children}
      </Link>
   ) : (
      <button
         onClick={props.onClick}
         type={props.type ?? "button"}
         disabled={disabled}
         style={{
            height: props.height,
            width: props.width,
            ...(props.style ?? {})
         }}
         className={className}
      >
         {props.isLoading ? (
            <Loader
               className="animate-pop"
               style={{
                  animationDuration: "300ms"
               }}
               size={40}
               variant="outlined"
               color={props.loaderColor ?? "white"}
               shadow={false}
            />
         ) : (
            props.children
         )}
      </button>
   );
}
