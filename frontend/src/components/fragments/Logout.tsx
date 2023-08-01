import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks";
import { Button } from "../ui";
import { useModal } from "@/hooks";

export function Logout() {
   const navigate = useNavigate();
   const modal = useModal();
   const { logout } = useAuth();

   function handleLogout() {
      modal.close();
      logout();
      navigate("/");
   }

   return (
      <div className="w-full flex items-center justify-center flex-col p-8">
         <h3 className="text-green-charcoal font-bold font-avenir-next-lt-pro-bold text-[2.224875rem] mb-6">
            Log out of QuizWiz?
         </h3>
         <div className="flex gap-[1.4375rem]">
            <Button
               size="okay"
               variant="outlined"
               className="font-bold"
               onClick={handleLogout}
            >
               Log out
            </Button>
            <Button
               size="okay"
               className="font-bold"
               onClick={() => modal.close()}
            >
               Cancel
            </Button>
         </div>
      </div>
   );
}
