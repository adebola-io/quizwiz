import { Link } from "react-router-dom";
import { Property } from "csstype";
import "./Button.css";

type ButtonProps = {
   children: React.ReactNode;
   /** Button styles */
   className?: string;
   /** Sets predefined size for button */
   size?: "small" | "okay" | "normal" | "large";
   /** Button height. Takes precedence over class styling and size attribute. */
   height?: Property.Height;
   /** Button width. Takes precedence over class styling and size attribute. */
   width?: Property.Width;
} & (
   | {
        as?: "button";
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
   const className = `app_button ${props.size ?? "normal"} ${props.className}`;
   return props.as === "link" ? (
      <Link
         style={{ height: props.height, width: props.width }}
         className={className}
         to={props.to}
      >
         {props.children}
      </Link>
   ) : (
      <button
         style={{ height: props.height, width: props.width }}
         className={className}
      >
         {props.children}
      </button>
   );
}
