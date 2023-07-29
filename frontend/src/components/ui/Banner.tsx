import { clsxm } from "@/utils/clsxm";

interface BannerProps {
   children: React.ReactNode;
   className?: string;
   rightCornerImage?: string;
}

/**
 * Dashboard stuff.
 */
export function Banner(props: BannerProps) {
   const classNames = clsxm(
      "relative [--bg-offset-x:-0.5%] [--bg-offset-y:4%] duration-300 text-green-dark-slate-gray",
      " before:block before:absolute before:translate-x-[--bg-offset-x] before:translate-y-[--bg-offset-y] before:[content:''] before:rounded-[0.5625rem] before:border-green-charcoal before:border-[4px] before:bg-green-cambridge-blue before:border-solid before:w-full before:h-full before:duration-500",
      " hover:[--bg-offset-x:-0.3%] hover:[--bg-offset-y:2%] hover:scale-[0.99]",
      props.className
   );
   return (
      <div className={classNames}>
         <div className="relative bg-white pl-[--home-card-left-padding] overflow-hidden flex justify-between h-[17.5rem] border-[4px] border-green-charcoal rounded-[0.5625rem]">
            <div className="w-[60%] max-w-[700px] flex flex-col justify-center">
               {props.children}
            </div>
            <img
               className="rpd_fire_stars_image translate-x-[10%] h-[165%]"
               src={props.rightCornerImage}
               alt="*****"
            />
         </div>
      </div>
   );
}
