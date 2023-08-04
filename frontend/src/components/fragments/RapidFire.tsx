import { Question } from "@/types";
import { Timer } from "../ui";
import { QuestionBox, RapidFireEnd } from ".";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useModal } from "@/hooks";
import { toast } from "react-hot-toast";

interface RapidFireProps {
   questions: Question[];
}

export function RapidFire(props: RapidFireProps) {
   const { questions } = props;

   const modal = useModal();
   const [index, setIndex] = useState(0);
   const [score, setScore] = useState(0);
   const [questionsAnswered, setQuestionsAnswered] = useState(0);
   const [streak, setStreak] = useState(0);
   const [timerValueChanged, setTimerValueChanged] = useState(0);
   const [quizEnded, setQuizEnded] = useState(false);
   const [streakIsPossible, setStreakIsPossible] = useState(false);
   const containerRef = useRef<HTMLDivElement>(null);

   // Effect to run once rapid fire ends.
   useEffect(() => {
      if (quizEnded && containerRef.current) {
         const div = containerRef.current;
         div.style.opacity = "0";
         div.ontransitionend = () => {
            div.style.width = "var(--quiz-start-width)";
            div.style.height = "var(--quiz-start-height)";
            div.ontransitionend = () => {
               modal.setContent(
                  <RapidFireEnd
                     questionsAnswered={questionsAnswered}
                     score={score}
                  />
               );
            };
         };
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [quizEnded]);

   // Effect to constrain a streak to 20 seconds.
   useEffect(() => {
      if (streakIsPossible) {
         const timeout = setTimeout(() => {
            setStreakIsPossible(false);
            setStreak(0);
         }, 25000);
         return () => clearTimeout(timeout);
      }
   }, [streakIsPossible]);

   const currentQuestion = questions[index];

   const responseHandler = (e: FormEvent) => {
      e.preventDefault();
      const { questionOption: list } = e.target as unknown as {
         questionOption: RadioNodeList;
      };
      const { correctAnswer } = currentQuestion;
      const selectedAnswer = parseInt(list.value.slice(7));
      const correctDiv = list.item(correctAnswer)?.parentElement as HTMLElement;
      const selectedDiv = list.item(selectedAnswer)
         ?.parentElement as HTMLElement;

      if (correctDiv === selectedDiv) {
         setScore(score + 1);
         if (!streakIsPossible) setStreakIsPossible(true);
         setStreak(streak + 1);
      } else {
         selectedDiv.classList.add("wrong-option");
         setStreakIsPossible(false);
         setStreak(0);
      }

      setQuestionsAnswered(questionsAnswered + 1);

      if (streak === 9 && streakIsPossible) {
         setTimerValueChanged(timerValueChanged + 1);
         toast.success("You're fast! Ten seconds added! 🤩");
         setStreakIsPossible(false);
      }

      correctDiv.classList.add("correct-option");
      correctDiv.ontransitionend = () => {
         const limit = questions.length - 1;
         if (index === limit) {
            setQuizEnded(true);
         } else
            setTimeout(() => {
               setIndex(index + 1);
            }, 200);
      };
   };

   return (
      <div
         ref={containerRef}
         className="background_rapidfire flex flex-col justify-center items-center h-[--rapid-fire-height] w-[--rapid-fire-width] duration-[600ms] p-[--modal-padding]"
      >
         <Timer
            hijacker={[timerValueChanged, (countdown) => countdown + 10]}
            className="w-[60%] border-[8px] shadow-none font-poppins text-[4.11394rem] font-normal mb-[2rem] px-[--modal-padding] bg-[#FFD3EE] text-black"
            duration={4 * 60 - 10}
            onElaspse={() => setQuizEnded(true)}
         />
         <QuestionBox
            center
            key={index}
            theme="var(--purple-eggplant)"
            number={index + 1}
            {...currentQuestion}
            handler={responseHandler}
         />
      </div>
   );
}
