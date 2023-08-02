import { useEffect, useRef } from "react";
import { CategoryName } from "@/types";
import { Button } from "../ui";
import { categories } from "@/data";
import { useAuth, useModal } from "@/hooks";
import { Eclipses, QuizStart } from ".";

interface QuizEndProps {
   name: CategoryName;
   score: number;
   correctAnswers: number;
}

export function QuizEnd(props: QuizEndProps) {
   const { updateStats } = useAuth();
   const { score, correctAnswers } = props;
   const category = categories[props.name];
   const percent = (correctAnswers / 20) * 100;

   const modal = useModal();
   const containerRef = useRef<HTMLDivElement>(null);

   function startAgain() {
      const container = containerRef.current;
      if (!container) return;

      container.style.opacity = "0";
      container.ontransitionend = () => {
         modal.setContent(<QuizStart name={props.name} />);
         modal.morph({
            className: "aspect-auto min-h-[max-content]"
         });
      };
   }

   useEffect(() => {
      updateStats({ quizResult: percent, starsEarned: score });
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [score, correctAnswers, percent]);

   return (
      <>
         <Eclipses name={props.name} />
         <div
            ref={containerRef}
            className="w-[--quiz-start-width] h-[--quiz-start-height] duration-500 flex flex-col items-center gap-[1.875rem] justify-center"
         >
            <h4 className="text-green-feldgrau text-center text-[3.03688rem] font-avenir-next-lt-pro-bold">
               Quiz Ended.
            </h4>
            <div
               className="animate-pop effect-item-1 w-[75%] aspect-[1.8] rounded-[1.05194rem] p-[0.5rem]"
               style={{
                  background: category.gradient,
                  boxShadow:
                     "-11.037006378173828px 11.037006378173828px 0px 0px rgba(1, 45, 0, 0.59)"
               }}
            >
               <output className="w-full h-full rounded-[1.00194rem] bg-white flex items-center justify-center text-[8.31844rem] font-avenir-next-lt-pro-bold">
                  <span
                     style={{
                        backgroundImage: category.gradient
                     }}
                     className="[-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent]"
                  >
                     {score > 0 ? `+${score}` : score}
                  </span>
               </output>
            </div>
            <p className="font-poppins text-[1.22438rem] text-center text-black">
               {score === 0
                  ? "This quiz has ended with no benefit or loss. Play again to gain some stars!"
                  : score > 0
                  ? `${
                       percent > 60 ? "Great job!" : ""
                    } You answered ${correctAnswers}/20 questions correctly, and gained ${score} star${
                       score > 1 ? "s" : ""
                    }.`
                  : `You have lost ${score * -1} star${
                       score < -1 ? "s" : ""
                    }. Play again to gain ${score < -1 ? "them" : "it"} back!`}
            </p>
            <Button onClick={startAgain} style={{ color: "white" }}>
               Play Again
            </Button>
         </div>
      </>
   );
}
