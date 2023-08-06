import { clsxm } from "@/utils/clsxm";
import { useEffect, useState } from "react";

type HijackerCallback = (currentTimerValue: number) => number;

interface TimerProps {
   /** How long the timer should count, in seconds. */
   duration: number;
   /** Function that should run once the time runs out. */
   onElaspse?: () => void;
   className?: string;
   /** Function to edit and change the timer value when a key changes. */
   hijacker?: [React.Key, HijackerCallback];
}

/**
 * A generic timer component
 */
export function Timer(props: TimerProps) {
   const { onElaspse, hijacker } = props;
   const [hijackerKey, hijackerCallback] = hijacker ?? [];

   const className = clsxm(
      "w-full flex items-center justify-center",
      "border-green-charcoal border-4 shadow-components/shadow rounded-[--default-border-radius]",
      "text-[4.34938rem] font-poppins font-bold text-green-charcoal",
      "animate-pop effect-item-1",
      props.className
   );

   const [countdown, setCountdown] = useState(props.duration);

   const { minutes, seconds } = {
      minutes: Math.floor(countdown / 60),
      seconds: countdown % 60
   };

   useEffect(() => {
      const interval = setInterval(() => {
         setCountdown((c) => c - 1);
      }, 1000);
      return () => clearInterval(interval);
   }, []);

   useEffect(() => {
      setCountdown(hijackerCallback?.(countdown) ?? countdown);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [hijackerKey]);

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
