import { categories } from "@/data";
import { useModal } from "@/hooks";
import { clsxm } from "@/utils/clsxm";
import { QuizStart } from ".";
import { Eclipses } from "./Eclipses";

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
      modal.setContent(
         <>
            <Eclipses name={props.name} />
            <QuizStart name={props.name} />
         </>
      );
      modal.morph({
         className: "aspect-auto min-h-[max-content]"
      });
      modal.open({ closeOnClickOutside: false });
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
