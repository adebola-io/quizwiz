import { useEffect, useState } from "react";
import { useCountdown } from "usehooks-ts";

interface TimerProps {
   /** How long the timer should count, in seconds. */
   duration: number;
   /** Function that should run once the time runs out. */
   onElaspse?: () => void;
}

/**
 * A generic timer component
 */
export function Timer(props: TimerProps) {
   const { onElaspse } = props;
   const [countdown, { startCountdown }] = useCountdown({
      countStart: props.duration,
      intervalMs: 1000
   });
   const [elapsed, setElapsed] = useState(false);

   const { minutes, seconds } = {
      minutes: Math.floor(countdown / 60),
      seconds: countdown % 60
   };
   useEffect(() => {
      startCountdown();
   }, [startCountdown]);

   useEffect(() => {
      if (minutes === 0 && seconds === 0 && !elapsed) {
         onElaspse?.();
         return () => setElapsed(true);
      }
   }, [minutes, seconds, elapsed, onElaspse]);
   return (
      <div className="border-green-charcoal w-full animate-pop effect-item-1 flex items-center justify-center border-4 shadow-components/shadow rounded-[--default-border-radius] text-[4.34938rem] font-poppins font-bold text-green-charcoal">
         {minutes < 10 ? `0${minutes}` : minutes}:
         {seconds < 10 ? `0${seconds}` : seconds}
      </div>
   );
}
