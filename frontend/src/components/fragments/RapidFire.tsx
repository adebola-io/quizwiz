import { Question } from "@/types";
import { Timer } from "../ui";
import { QuestionBox, RapidFireEnd } from ".";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useModal } from "@/hooks";

interface RapidFireProps {
   questions: Question[];
}

export function RapidFire(props: RapidFireProps) {
   const { questions } = props;

   const modal = useModal();
   const [index, setIndex] = useState(0);
   const [score, setScore] = useState(0);
   const [questionsAnswered, setQuestionsAnswered] = useState(0);
   const [quizEnded, setQuizEnded] = useState(false);
   const containerRef = useRef<HTMLDivElement>(null);

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
      } else {
         selectedDiv.classList.add("wrong-option");
      }

      setQuestionsAnswered(questionsAnswered + 1);

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
            className="w-[60%] border-[8px] shadow-none font-poppins text-[4.11394rem] font-normal mb-[2rem] px-[--modal-padding] bg-[#FFD3EE] text-black"
            duration={3 * 60}
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
