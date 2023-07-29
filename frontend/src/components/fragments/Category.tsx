import { categories } from "@/data";
import { clsxm } from "@/utils/clsxm";

interface CategoryProps {
   name?: keyof typeof categories;
   className?: string;
}

/**
 * A category box.
 */
export function Category(props: CategoryProps) {
   const className = clsxm(
      "flex w-[146px] h-[209px] justify-start flex-col item-start",
      props.className
   );
   if (!props.name) {
      return <></>;
   }
   const BoxIcon = categories[props.name].BoxIcon;
   return (
      <div className={className}>
         <div className="mb-3">
            <BoxIcon />
         </div>
         <span className="w-full text-center text-black font-poppins font-bold text-[0.815rem]">
            {props.name}
         </span>
      </div>
   );
}