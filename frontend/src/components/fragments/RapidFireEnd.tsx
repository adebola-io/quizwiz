import { useAuth, useModal } from "@/hooks";
import { Eclipses } from ".";
import { Button } from "../ui";
import { useEffect } from "react";

interface RapidFireEndProps {
   score: number;
   questionsAnswered: number;
}

export function RapidFireEnd(props: RapidFireEndProps) {
   const { updateRapidFire } = useAuth();
   const modal = useModal();

   const { score, questionsAnswered } = props;
   const percent = (score / questionsAnswered) * 100;

   useEffect(() => {
      updateRapidFire({ quizResult: percent, starsEarned: score });
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [score, percent]);

   return (
      <>
         <Eclipses rapidFire />
         <div className="flex flex-col items-center justify-center gap-[1.5rem] w-[--quiz-start-width] h-[--quiz-start-height] ">
            <h3
               style={{
                  background:
                     "var(--gradients-rapid-fire-one, linear-gradient(180deg, #FFF615 0%, #DB8300 100%))",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  WebkitTextStrokeColor: "var(--fine-purple)",
                  WebkitTextStrokeWidth: "5.73px"
               }}
               className="text-[12.92006rem] font-avenir-next-lt-pro-bold text-center leading-[14rem] animate-pop"
            >
               {score > 0 ? "+" : ""}
               {score}
            </h3>
            <p className="text-[1.22438rem] w-[70%] font-poppins text-black text-center">
               {`${
                  score > 0 ? "Excellent! " : ""
               }You have gained ${score} star${
                  score !== 1 ? "s" : ""
               } today. Don't forget to check
               back in tomorrow!`}
            </p>
            <Button
               onClick={() => modal.close()}
               style={{
                  backgroundColor: "var(--royal-red, #C00073)",
                  color: "white"
               }}
               className="border-purple-raisin-black border-[3.413px] rounded-[0.4375rem] "
            >
               Finish
            </Button>
         </div>
      </>
   );
}
