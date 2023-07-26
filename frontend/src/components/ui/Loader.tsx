import { Property } from "csstype";

type LoaderProps = {
   size?: number;
   /**Whether or not it should have a box shadow. */
   shadow?: boolean;
   className?: string;
   style?: React.CSSProperties;
} & ({ variant?: "normal" } | { variant: "outlined"; color: Property.Color });

interface LoaderStyles {
   frameCircle: React.CSSProperties;
   centerCircle: React.CSSProperties;
   spinningCircle: React.CSSProperties;
}

/**
 * Loader for application.
 */
export function Loader(props: LoaderProps) {
   const size = props.size ?? 60;
   const centerCircleStyles: React.CSSProperties = {
      borderWidth: `${(size / 20).toFixed(2)}px`,
   };
   const frameCircleStyles: React.CSSProperties = {
      borderWidth: `${(size / 20).toFixed(2)}px`,
   };
   const spinningCircleStyles: React.CSSProperties = {
      borderWidth: `${(size / 30).toFixed(2)}px`,
   };
   const shadow = props.shadow === undefined || props.shadow;
   const styles: LoaderStyles =
      props.variant === "outlined"
         ? {
              centerCircle: {
                 borderColor: props.color,
                 ...centerCircleStyles,
              },
              frameCircle: {
                 borderColor: props.color,
                 ...frameCircleStyles,
              },
              spinningCircle: {
                 borderColor: props.color,
                 ...spinningCircleStyles,
              },
           }
         : {
              centerCircle: {
                 background: "var(--green-viridian)",
                 borderColor: "var(--green-charcoal)",
                 ...centerCircleStyles,
              },
              frameCircle: {
                 background: "white",
                 borderColor: "var(--green-charcoal)",
                 ...frameCircleStyles,
              },
              spinningCircle: {
                 background: "var(--green-viridian)",
                 borderColor: "var(--green-charcoal)",
                 ...spinningCircleStyles,
              },
           };
   return (
      <div
         style={{
            width: props.size ? `${size}px` : undefined,
            ...(props.style ?? {}),
         }}
         className={`w-[60px] ${
            shadow ? "shadow-components/shadow" : ""
         }  aspect-square rounded-[50%] ${props.className ?? ""}`}
      >
         <div
            style={styles.frameCircle}
            className="relative animate-spin flex items-center justify-center w-full aspect-square rounded-[50%]"
         >
            <div
               style={styles.centerCircle}
               className="rounded-[50%] w-[35%] aspect-square"
            ></div>

            <div
               style={styles.spinningCircle}
               className="absolute translate-x-[120%] translate-y-[-130%] rounded-[50%] w-[18%] aspect-square"
            ></div>
         </div>
      </div>
   );
}
