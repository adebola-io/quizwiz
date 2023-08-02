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
   const [openQuestion, setOpenQuestion] = useState(0);
   const [questionIsFinished, setQuestionIsFinished] = useState(false);
   const [quizEnded, setQuizEnded] = useState(false);

   const [metrics, setMetrics] = useState({
      score: 0,
      correctAnswers: 0,
      missed: 0
   });

   /** Reference to the next button in a question. */
   const nextButtonRef = useRef<HTMLButtonElement>(null);
   const quizBoxRef = useRef<HTMLDivElement>(null);

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

   const currentQuestion = questions[openQuestion];

   /**
    * User has answered a question and pressed 'Next', or the time has elapsed.
    * @param event form event.
    */
   function handleQuestionAnswering(event: FormEvent) {
      event.preventDefault();
      const { questionOption: nodeList } = event.target as unknown as {
         questionOption: RadioNodeList;
      };

      const { correctAnswer } = currentQuestion;
      const correctAnswerContainer = nodeList.item(correctAnswer)
         ?.parentElement as HTMLElement;

      let selectedAnswerContainer: HTMLLabelElement | undefined = undefined;
      let failed = false;

      for (const node of nodeList) {
         const _node = node as HTMLInputElement;
         // Skip unselected answers.
         if (!_node.checked) continue;

         setQuestionIsFinished(true);
         const selectedOption = parseInt(_node.value.slice(7));

         selectedAnswerContainer = node.parentElement as HTMLLabelElement;

         // Answer is correct.
         if (selectedOption === correctAnswer) {
            setMetrics({
               score: metrics.score + 1,
               correctAnswers: metrics.correctAnswers + 1,
               missed: 0
            });
         } else {
            // Answer is wrong.
            failed = true;
            selectedAnswerContainer.style.setProperty(
               "--outline-color",
               "var(--error-red-secondary)"
            );
            selectedAnswerContainer.classList.add("wrong-option");
         }
         break;
      }

      // No answer was selected. Mark all other options as wrong.
      if (selectedAnswerContainer === undefined) {
         failed = true;
         for (const node of nodeList) {
            const _node = node as HTMLInputElement;
            if (parseInt(_node.value.slice(7)) === correctAnswer) continue;

            selectedAnswerContainer = node.parentElement as HTMLLabelElement;
            selectedAnswerContainer.style.setProperty(
               "--outline-color",
               "var(--error-red-secondary)"
            );
            selectedAnswerContainer.classList.add("wrong-option");
         }
      }

      correctAnswerContainer.classList.add("correct-option");

      if (failed) {
         if (metrics.missed + 1 === 3) {
            setMetrics((m) => ({ ...m, score: m.score - 1, missed: 0 }));
         } else
            setMetrics((m) => ({
               ...m,
               missed: m.missed + 1
            }));
      }

      /// Open next question, or end quiz.
      correctAnswerContainer.ontransitionend = () => {
         setTimeout(() => {
            if (openQuestion === 5) {
               setQuizEnded(true);
            } else {
               // Open next question.
               setOpenQuestion(openQuestion + 1);
               setQuestionIsFinished(false);
            }
         }, 450);
      };
   }

   /**
    * Time has elapsed.
    */
   function forceFormSubmit() {
      const next = nextButtonRef.current;
      if (!next) {
         return;
      }
      next.disabled = false;
      next.click();
   }

   return (
      <>
         <Eclipses name={props.name as CategoryName} />
         <div
            ref={quizBoxRef}
            className="w-[--quiz-width] duration-500 h-[--quiz-height] relative flex items-center gap-[3rem]"
         >
            <QuestionBox
               ref={nextButtonRef}
               key={openQuestion}
               number={openQuestion + 1}
               {...currentQuestion}
               finished={questionIsFinished}
               handler={handleQuestionAnswering}
            />
            <div className="flex flex-col w-[40%] h-[80%] items-center justify-between">
               <Timer
                  key={openQuestion}
                  duration={levels[level].timerValue}
                  onElaspse={forceFormSubmit}
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
      <div className="border-green-charcoal animate-pop effect-item-3 flex items-center justify-center border-[5px] rounded-[--default-border-radius] text-green-charcoal font-poppins font-bold text-[6.47438rem] w-[17.0625rem] h-[11rem] bg-white shadow-components/smaller-shadow">
         {children}
      </div>
   );
}
