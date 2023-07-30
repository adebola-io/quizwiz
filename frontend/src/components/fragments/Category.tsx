import { categories } from "@/data";
import { useModal } from "@/hooks/useModal";
import { clsxm } from "@/utils/clsxm";
import { QuestionStart } from ".";

interface CategoryProps {
   name: keyof typeof categories;
   className?: string;
}

/**
 * A category box on the home page.
 */
export function Category(props: CategoryProps) {
   const { BoxIcon } = categories[props.name];

   const modal = useModal();

   function openQuiz() {
      modal.data = (
         <>
            <Eclipses name={props.name} />
            <QuestionStart name={props.name} />
         </>
      );
      modal.morph({
         className: "aspect-auto min-h-[max-content] max-w-[44vw]"
      });
      modal.open();
   }

   const className = clsxm(
      "flex w-[146px] h-[209px] justify-start flex-col item-start cursor-pointer",
      props.className
   );
   if (!props.name) {
      return <></>;
   }
   return (
      <div className={className}>
         <div onClick={openQuiz} className="mb-3 hover:brightness-90">
            <BoxIcon />
         </div>
         <span className="w-full text-center text-black font-poppins font-bold text-[0.815rem]">
            {props.name}
         </span>
      </div>
   );
}

function Eclipses(props: { name: keyof typeof categories }) {
   const category = categories[props.name];

   const outerClassNames =
      "animate-spin-custom [animation-duration:2500ms] flex items-center z-[0] opacity-[0.5] justify-center w-[19.5rem] aspect-square rounded-[50%] absolute";
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
