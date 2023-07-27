import { Link } from "react-router-dom";
import { Property } from "csstype";
import "./Button.css";
import { MouseEvent } from "react";

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
   const className = `app_button ${props.size ?? "normal"} ${
      props.variant ?? "filled"
   } ${props.className}`;
   return props.as === "link" ? (
      <Link
         onClick={props.onClick}
         style={{
            height: props.height,
            width: props.width,
            ...(props.style ?? {}),
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
         style={{
            height: props.height,
            width: props.width,
            ...(props.style ?? {}),
         }}
         className={className}
      >
         {props.children}
      </button>
   );
}
