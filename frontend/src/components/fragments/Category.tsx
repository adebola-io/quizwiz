import { categories } from "@/data";
import { useModal } from "@/hooks";
import { clsxm } from "@/utils/clsxm";
import { QuizStart } from ".";

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
      modal.setContent(<QuizStart name={props.name} />);
      modal.morph({
         className: "aspect-auto min-h-[max-content] max-[1024px]:p-0"
      });
      modal.open({ closeOnClickOutside: false });
   }

   const className = clsxm(
      "flex w-[11vw] h-[209px] flex-col cursor-pointer justify-start",
      "max-[912px]:w-[30vw] max-[912px]:h-fit max-[912px]:mb-5 max-[912px]:items-center ",
      "max-[768px]:w-[25vw]",
      "max-[720px]:w-[40vw]",
      props.className
   );
   if (!props.name) {
      return <></>;
   }
   return (
      <div onClick={openQuiz} className={className}>
         <img
            className="mb-3 rounded-lg hover:brightness-90 w-[80%] max-[768px]:w-[100%]"
            src={BoxIcon}
            alt=""
         />
         <span className="w-[80%] max-[768px]:h-[30px] max-[720px]:h-fit text-black font-poppins font-bold text-[0.815rem] max-[1024px]:text-[0.7rem] max-[912px]:text-center max-[912px]:text-[0.9rem] max-[720px]:text-[1.5rem] max-[540px]:text-[0.8rem]">
            {props.name}
         </span>
      </div>
   );
}
