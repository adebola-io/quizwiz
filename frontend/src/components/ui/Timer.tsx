import { clsxm } from "@/utils/clsxm";
import { useEffect } from "react";
import { useCountdown } from "usehooks-ts";

interface TimerProps {
   /** How long the timer should count, in seconds. */
   duration: number;
   /** Function that should run once the time runs out. */
   onElaspse?: () => void;
   className?: string;
}

/**
 * A generic timer component
 */
export function Timer(props: TimerProps) {
   const { onElaspse } = props;

   const className = clsxm(
      "w-full flex items-center justify-center",
      "border-green-charcoal border-4 shadow-components/shadow rounded-[--default-border-radius]",
      "text-[4.34938rem] font-poppins font-bold text-green-charcoal",
      "animate-pop effect-item-1",
      props.className
   );

   const [countdown, { startCountdown }] = useCountdown({
      countStart: props.duration,
      intervalMs: 1000
   });

   const { minutes, seconds } = {
      minutes: Math.floor(countdown / 60),
      seconds: countdown % 60
   };
   useEffect(() => {
      startCountdown();
   }, [startCountdown]);

   useEffect(() => {
      if (minutes === 0 && seconds === 0) {
         onElaspse?.();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [minutes, seconds]);
   return (
      <div className={className}>
         {minutes < 10 ? `0${minutes}` : minutes}:
         {seconds < 10 ? `0${seconds}` : seconds}
      </div>
   );
}
