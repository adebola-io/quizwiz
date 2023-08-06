import { Button } from "../ui";
import LightningBolt from "@/assets/icons/lightning-bolt.svg";
import MainBolt from "@/assets/icons/bolt.png";
import { useModal } from "@/hooks";
import { useRef, useState } from "react";
import axios from "@/api";
import { Question, RapidFireResponse } from "@/types";
import { RapidFire } from ".";
import { toast } from "react-hot-toast";

export function RapidFireStart() {
   const modal = useModal();
   const containerRef = useRef<HTMLDivElement>(null);
   const [isLoading, setIsLoading] = useState(false);

   function handleStart() {
      setIsLoading(true);
      axios
         .get<RapidFireResponse>("/question/rpdfire")
         .then(({ data }) => {
            const { questions } = data.data;
            if (questions.length === 0) {
               toast(
                  "You have played Rapid fire today. Check back again tomorrow! 💫"
               );
            } else startRapidFire(questions);
         })
         .catch(() => {})
         .finally(() => setIsLoading(false));
   }

   /**
    * Animate container and start the rapid fire quiz.
    */
   function startRapidFire(questions: Question[]) {
      if (!containerRef.current) return;
      const container = containerRef.current;
      container.style.opacity = "0";
      container.ontransitionend = () => {
         container.style.width = "var(--rapid-fire-width)";
         container.style.height = "var(--rapid-fire-height)";
         container.ontransitionend = () => {
            modal.setContent(<RapidFire questions={questions} />);
         };
      };
   }
   return (
      <div
         ref={containerRef}
         className="relative w-[--rapid-fire-start-width] overflow-hidden pl-[--modal-padding] max-[475px]:pr-[--modal-padding] h-[--rapid-fire-start-height] duration-[--modal-morph-duration] gap-[0.625rem] flex flex-col justify-center max-[475px]:items-center"
      >
         <h1 className="relative z-10 text-fine-purple font-avenir-next-lt-pro-bold text-[3.91188rem] max-[1024px]:text-[3rem] max-[600px]:text-[2.2rem] max-[475px]:text-center">
            Rapid Fire.
         </h1>
         <p className="relative z-10 text-[1.03688rem] max-[768px]:text-[0.8rem] max-[720px]:text-[1rem] max-[600px]:text-[0.6rem] max-[475px]:text-[0.8rem] max-[475px]:text-center font-poppins text-black w-[45%] max-[475px]:w-full ">
            Answer as many questions as you can, as fast as possible. Receive
            extra time with every streak, and incur no penalties for wrong
            answers.
         </p>
         <Button
            onClick={handleStart}
            isLoading={isLoading}
            style={{
               position: "relative",
               zIndex: "10",
               color: "white",
               backgroundColor: "var(--heat-wave)",
               width: "8.8125rem"
            }}
         >
            Start
         </Button>
         <RapidFireBanner />
      </div>
   );
}

function RapidFireBanner() {
   const emptyArray1 = Array(13).fill(null);
   const emptyArray2 = Array(13).fill(null);
   return (
      <div className="absolute right-0 bottom-0 flex items-center justify-center w-[50%] max-[720px]:right-[-10%] max-[475px]:hidden h-full">
         {/* Overlay */}
         <div className="absolute overflow-hidden border-l-[5px] border-l-purple-raisin-black shadow-text-depth bg-fine-purple flex flex-col justify-center h-[100vh] min-h-[1024px] duration-300 w-[150%] rotate-[22deg] translate-x-[25%]">
            {emptyArray1.map((_, i) => (
               <div
                  key={i}
                  className={`flex rotate-[-22deg] mb-1 ${
                     i % 2 === 0 ? "translate-x-[-10%]" : "translate-x-[-10%]"
                  }`}
               >
                  {emptyArray2.map((_, j) => (
                     <img
                        key={`${i}-${j}`}
                        className="opacity-[0.5]"
                        src={LightningBolt}
                        alt="*"
                     />
                  ))}
               </div>
            ))}
         </div>
         <div
            style={{
               background:
                  "var(--gradients-rapid-fire-four, linear-gradient(220deg, #FFF500 0%, #FF7A00 100%))"
            }}
            className="relative flex h-[35%] max-[1024px]:h-[45%] max-[720px]:h-[30%] hover:rotate-[-12deg] hover:shadow duration-500 border-purple-raisin-black border-[5px] shadow-screens/shadow aspect-square rounded-[50%] items-center justify-center"
         >
            <img className="h-[60%]" src={MainBolt} alt="*" />
         </div>
      </div>
   );
}
