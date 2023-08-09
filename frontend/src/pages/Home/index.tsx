import { Banner, Button, Metric } from "@/components/ui";
import { useAuth, useModal } from "@/hooks";
import RpdFireBanner from "@/assets/RapidFireBanner.png";
import {
   CategoryList,
   QuizStart,
   RapidFireStart
} from "@/components/fragments";
import Dice from "@/assets/icons/Dice.png";
import QuizMetricIcon from "@/assets/icons/quiz-metric.png";
import StarMetricIcon from "@/assets/icons/star-metric.png";
import SuccessMetricIcon from "@/assets/icons/success-metric.png";
import "./Home.css";

/**
 * @protected
 * User homepage.
 */
export default function Home() {
   const { user } = useAuth();
   const modal = useModal();

   if (!user) return <></>;
   const { quizzesPlayed, stars, successRate } = user;

   const metricImageClassNames =
      "w-[25%] min-[1900px]:h-[60%] min-[1900px]:w-auto max-[720px]:h-[130%] max-[720px]:w-auto max-[720px]:absolute max-[720px]:right-0 max-[720px]:translate-x-[30%] max-[720px]:rotate-[-13deg] max-[720px]:opacity-[0.6]";

   function openRapidFireStart() {
      modal.setContent(<RapidFireStart />);
      modal.morph({
         style: {
            padding: 0,
            maxHeight: "fit-content",
            minHeight: "0px",
            aspectRatio: "auto"
         }
      });
      modal.open({ closeOnClickOutside: false });
   }

   function openRandomQuiz() {
      modal.setContent(<QuizStart name="Random Quiz" />);
      modal.morph({
         className: "aspect-auto min-h-[max-content] max-[1024px]:p-0"
      });
      modal.open({ closeOnClickOutside: false });
   }

   return (
      <>
         <main className="page_with_header relative min-h-screen pl-[--sidebar-width] max-[912px]:pl-0">
            <div className="p-[3vh_var(--global-padding-left)_0rem_2.5rem] max-[540px]:px-6">
               <div className="flex mb-[2.04rem] w-full justify-between max-[720px]:flex-col max-[720px]:gap-7">
                  <Metric
                     className="animate-drop-from-top effect-item-0"
                     name={`quiz${quizzesPlayed !== 1 ? "zes" : ""} played`}
                     value={quizzesPlayed}
                     icon={
                        <img
                           className={metricImageClassNames}
                           src={QuizMetricIcon}
                           alt="Quiz icon"
                        />
                     }
                  />
                  <Metric
                     className="animate-drop-from-top effect-item-2"
                     name={`star${stars !== 1 ? "s" : ""}`}
                     value={stars}
                     icon={
                        <img
                           className={metricImageClassNames}
                           src={StarMetricIcon}
                           alt="Star icon"
                        />
                     }
                  />
                  <Metric
                     name="success rate"
                     className="animate-drop-from-top effect-item-4"
                     value={successRate.toFixed(1)}
                     percent
                     icon={
                        <img
                           className={metricImageClassNames}
                           src={SuccessMetricIcon}
                           alt="Success Rate icon"
                        />
                     }
                  />
               </div>
               <Banner
                  className="mb-[2.04rem] animate-fade-in-from-left effect-item-2"
                  rightCornerImage={RpdFireBanner}
               >
                  <h1 className="max-[768px]:w-[75%] min-[1900px]:w-[60%] text-[30pt] min-[2160px]:text-[4rem] max-[1280px]:text-[1.5rem] max-[768px]:text-[2.76rem] max-[540px]:text-[2rem] max-[390px]:text-[1.6rem] max-[290px]:text-[1rem] max-[768px]:text-center mb-[0.62rem] font-avenir-next-lt-pro-bold text-green-charcoal max-[768px]:font-bold">
                     Earn more Stars in a Rapid Fire Quiz.
                  </h1>
                  <Button
                     onClick={openRapidFireStart}
                     className="w-fit max-[414px]:text-[2rem]"
                     style={{
                        backgroundColor: "#ffc150",
                        color: "var(--green-charcoal)",
                        fontWeight: "bold"
                     }}
                  >
                     Get Started
                  </Button>
               </Banner>
               <CategoryList />
            </div>
            <div
               style={{
                  boxShadow:
                     "-5.799999713897705px 5.799999713897705px 0px 0px rgba(53, 79, 82, 0.78)"
               }}
               onClick={openRandomQuiz}
               className="fixed right-0 bottom-[7vh] cursor-pointer duration-300 opacity-30 hover:opacity-100 hover:scale-95 h-[7.0625rem] max-[768px]:h-[150px] max-[475px]:h-[100px] aspect-square flex items-center justify-center bg-green-viridian mr-[--global-padding-left] rounded-[50%] border-[5.8px] border-green-charcoal"
            >
               <img className="w-[50%]" src={Dice} alt="dice" />
            </div>
         </main>
      </>
   );
}
