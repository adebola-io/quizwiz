import { categories } from "@/data";
import { useModal } from "@/hooks/useModal";
import { clsxm } from "@/utils/clsxm";
import { QuestionStart } from ".";

interface CategoryProps {
   name?: keyof typeof categories;
   className?: string;
}

/**
 * A category box.
 */
export function Category(props: CategoryProps) {
   const modal = useModal();

   function openQuiz() {
      modal.data = <QuestionStart />;
      modal.open();
   }

   const className = clsxm(
      "flex w-[146px] h-[209px] justify-start flex-col item-start cursor-pointer",
      props.className
   );
   if (!props.name) {
      return <></>;
   }
   const { BoxIcon } = categories[props.name];
   return (
      <div className={className}>
         <div onClick={() => openQuiz()} className="mb-3 hover:brightness-90">
            <BoxIcon />
         </div>
         <span className="w-full text-center text-black font-poppins font-bold text-[0.815rem]">
            {props.name}
         </span>
      </div>
   );
}
