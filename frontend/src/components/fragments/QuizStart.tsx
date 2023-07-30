import { categories, levels } from "@/data";
import { clsxm } from "@/utils/clsxm";
import { useState } from "react";
import { Button } from "../ui";

interface QuizStartProps {
   name: keyof typeof categories;
}

export function QuestionStart(props: QuizStartProps) {
   const category = categories[props.name];

   const [imageIsReady, setImageIsReady] = useState(false);
   const [selectedLevel, setSelectedLevel] = useState(0);

   const imageClassName = clsxm(
      "z-0 duration-300 w-[11.625rem]",
      imageIsReady ? "opacity-1 translate-y-0" : "opacity-0 translate-y-[10%]"
   );
   const levelRowClassnames =
      "flex rounded-[0.35481rem] my-[0.63rem] border-[3.406px] border-green-charcoal [box-shadow:-2.2706422805786133px_2.2706422805786133px_0px_0px_rgba(70,57,86,0.78)]";
   const levelClassnames =
      "duration-300 p-[0.625rem_1.275rem] border-green-charcoal border-r-[2px] cursor-pointer text-center font-poppins text-[0.625rem] [font-weight:600]";
   const headingClassnames =
      "z-0 w-[27rem] [line-height:1.3] font-avenir-next-lt-pro-bold [-webkit-text-fill-color:transparent] bg-clip-text [-webkit-background-clip:text] text-[3.03688rem] text-center";

   return (
      <div className="w-full flex items-center justify-center flex-col">
         <div className="h-[11.625rem] mt-[3rem]">
            <img
               onLoad={() => setImageIsReady(true)}
               className={imageClassName}
               src={category.MainIcon}
               alt={props.name + " icon"}
            />
         </div>
         <h3
            style={
               {
                  backgroundImage: category.gradient
               } as React.CSSProperties
            }
            className={headingClassnames}
         >
            {props.name}.
         </h3>
         {/* Level row */}
         <div className={levelRowClassnames}>
            {levels.map((level, index) => {
               const isSelected = selectedLevel === index;
               const expertIsSelected = isSelected && index === 4;
               return (
                  <div
                     key={index}
                     className={levelClassnames}
                     style={{
                        background: isSelected ? level.theme : undefined,
                        color: expertIsSelected ? "white" : "black"
                     }}
                     onClick={() => setSelectedLevel(index)}
                  >
                     {level.name}
                  </div>
               );
            })}
         </div>
         <p className="text-center my-[0.62rem] font-poppins text-[1.03688rem]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. sunt in culpa qui officia deserunt
            mollit anim id est laborum.
         </p>
         <Button
            className="mb-[3rem]"
            style={{ backgroundImage: category.gradient, color: "white" }}
         >
            Start
         </Button>
      </div>
   );
}
