import { CategoryStore } from "@/types";
import RandomIcon from "@/assets/icons/RandomQuiz.png";
import RandomIconBox from "@/assets/icons/RandomQuizBox.png";
import History from "@/assets/icons/History.png";
import HistoryBox from "@/assets/icons/HistoryBox.png";
import Maths from "@/assets/icons/Maths.png";
import MathsBox from "@/assets/icons/MathsBox.png";
import Sports from "@/assets/icons/Sports.png";
import SportBox from "@/assets/icons/SportsBox.png";
import Language from "@/assets/icons/Language.png";
import LanguageBox from "@/assets/icons/LanguageBox.png";
import Technology from "@/assets/icons/Technology.png";
import TechnologyBox from "@/assets/icons/TechnologyBox.png";
import PopCulture from "@/assets/icons/Pop Culture.png";
import PopCultureBox from "@/assets/icons/PopCultureBox.png";

export const categories: CategoryStore = {
   "Random Quiz": {
      // Not a real id.
      id: 0,
      info: "Answer general questions from every category. 🎲",
      MainIcon: RandomIcon,
      BoxIcon: RandomIconBox,
      gradient:
         "var(--gradients-random-quiz, linear-gradient(180deg, #00A486 0%, #836AEB 100%))"
   },
   "History, Politics & Geography": {
      id: 1,
      info: "What do you know about the past? 🕰️",
      MainIcon: History,
      BoxIcon: HistoryBox,
      gradient:
         "var(--gradients-history, linear-gradient(180deg, #FFC700 0%, #00D1FF 100%))"
   },
   "Language & Literature": {
      id: 2,
      info: "Test your knowledge on spoken and written word. 💬📝",
      MainIcon: Language,
      BoxIcon: LanguageBox,
      gradient:
         "var(--gradients-sports, linear-gradient(213deg, #4572E7 0%, #004E70 100%))"
   },
   Sports: {
      id: 3,
      info: "Score a goal, hit a six, or ace a serve. 🏈⚽",
      MainIcon: Sports,
      BoxIcon: SportBox,
      gradient:
         "var(--gradients-sports, linear-gradient(213deg, #4572E7 0%, #004E70 100%))"
   },
   Mathematics: {
      id: 4,
      info: "Don't count on luck! ➗🧮",
      MainIcon: Maths,
      BoxIcon: MathsBox,
      gradient:
         "var(--gradients-math, linear-gradient(317deg, #CC2BC6 0%, #E9A219 100%))"
   },
   "Pop Culture": {
      id: 5,
      info: "Let's know if you're in the know. 😎",
      MainIcon: PopCulture,
      BoxIcon: PopCultureBox,
      gradient:
         "var(--gradients-pop-culture, linear-gradient(180deg, #ED75A8 0%, #DB4A4A 100%))"
   },
   Technology: {
      id: 6,
      info: "Assess your acumen on gadgets and gizmos. 🖥️",
      MainIcon: Technology,
      BoxIcon: TechnologyBox,
      gradient:
         "var(--gradients-technology, linear-gradient(222deg, #D600C0 0%, #623DCC 100%))"
   }
};

interface LevelObject {
   name: string;
   theme: string;
   /** How long a question lasts in this level. */
   timerValue: number;
}
export const levels: LevelObject[] = [
   {
      name: "Beginner",
      theme: "#B9C0F9",
      timerValue: 15
   },
   {
      name: "Simple",
      theme: "#FFC7E8",
      timerValue: 13
   },
   {
      name: "Standard",
      theme: "#B5FFB4",
      timerValue: 10
   },
   {
      name: "Complex",
      theme: "#FFE2AB",
      timerValue: 10
   },
   {
      name: "Expert",
      theme: "#00625C",
      timerValue: 8
   }
];
