import { LandingPageDiagrams } from "@/components/fragments";
import { Header } from "@/components/global";
import { Button } from "@/components/ui";
import "./LandingPage.css";

export function LandingPage() {
   return (
      <>
         <Header />
         <main className="flex h-screen">
            <LandingPageDiagrams />
            <section className="flex pl-[3.75rem] flex-col gap-[0.94rem] items-end pr-[--global-padding-left] justify-center lines w-[50%] h-full">
               <div className="landing_page_headline_text">
                  <span className="first"> HOW MUCH DO YOU</span>{" "}
                  <span className="inline-flex w-min justify-end text-right border-b-[6px] border-green-viridian">
                     <span className="second">KNOW?</span>
                  </span>
               </div>
               <p className="landing_page_paragraph">
                  Challenge your inner genius with captivating quizzes spanning
                  an impressive spectrum of topics. From history's enigmatic
                  mysteries to the marvels of science, from the captivating
                  world of literature to the magic of pop culture - there's
                  something for every inquisitive soul.
               </p>
               <div className="flex gap-[1.4375rem]">
                  <Button as="link" to="/login">
                     Get Started
                  </Button>
                  <Button className="text-green-charcoal">Learn More</Button>
               </div>
            </section>
         </main>
      </>
   );
}
