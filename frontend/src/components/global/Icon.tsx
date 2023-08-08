import QuizWizIcon from "@/assets/quizwizArtboard 11.png";

interface IconProps {
   style?: React.CSSProperties;
   className?: string;
}

/**
 * Icon for the Quiz App.
 */
export function Icon(props: IconProps) {
   return (
      <img
         className={props.className}
         style={props.style}
         src={QuizWizIcon}
         alt="icon"
      />
   );
}
