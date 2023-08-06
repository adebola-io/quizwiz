import { categories } from "@/data";
import { CategoryName } from "@/types";
import { clsxm } from "@/utils/clsxm";

interface CategoryEclipseProps {
   name: CategoryName;
}

interface RapidFireEclipseProps {
   rapidFire: true;
}

/**
 * Spinning circles for each category or rapid fire.
 */
export function Eclipses(props: CategoryEclipseProps | RapidFireEclipseProps) {
   const category = isCategory(props)
      ? categories[props.name]
      : {
           gradient:
              "var(--gradients-rapid-fire-three, linear-gradient(90deg, #CE0000 0%, #FFA500 100%))"
        };

   const outerClassNames = clsxm(
      "animate-spin-custom [animation-duration:2500ms] flex items-center z-[0] opacity-[0.5] justify-center w-[19.5rem] aspect-square rounded-[50%] absolute",
      isCategory(props)
         ? "max-[540px]:opacity-[0.2]"
         : "max-[540px]:opacity-[0.1]"
   );
   const middleClassNames =
      "flex items-center justify-center bg-white w-[94%] aspect-square rounded-[50%]";
   const innerClassNames = "w-[80%] h-[80%] rounded-[50%]";

   const outerCircle1 = clsxm(
      outerClassNames,
      "top-0 left-0 [translate:-50%_-50%]"
   );
   const outerCircle2 = clsxm(
      outerClassNames,
      "bottom-0 right-0 [translate:50%_50%]"
   );
   return (
      <>
         <div
            style={{ background: category.gradient }}
            className={outerCircle1}
         >
            <div className={middleClassNames}>
               <div
                  style={{ background: category.gradient }}
                  className={innerClassNames}
               ></div>
            </div>
         </div>

         <div
            style={{ background: category.gradient }}
            className={outerCircle2}
         >
            <div className={middleClassNames}>
               <div
                  style={{ background: category.gradient }}
                  className={innerClassNames}
               ></div>
            </div>
         </div>
      </>
   );
}

const isCategory = (
   props: CategoryEclipseProps | RapidFireEclipseProps
): props is CategoryEclipseProps => {
   return (props as CategoryEclipseProps).name !== undefined;
};
