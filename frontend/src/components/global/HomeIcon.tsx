import { useNavigate } from "react-router-dom";
import { SidebarIconProps } from ".";

export function HomeIcon(props: SidebarIconProps) {
   const [page, setPage] = props.handlers.page;
   const setSidebarExpanded = props.handlers.expanded[1];
   const navigate = useNavigate();

   function handleClick() {
      setPage("home");
      setSidebarExpanded(false);
      navigate("/dashboard/home");
   }

   return (
      <div
         title="Home"
         className="flex cursor-pointer relative w-full pl-[calc(var(--sidebar-width)/3.5)] [--line-height:0] [--line-width:0] hover:[--line-width:100%] hover:[--line-height:2px] "
         onClick={handleClick}
      >
         <svg
            className="duration-300 scale-75"
            width="47"
            height="42"
            viewBox="0 0 47 42"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
         >
            <path
               fillRule="evenodd"
               clipRule="evenodd"
               d={
                  page === "home"
                     ? "M45.77 17.1637L22.885 0L0 17.1637L1.08976 20.433H2.90603V41.3201H42.8639V20.433H44.6802L45.77 17.1637ZM19.2527 40H26.5178V28.808H19.2527V40Z"
                     : "M46.385 17.2197L23.5 0.0559692L0.61499 17.2197L1.70475 20.489H3.52102V41.3761H43.4789V20.489H45.2952L46.385 17.2197ZM7.15356 37.7435V16.8565L23.5 4.59664L39.8464 16.8565V37.7435H30.7653V27.0477L28.949 25.2314H18.0514L16.2351 27.0477V37.7435H7.15356ZM19.8677 37.7435H27.1328V28.8639H19.8677V37.7435Z"
               }
               fill="white"
            />
         </svg>
         <span className="absolute left-[var(--sidebar-width)] w-full h-full flex flex-col justify-center font-poppins text-[14pt] text-white">
            Home
            <div className="h-[2px] bg-white w-[--line-width] duration-300"></div>
         </span>
      </div>
   );
}
