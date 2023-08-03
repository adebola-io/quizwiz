import { Question } from "@/types";
import { Timer } from "../ui";
import { QuestionBox } from ".";
import { FormEvent, useState } from "react";

interface RapidFireProps {
   questions: Question[];
}

export function RapidFire(props: RapidFireProps) {
   const { questions } = props;
   const [index, setIndex] = useState(0);

   const currentQuestion = questions[index];

   const responseHandler = (e: FormEvent) => {
      e.preventDefault();
      setIndex(index + 1);
   };

   return (
      <div className="flex flex-col justify-center items-center h-[--rapid-fire-height] w-[--rapid-fire-width]">
         <Timer
            className="w-[60%] border-[8px] shadow-none font-poppins text-[5.11394rem] font-normal px-[--modal-padding] bg-[#FFD3EE] text-black"
            duration={3 * 60}
         />
         <QuestionBox
            center
            key={index}
            number={index + 1}
            {...currentQuestion}
            handler={responseHandler}
         />
      </div>
   );
}
