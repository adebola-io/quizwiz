import "./Input.css";
import React from "react";

type InputProps = {
   type: React.HTMLInputTypeAttribute;
   id: string;
   className?: string;
   containerClassName?: string;
   placeholder?: string;
   error?: string | null;
};

/**
 * Generic Input component.
 */
export function Input(props: InputProps) {
   return (
      <div
         className={`app_input_and_error_container ${
            props.containerClassName ?? ""
         }`}
      >
         <div className={`app_input_container ${props.error ? "error" : ""}`}>
            <input
               id={props.id}
               className={`app_input ${props.className ?? ""}`}
               type={props.type}
               placeholder={props.placeholder}
            ></input>
         </div>
         {props.error ? (
            <span className="app_input_error_message">{props.error}</span>
         ) : (
            <></>
         )}
      </div>
   );
}
