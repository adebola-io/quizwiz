import { categories, levels } from "@/data";
import { clsxm } from "@/utils/clsxm";
import { useState } from "react";
import { Button, Loader } from "../ui";
// import { useModal } from "@/hooks";

interface QuizStartProps {
   name: keyof typeof categories;
}

export function QuizStart(props: QuizStartProps) {
   // const modal = useModal();
   // const containerRef = useRef<HTMLDivElement>(null);
   const [isLoading, setIsLoading] = useState(false);
   const category = categories[props.name];

   const [imageIsReady, setImageIsReady] = useState(false);
   const [selectedLevel, setSelectedLevel] = useState(0);

   const imageClassName = clsxm(
      "z-0 duration-300 w-[11.625rem]",
      imageIsReady ? "opacity-1 translate-y-0" : "opacity-0 translate-y-[10%]"
   );
   const levelRowClassnames =
      "duration-300 flex relative rounded-[0.35481rem] my-[0.63rem] text-center font-poppins text-[0.625rem] [font-weight:600] border-[3.406px] border-green-charcoal [box-shadow:-2.2706422805786133px_2.2706422805786133px_0px_0px_rgba(70,57,86,0.78)]";
   const levelClassnames =
      "duration-300 w-[70px] py-[0.625rem] flex items-center justify-center relative border-green-charcoal border-r-[2px] cursor-pointer";
   const levelSelectorClassnames =
      "w-[70px] h-full absolute duration-[400ms] ease-in-out";
   const headingClassnames =
      "duration-300 z-0 w-[27rem] [line-height:1.3] font-avenir-next-lt-pro-bold [-webkit-text-fill-color:transparent] bg-clip-text [-webkit-background-clip:text] text-[3.03688rem] text-center";

   function handleClick() {
      setIsLoading(true);
   }

   return (
      <div className="relative w-full flex items-center justify-center flex-col">
         {isLoading ? (
            <div className="absolute w-full h-full flex items-center justify-center">
               <Loader className="animate-pop" />
            </div>
         ) : (
            <></>
         )}
         <div
            style={{ opacity: isLoading ? "0" : "1" }}
            className="h-[11.625rem] mt-[3rem] duration-300"
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
                     onClick={() => setSelectedLevel(index)}
                  >
                     {level.name}
                  </div>
               );
            })}
         </div>
         <p
            style={{ opacity: isLoading ? "0" : "1" }}
            className="duration-300 text-center my-[0.62rem] font-poppins text-[1.03688rem]"
         >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. sunt in culpa qui officia deserunt
            mollit anim id est laborum.
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
   );
}
