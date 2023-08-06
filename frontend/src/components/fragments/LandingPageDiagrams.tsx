import shape from "../../assets/shape.svg";

export function LandingPageDiagrams() {
   return (
      <section className="landing_page_diagrams relative flex items-center justify-center overflow-hidden h-full w-[50%] bg-green-feldgrau border-r-[5px] border-solid border-green-charcoal shadow-inner-shadow">
         <QuestionBackground />
         <Eclipse top="-23.5rem" right="-22.5625rem" />
         <Eclipse bottom="-22.4375rem" left="-23.75rem" />
         <img
            src={shape}
            className="z-[2] animate-pop hover:rotate-[-20deg] duration-500"
            alt="0"
         />
      </section>
   );
}

function Eclipse(
   props: Partial<{
      top: string;
      right: string;
      bottom: string;
      left: string;
   }>
) {
   return (
      <div
         style={{
            ...props
         }}
         className={`eclipse absolute z-2 w-[43.75rem] aspect-square bg-green-viridian border-[5px] border-solid border-green-charcoal shadow-image-depth rounded-[50%]`}
      ></div>
   );
}

function QuestionBackground() {
   const a = Array(15).fill(null);
   const b = Array(30).fill(null);
   return (
      <div className="absolute rotate-3 z-0 w-full h-full overflow-hidden">
         {a.map((_, index) => (
            <div
               key={index}
               className={`gap-5 animate-infinite-scroll flex h-[8.91319rem]`}
            >
               {b.map((_, index) => (
                  <span
                     key={index}
                     className={` text-green-hookers-green font-poppins text-[6.5288rem] [font-weight:700]`}
                  >
                     ?
                  </span>
               ))}
            </div>
         ))}
      </div>
   );
}
