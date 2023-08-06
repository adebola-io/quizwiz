import { Question } from "@/types";
import {
   CSSProperties,
   FormEventHandler,
   ForwardedRef,
   forwardRef,
   useRef,
   useState
} from "react";
import { Button } from "../ui";
import { clsxm } from "@/utils/clsxm";
import { Property } from "csstype";

interface QuestionBoxProps extends Question {
   number: number;
   /** Function that should run once a question is answered, or the timer elapses. */
   handler?: FormEventHandler;
   /** Whether or not the question can still be answered. */
   finished?: boolean;
   /** Whether or not the question should be centered, */
   center?: boolean;
   theme?: Property.Color;
   className?: string;
}

const options = "ABCD" as const;

/**
 * A question.
 */
export const QuestionBox = forwardRef(
   (props: QuestionBoxProps, ref: ForwardedRef<HTMLButtonElement>) => {
      const formClassNames = clsxm(
         "flex w-[60%] h-full flex-col justify-center items-end gap-[0.58094rem]",
         props.center ? "text-center items-center w-[70%]" : "",
         props.className
      );

      const optionState = useState(-1);
      return (
         <form
            style={
               {
                  "--outline": props.theme ?? "var(--green-charcoal)"
               } as CSSProperties
            }
            onSubmit={props.handler}
            className={formClassNames}
         >
            <h3 className="animate-pull-from-bottom effect-item-2 [animation-duration:400ms] w-full text-[2rem] min-[2156px]:text-[3.2rem] max-[1024px]:text-[1.6rem] max-[540px]:text-[1rem] font-avenir-next-lt-pro-bold text-green-charcoal">
               {props.number}.{" "}
               <span dangerouslySetInnerHTML={{ __html: props.prompt }}></span>
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
      "before:block before:[content:''] before:absolute before:w-full before:h-full before:[border-color:var(--outline)] before:border-[3.718px] before:rounded-[0.40663rem] before:duration-[--transition-speed] before:translate-x-[--bg-offset-x] before:translate-y-[--bg-offset-y]",
      "[--bg-offset-x:-1%] [--bg-offset-y:10%] [--transition-speed:400ms]",
      "relative w-full mb-2 text-left",
      "animate-fade-in-from-left duration-[--transition-speed] hover:[--bg-offset-x:-0.3%] hover:[--bg-offset-y:3%] hover:scale-[0.96] hover:translate-x-[-3%]",
      `effect-item-${props.index}`,
      props.handler[0] === props.index && "font-bold text-green-viridian"
   );
   const labelClassNames = clsxm(
      "border-green-charcoal bg-white duration-300 relative block font-poppins w-full min-[2160px]:text-[2.2rem] text-[1.21994rem] max-[1366px]:text-[1.2rem] max-[600px]:text-[0.8rem] rounded-[0.40663rem] border-[3.718px] p-[0.58094rem_0.58094rem_0.58094rem_1.33613rem] cursor-pointer",
      props.handler[0] === props.index &&
         "text-white bg-[--outline] border-[4.5px]"
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
            <b className="text-[1.58835rem] min-[2160px]:text-[2.7rem] max-[1366px]:text-[1.3rem] max-[600px]:text-[0.8rem]">
               {props.letter}.{" "}
            </b>
            {props.value}
         </label>
         <input
            ref={inputRef}
            hidden
            className="pr-[5%]"
            type="radio"
            name="questionOption"
            value={`option-${props.index}`}
         />
      </div>
   );
}
