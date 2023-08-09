import { clsxm } from "@/utils/clsxm";

interface BannerProps {
   children: React.ReactNode;
   className?: string;
   rightCornerImage?: string;
   onClick?: () => void;
}

/**
 * Dashboard stuff.
 */
export function Banner(props: BannerProps) {
   const classNames = clsxm(
      "relative duration-300 text-green-dark-slate-gray",
      " [--bg-offset-x:-0.5%] [--bg-offset-y:4%] max-[1024px]:[--bg-offset-x:-0.8%] max-[1024px]:[--bg-offset-y:3%] max-[414px]:[--bg-offset-x:-2%]",
      " before:block before:absolute before:translate-x-[--bg-offset-x] before:translate-y-[--bg-offset-y] before:[content:''] before:rounded-[0.5625rem] before:min-[2160px]:rounded-[1rem] before:border-green-charcoal before:border-[4px] before:min-[2160px]:border-[8px] before:w-full before:h-full before:duration-500",
      " hover:[--bg-offset-x:-0.3%] hover:[--bg-offset-y:2%] hover:scale-[0.99]",
      props.className
   );
   return (
      <div onClick={props.onClick} className={classNames}>
         <div className="relative bg-white pl-[--home-card-left-padding] max-[768px]:pl-0 overflow-hidden flex justify-between h-[30vh] max-[1024px]:max-h-[300px] border-[4px] min-[2160px]:border-[8px] border-green-charcoal rounded-[0.5625rem] min-[2160px]:rounded-[1rem]">
            <div className="w-[50%] max-[768px]:w-full max-[768px]:h-full z-[1] flex flex-col justify-center max-[768px]:items-center">
               {props.children}
            </div>
            <img
               className="rpd_fire_stars_image absolute right-[-6%] max-[768px]:right-0 z-0 translate-x-[10%] min-[1900px]:translate-x-[-10%] min-[2160px]:right-[5%] min-[2160px]:scale-[2] max-[768px]:hidden"
               src={props.rightCornerImage}
               alt="*****"
            />
         </div>
      </div>
   );
}
