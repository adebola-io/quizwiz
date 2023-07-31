import { LandingPageDiagrams } from "@/components/fragments";
import { Button } from "@/components/ui";
import "./LandingPage.css";

export default function LandingPage() {
   return (
      <main className="page_with_header flex items-center min-h-screen lines">
         <LandingPageDiagrams />
         <section className="flex w-full px-8 xl:pl-[3.75rem] flex-col gap-12 xl:gap-16 items-end xl:pr-[--global-padding-left] justify-center lg:w-[50%] h-full py-10">
            <div className="landing_page_headline_text animate-fade-in-from-left effect-item-0 text-xl lg:text-xl leading-[4rem] xl:text-[5rem] 2xl:text-[7.625rem] lg:leading-[6rem] xl:leading-[7rem] 2xl:leading-[9.4rem]">
               <span className="first"> HOW MUCH DO YOU</span>{" "}
               <span className="inline-flex w-min justify-end text-right border-b-[6px] border-green-viridian">
                  <span className="second">KNOW?</span>
               </span>
            </div>
            <p className="landing_page_paragraph animate-fade-in-from-left effect-item-1 text-sm md:text-base md:leading-6 lg:text-sm xl:text-base xl:leading-7">
               Challenge your inner genius with captivating quizzes spanning an
               impressive spectrum of topics. From history's enigmatic mysteries
               to the marvels of science, from the captivating world of
               literature to the magic of pop culture - there's something for
               every inquisitive soul.
            </p>
            <div className="flex flex-col md:flex-row gap-[1.4375rem] animate-fade-in-from-left effect-item-2 w-full justify-end">
               <Button
                  as="link"
                  to="/auth/sign-up"
                  className="w-full sm:w-auto"
               >
                  Get Started
               </Button>
               <Button variant="outlined" className="w-full sm:w-auto">
                  Learn More
               </Button>
            </div>
         </section>
      </main>
   );
}
