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
      "relative aspect-[2] min-[2160px]:aspect-[2.5] max-[768px]:aspect-[1.7] max-[720px]:aspect-[2.9] w-[30%] max-[720px]:w-full duration-300 text-green-dark-slate-gray",
      "[--bg-offset-x:-2%] [--bg-offset-y:5%] max-[1024px]:[--bg-offset-x:-3.5%] max-[1024px]:[--bg-offset-y:6%] max-[720px]:[--bg-offset-x:-2%] max-[720px]:[--bg-offset-y:6%]",
      " hover:[--bg-offset-x:-1.3%] hover:[--bg-offset-y:3%] hover:scale-[0.98]",
      ...[
         "before:block before:absolute before:[content:''] before:rounded-[1.1rem] before:max-[768px]:rounded-[0.9rem] before:max-[414px]:rounded-[0.5rem] before:w-full before:h-full before:duration-500",
         "before:border-green-charcoal before:border-[5px] before:max-[768px]:border-[4px] before:max-[720px]:border-[6px] before:max-[540px]:border-[4px] before:border-solid",
         "before:translate-x-[--bg-offset-x] before:translate-y-[--bg-offset-y]"
      ],
      props.className
   );
   return (
      <div className={className}>
         <div className="flex items-center overflow-hidden h-full w-full justify-between max-[768px]:justify-center max-[720px]:justify-start max-[768px]:gap-[8%] pl-[--home-card-left-padding] pr-[1.8rem] max-[1024px]:pr-[1rem] max-[768px]:pl-2 max-[720px]:pl-[2rem] max-[540px]:pl-[1rem] bg-white relative border-[5px] max-[768px]:border-[4px] max-[720px]:border-[6px] max-[540px]:border-[4px] border-green-charcoal border-solid rounded-[1.1rem] max-[768px]:rounded-[0.9rem] max-[414px]:rounded-[0.5rem]">
            <div className="flex flex-col">
               <span className="text-[4.6rem] min-[1900px]:text-[5.2rem] max-[1366px]:text-[3rem] max-[1024px]:text-[2.5rem] max-[768px]:text-[2.5rem] max-[720px]:text-[6rem] max-[540px]:text-[3rem] max-[290px]:text-[1.5rem] whitespace-nowrap [text-wrap:nowrap] leading-[1.3] max-[720px]:leading-[1] font-avenir-next-lt-pro-bold">
                  {props.value}{" "}
                  {props.percent && (
                     <span className="inline-block max-[768px]:w-0 max-[290px]:w-fit max-[290px]:ml-1 translate-x-[-9px] text-[3rem] max-[1024px]:text-[1.5rem] max-[720px]:text-[2rem] max-[290px]:text-[1rem]">
                        %
                     </span>
                  )}
               </span>
               <span className="font-poppins min-[1900px]:text-[2rem] text-[1.30406rem] max-[1024px]:text-[0.9rem] max-[768px]:hidden max-[720px]:block max-[720px]:text-[2rem] max-[540px]:text-[1.3rem] max-[290px]:text-[0.9rem] font-bold">
                  {props.name}
               </span>
            </div>
            {props.icon}
         </div>
      </div>
   );
}
