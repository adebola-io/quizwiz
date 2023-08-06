import { CategoryName, Quiz } from "@/types";
import { FormEvent, ReactNode, useEffect, useRef, useState } from "react";
import { Timer } from "../ui";
import { levels } from "@/data";
import { useModal } from "@/hooks";
import { Eclipses, QuestionBox, QuizEnd } from ".";

/**
 * A complete quiz flow.
 */
export function QuizBox(props: Quiz) {
   const { questions, level } = props;

   const modal = useModal();
   /** Reference to the next button in a question. */
   const nextButtonRef = useRef<HTMLButtonElement>(null);
   /** Reference to component container. */
   const quizBoxRef = useRef<HTMLDivElement>(null);
   const [index, setIndex] = useState(0);
   const [questionIsFinished, setQuestionIsFinished] = useState(false);
   const [quizEnded, setQuizEnded] = useState(false);
   const [metrics, setMetrics] = useState({
      score: 0,
      correctAnswers: 0,
      missed: 0
   });

   const currentQuestion = questions[index];

   // Effect to end quiz.
   useEffect(() => {
      if (quizEnded) {
         if (!quizBoxRef.current) {
            return;
         }
         const div = quizBoxRef.current;
         div.style.opacity = "0";
         div.ontransitionend = () => {
            div.style.width = "var(--quiz-start-width)";
            div.style.height = "var(--quiz-start-height)";
            div.ontransitionend = () => {
               modal.setContent(
                  <QuizEnd name={props.name as CategoryName} {...metrics} />
               );
            };
         };
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [quizEnded]);

   /**
    * User has answered a question and pressed 'Next', or the time has elapsed.
    * @param e form event.
    */
   const responseHandler = (e: FormEvent) => {
      e.preventDefault();
      setQuestionIsFinished(true);

      const { questionOption: list } = e.target as unknown as {
         questionOption: RadioNodeList;
      };

      const { correctAnswer } = currentQuestion;
      const correctDiv = list.item(correctAnswer)?.parentElement as HTMLElement;

      const selectedAnswer = list.value ? parseInt(list.value.slice(7)) : -1;
      let selectedDiv = list.item(selectedAnswer)?.parentElement ?? null;

      let failed = false;

      if (selectedAnswer === correctAnswer) {
         // Answer is correct.
         setMetrics({
            score: metrics.score + 1,
            correctAnswers: metrics.correctAnswers + 1,
            missed: 0
         });
      } else if (selectedDiv) {
         // Answer is wrong.
         failed = true;
         selectedDiv.classList.add("wrong-option");
      } else {
         // No answer was selected. Mark all other options as wrong.
         failed = true;
         for (const node of list as unknown as NodeListOf<HTMLInputElement>) {
            if (parseInt(node.value.slice(7)) === correctAnswer) continue;

            selectedDiv = node.parentElement as HTMLElement;
            selectedDiv.classList.add("wrong-option");
         }
      }

      if (failed) {
         if (metrics.missed + 1 === 3) {
            setMetrics((m) => ({ ...m, score: m.score - 1, missed: 0 }));
         } else
            setMetrics((m) => ({
               ...m,
               missed: m.missed + 1
            }));
      }

      correctDiv.classList.add("correct-option");
      /// Open next question, or end quiz.
      correctDiv.ontransitionend = () => {
         setTimeout(() => {
            if (index === 19) setQuizEnded(true);
            else {
               // Open next question.
               setIndex(index + 1);
               setQuestionIsFinished(false);
            }
         }, 450);
      };
   };

   /**
    * Time has elapsed.
    */
   const forceFormSubmit = () => {
      const next = nextButtonRef.current;
      if (!next) {
         return;
      }
      next.disabled = false;
      next.click();
   };

   return (
      <>
         <Eclipses name={props.name as CategoryName} />
         <div
            ref={quizBoxRef}
            className="w-[--quiz-width] duration-[--modal-morph-duration] h-[--quiz-height] relative flex items-center max-[785px]:justify-center max-[785px]:flex-col-reverse max-[785px]:gap-[3rem] max-[475px]:gap-[2rem] max-[1024px]:px-6"
         >
            <QuestionBox
               ref={nextButtonRef}
               key={index}
               number={index + 1}
               {...currentQuestion}
               finished={questionIsFinished}
               handler={responseHandler}
               className="max-[785px]:h-fit max-[785px]:w-[75%] max-[475px]:w-full"
            />
            <div className="flex flex-col w-[40%] h-[80%] max-[785px]:h-fit max-[785px]:gap-[3rem] items-center justify-between">
               <Timer
                  key={index}
                  duration={levels[level].timerValue}
                  onElaspse={forceFormSubmit}
                  className="max-[1024px]:text-[3rem] max-[580px]:text-[2rem] max-[475px]:text-[1.6rem] max-[475px]:py-[2rem] max-[475px]:px-[4rem] max-[475px]:bg-white max-[1024px]:w-[80%]"
               />
               <ScoreCount>
                  <span
                     style={{
                        color:
                           metrics.score < 0
                              ? "var(--error-red)"
                              : "var(--green-feldgrau)"
                     }}
                  >
                     {metrics.score}
                  </span>
               </ScoreCount>
            </div>
         </div>
      </>
   );
}

interface ScoreCountProps {
   children: ReactNode;
}

function ScoreCount({ children }: ScoreCountProps) {
   return (
      <div className="border-green-charcoal animate-pop effect-item-3 flex items-center justify-center border-[5px] rounded-[--default-border-radius] text-green-charcoal font-poppins font-bold text-[6.47438rem] max-[1024px]:text-[4rem] max-[475px]:text-[3rem] w-[17.0625rem] h-[11rem] max-[580px]:h-[8rem] max-[485px]:h-fit bg-white shadow-components/smaller-shadow">
         {children}
      </div>
   );
}
