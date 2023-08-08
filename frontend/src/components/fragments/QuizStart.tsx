import { categories, levels } from "@/data";
import { clsxm } from "@/utils/clsxm";
import axios from "@/api";
import { useRef, useState } from "react";
import { Button, Loader } from "../ui";
import {
   CategoryResponse as CategoryQuizResponse,
   Level,
   RandomQuizResponse
} from "@/types";
import { useModal } from "@/hooks";
import { toast } from "react-hot-toast";
import { AxiosError } from "axios";
import { QuizBox } from "./QuizBox";
import { Eclipses } from "./Eclipses";

interface QuizStartProps {
   name: keyof typeof categories;
}

export function QuizStart(props: QuizStartProps) {
   const modal = useModal();
   const [isLoading, setIsLoading] = useState(false);
   const containerRef = useRef<HTMLDivElement>(null);
   const category = categories[props.name];

   const [imageIsReady, setImageIsReady] = useState(false);
   const [selectedLevel, setSelectedLevel] = useState<Level>(0);

   const imageClassName = clsxm(
      "z-0 duration-300 h-full",
      imageIsReady ? "opacity-1 translate-y-0" : "opacity-0 translate-y-[10%]"
   );
   const levelRowClassnames =
      "duration-300 flex relative rounded-[0.35481rem] my-[0.63rem] max-[1024px]:my-[0.5rem] max-[475px]:scale-[0.8] text-center font-poppins text-[0.625rem] [font-weight:600] border-[3.406px] border-green-charcoal [box-shadow:-2.2706422805786133px_2.2706422805786133px_0px_0px_rgba(70,57,86,0.78)]";
   const levelClassnames =
      "duration-300 w-[70px] py-[0.625rem] flex items-center justify-center relative border-green-charcoal border-r-[2px] cursor-pointer";
   const levelSelectorClassnames =
      "w-[70px] h-full absolute duration-[400ms] ease-in-out";
   const headingClassnames =
      "duration-300 z-0 w-[27rem] max-[475px]:w-[80%] [line-height:1.3] font-avenir-next-lt-pro-bold [-webkit-text-fill-color:transparent] bg-clip-text [-webkit-background-clip:text] text-[3.03688rem] max-[1024px]:text-[2rem] text-center";

   function handleClick() {
      setIsLoading(true);
      setTimeout(startQuiz, 400);
   }

   function startQuiz() {
      const isRandom = category.id === 0;
      const endpoint = isRandom
         ? `/question/random/${selectedLevel}`
         : `/category/get/${category.id}/${selectedLevel}`;

      axios
         .get<RandomQuizResponse | CategoryQuizResponse>(endpoint)
         .then(({ data: response }) => {
            const questions = isRandom
               ? (response as RandomQuizResponse).data.questions
               : (response as CategoryQuizResponse).data.quiz.questions;
            return questions;
         })
         .then(
            (questions) =>
               new Promise<typeof questions>((resolve) => {
                  if (!containerRef.current || questions.length < 20) {
                     resolve(questions);
                     return;
                  }
                  const container = containerRef.current;
                  container.style.transitionProperty = "all";
                  container.style.width = "var(--quiz-width)";
                  container.style.minHeight = "var(--quiz-height)";
                  container.ontransitionend = () => resolve(questions);
               })
         )
         .then((questions) => {
            if (questions.length < 20) {
               toast("Coming soon...");
            } else
               modal.setContent(
                  <QuizBox
                     name={props.name}
                     questions={questions}
                     level={selectedLevel}
                  />
               );
         })
         .catch((err: AxiosError) =>
            toast.error(
               err.message ?? "Something went wrong, Please try again."
            )
         )
         .finally(() => setIsLoading(false));
   }

   return (
      <>
         <Eclipses name={props.name} />
         <div
            ref={containerRef}
            className="relative w-[--quiz-start-width] min-h-[--quiz-start-height] duration-[--modal-morph-duration] flex items-center justify-center flex-col"
         >
            {isLoading ? (
               <div className="absolute w-full h-full flex items-center justify-center">
                  <Loader className="animate-pop" />
               </div>
            ) : (
               <></>
            )}
            <div
               style={{ opacity: isLoading ? "0" : "1" }}
               className="h-[11.625rem] max-[1024px]:h-[7rem] mt-[3rem] duration-300"
            >
               <img
                  onLoad={() => setImageIsReady(true)}
                  className={imageClassName}
                  src={category.MainIcon}
                  alt={props.name + " icon"}
               />
            </div>
            <h3
               style={{
                  backgroundImage: category.gradient,
                  opacity: isLoading ? "0" : "1"
               }}
               className={headingClassnames}
            >
               {props.name}.
            </h3>
            {/* Level row */}
            <div
               style={{ opacity: isLoading ? "0" : "1" }}
               className={levelRowClassnames}
            >
               <div
                  className={levelSelectorClassnames}
                  style={{
                     background: levels[selectedLevel].theme,
                     transform: `translateX(${selectedLevel * 100}%)`
                  }}
               ></div>
               {levels.map((level, index) => {
                  const isSelected = selectedLevel === index;
                  const expertIsSelected = isSelected && index === 4;
                  return (
                     <div
                        key={index}
                        className={levelClassnames}
                        style={{
                           color: expertIsSelected ? "white" : "black"
                        }}
                        onClick={() => setSelectedLevel(index as Level)}
                     >
                        {level.name}
                     </div>
                  );
               })}
            </div>
            <p
               style={{ opacity: isLoading ? "0" : "1" }}
               className="duration-300 text-center my-[0.62rem] font-poppins text-[1.03688rem] max-[1024px]:text-[11pt] max-[475px]:text-[0.6rem] max-[1024px]:w-[80%]"
            >
               <span className="block">{category.info}</span>
               <span className="block">
                  You have {levels[selectedLevel].timerValue} seconds for each
                  question, and 20 questions in total.
               </span>
               <span className="block font-bold">
                  Failing 2 questions in a row will result in a penalty.
               </span>
               <span className="block">Are you ready?</span>
            </p>
            <Button
               className="mb-[3rem]"
               style={{
                  backgroundImage: category.gradient,
                  color: "white",
                  opacity: isLoading ? "0" : "1"
               }}
               onClick={handleClick}
            >
               Start
            </Button>
         </div>
      </>
   );
}
