import { clsxm } from "@/utils/clsxm";

interface MetricProps {
   value: number | string;
   icon: React.ReactNode;
   name: string;
   className?: string;
   percent?: boolean;
}

/**
 * User Metric card.
 */
export function Metric(props: MetricProps) {
   const className = clsxm(
      "relative [--bg-offset-x:-2%] h-[11.5825rem] w-full [--bg-offset-y:5%] duration-300 text-green-dark-slate-gray",
      " before:block before:absolute before:translate-x-[--bg-offset-x] before:translate-y-[--bg-offset-y] before:[content:''] before:rounded-[1.1rem] before:border-green-charcoal before:border-[5px] before:border-solid before:w-full before:h-full before:duration-500",
      " hover:[--bg-offset-x:-1.3%] hover:[--bg-offset-y:3%] hover:scale-[0.98]",
      props.className
   );
   return (
      <div className={className}>
         <div className="flex items-center h-full w-full justify-between pl-[--home-card-left-padding] pr-[1.8rem] bg-white relative border-[5px] border-green-charcoal border-solid rounded-[1.1rem] ">
            <div className="flex flex-col">
               <span className="text-[4.6rem] whitespace-nowrap [text-wrap:nowrap] [line-height:1.3] font-avenir-next-lt-pro-bold">
                  {props.value}{" "}
                  {props.percent ? (
                     <span className="inline-block translate-x-[-9px] text-[3rem]">
                        %
                     </span>
                  ) : (
                     <></>
                  )}
               </span>
               <span className="font-poppins text-[1.30406rem] font-bold">
                  {props.name}
               </span>
            </div>
            <div className="scale-90">{props.icon}</div>
         </div>
      </div>
   );
}
