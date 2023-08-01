import { CategoryName, Question, Quiz } from "@/types";
import {
   FormEvent,
   FormEventHandler,
   ForwardedRef,
   ReactNode,
   forwardRef,
   useRef,
   useState
} from "react";
import { Button, Timer } from "../ui";
import { clsxm } from "@/utils/clsxm";
import { levels } from "@/data";
import { useModal } from "@/hooks";
import { Eclipses, QuizEnd } from ".";

/**
 * A complete quiz flow.
 */
export function QuizBox(props: Quiz) {
   const { questions, level } = props;

   const modal = useModal();
   const [openQuestion, setOpenQuestion] = useState(0);
   const [questionIsFinished, setQuestionIsFinished] = useState(false);
   const [score, setScore] = useState(0);
   const [correctAnswers, setCorrectAnswers] = useState(0);
   /** Reference to the next button in a question. */
   const nextButtonRef = useRef<HTMLButtonElement>(null);
   const quizBoxRef = useRef<HTMLDivElement>(null);

   const currentQuestion = questions[openQuestion];

   /**
    * User has answered a question and pressed 'Next', or the time has elapsed.
    * @param event form event.
    */
   function handleQuestionAnswering(event: FormEvent) {
      event.preventDefault();
      const target = event.target as unknown as {
         questionOption: RadioNodeList;
      };

      const correctAnswer = currentQuestion.correctAnswer;
      const nodeList = target.questionOption;
      const correctAnswerContainer = nodeList.item(correctAnswer)
         ?.parentElement as HTMLElement;

      let selectedAnswerContainer: HTMLLabelElement | undefined = undefined;
      for (const node of nodeList) {
         const _node = node as HTMLInputElement;
         // Skip unselected answers.
         if (!_node.checked) continue;

         setQuestionIsFinished(true);
         const selectedOption = parseInt(_node.value.slice(7));

         selectedAnswerContainer = node.parentElement as HTMLLabelElement;

         // Answer is correct.
         if (selectedOption === correctAnswer) {
            setScore(score + 1);
            setCorrectAnswers(correctAnswers + 1);
         } else {
            // Answer is wrong.
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
      /// Open next question, or end quiz.
      correctAnswerContainer.ontransitionend = () => {
         setTimeout(() => {
            if (openQuestion === 5) {
               endQuiz();
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

   /**
    * End quiz flow.
    */
   function endQuiz() {
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
               <>
                  <Eclipses name={props.name as CategoryName} />
                  <QuizEnd
                     correctAnswers={correctAnswers + 1}
                     name={props.name as CategoryName}
                     score={score + 1}
                  />
               </>
            );
         };
      };
   }

   return (
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
               <span>{score}</span>
            </ScoreCount>
         </div>
      </div>
   );
}

interface QuestionBoxProps extends Question {
   number: number;
   /** Function that should run once a question is answered, or the timer elapses. */
   handler?: FormEventHandler;
   /** Whether or not the question can still be answered. */
   finished?: boolean;
}

const options = "ABCD" as const;

/**
 * A question.
 */
const QuestionBox = forwardRef(
   (props: QuestionBoxProps, ref: ForwardedRef<HTMLButtonElement>) => {
      const optionState = useState(-1);

      return (
         <form
            onSubmit={props.handler}
            className="flex w-[60%] h-full flex-col justify-center items-end gap-[0.58094rem]"
         >
            <h3 className="animate-pull-from-bottom effect-item-2 [animation-duration:400ms] w-full text-[2.51019rem] font-avenir-next-lt-pro-bold text-green-charcoal">
               {`${props.number}. ${props.prompt}`}
            </h3>
            {props.options.map((value, index) => (
               <Option
                  handler={optionState}
                  key={index}
                  index={index}
                  letter={options[index]}
                  value={value}
               />
            ))}
            <Button
               ref={ref}
               type="submit"
               disabled={optionState[0] === -1 || props.finished}
               variant="outlined"
               className="w-fit"
            >
               Next
            </Button>
         </form>
      );
   }
);

interface OptionProps {
   index: number;
   letter: string;
   value: string;
   handler: [number, React.Dispatch<React.SetStateAction<number>>];
}

/**
 * An option in a question.
 */
function Option(props: OptionProps) {
   const inputRef = useRef<HTMLInputElement>(null);
   const containerClassnames = clsxm(
      "before:block before:[content:''] before:absolute before:w-full before:h-full before:[border-color:var(--outline-color)] before:border-[3.718px] before:rounded-[0.40663rem] before:duration-[--transition-speed] before:translate-x-[--bg-offset-x] before:translate-y-[--bg-offset-y]",
      "[--bg-offset-x:-1%] [--bg-offset-y:10%] [--transition-speed:400ms] [--outline-color:var(--green-charcoal)]",
      "relative w-full mb-2",
      "animate-fade-in-from-left duration-[--transition-speed] hover:[--bg-offset-x:-0.3%] hover:[--bg-offset-y:3%] hover:scale-[0.96] hover:translate-x-[-3%]",
      `effect-item-${props.index}`,
      props.handler[0] === props.index &&
         "[--outline-color:var(--green-feldgrau)] font-bold text-green-viridian"
   );
   const labelClassNames = clsxm(
      "border-green-charcoal bg-white duration-300 relative block font-poppins w-full text-[1.21994rem] rounded-[0.40663rem] border-[3.718px] p-[0.58094rem_0.58094rem_0.58094rem_1.33613rem] cursor-pointer",
      props.handler[0] === props.index &&
         "text-white bg-[--outline-color] border-[4.5px]"
   );

   function handleClick() {
      props.handler[1](props.index);
      if (inputRef.current) {
         inputRef.current.checked = true;
      }
   }

   return (
      <div className={containerClassnames}>
         <label onClick={handleClick} className={labelClassNames}>
            <b className="text-[1.58835rem]">{props.letter}. </b>
            {props.value}
         </label>
         <input
            ref={inputRef}
            hidden
            type="radio"
            name="questionOption"
            value={`option-${props.index}`}
         />
      </div>
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
