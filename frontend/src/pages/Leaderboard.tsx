import { useGetRankedUsersQuery } from "@/api/user";
import { Button, Loader } from "@/components/ui";
import { useAuth } from "@/hooks";
import CheckMark from "@/assets/icons/CheckMark.png";
import CheckMarkGreen from "@/assets/icons/CheckMarkGreen.png";

/**
 * @protected
 * Scoreboard showing rank of users.
 */
export default function Leaderboard() {
   const { user } = useAuth();
   const { data, isError, isLoading, refetch } = useGetRankedUsersQuery();

   if (isLoading) {
      return (
         <div className="w-full h-screen flex flex-col font-poppins text-green-charcoal justify-center items-center">
            <Loader size={70} className="animate-pop" />
            <span className="animate-pop text-center font-bold inline-block mt-3">
               Crunching the numbers...
            </span>
         </div>
      );
   }

   if (isError) {
      return (
         <div className="w-full h-screen flex flex-col gap-5 font-poppins text-green-charcoal justify-center items-center">
            <span className="animate-pop">
               Something went wrong. Please try again.
            </span>
            <Button
               className="animate-pop"
               onClick={() => refetch()}
               variant="outlined"
            >
               Retry
            </Button>
         </div>
      );
   }

   const { users } = data.data;
   const userAsPublic = users.find(
      (p_user) => p_user.username === user?.username
   );

   const userRank = userAsPublic ? users.indexOf(userAsPublic) + 1 : undefined;

   return (
      <main className="page_with_header font-poppins relative min-h-screen pl-[--sidebar-width] max-[912px]:pl-0">
         <div className="text-green-charcoal max-[475px]:text-center max-[475px]:font-bold pl-[2.5rem] max-[540px]:px-6 pt-9 text-[36pt] mb-[1.56rem] max-[1024px]:text-[25pt] max-[475px]:text-[19pt] animate-fade-in-from-left effect-item-2">
            {userRank ? (
               userRank === 1 ? (
                  <>You are the reigning champion. Well done. 🏆</>
               ) : (
                  <>
                     You are currently the{" "}
                     <b>
                        {userRank}
                        {userRank >= 4 && userRank <= 20
                           ? "th"
                           : userRank % 10 === 1
                           ? "st"
                           : userRank % 10 === 2
                           ? "nd"
                           : userRank % 10 === 3
                           ? "rd"
                           : "th"}
                     </b>{" "}
                     best player.
                  </>
               )
            ) : (
               <>You are not currently on the leaderboard.</>
            )}
         </div>
         <div className="mx-[2.5rem] max-[475px]:mx-[0.5rem] pt-[2.81rem] pb-[5rem] px-[2.5rem] max-[475px]:px-[1rem] flex flex-col items-center max-[540px]:mx-6 border-[7px] max-[475px]:border-[4px] rounded-[0.875rem] border-green-charcoal shadow-screens/shadow">
            <span className="text-center animate-pull-from-bottom effect-item-2 block mb-[0.61rem] text-green-dark-slate-gray font-bold text-[2.47rem] max-[1024px]:text-[15pt] max-[475px]:text-[18pt]">
               Leaderboard.
            </span>
            {/* List */}
            {users.map((user, index) => (
               <div
                  style={{
                     background:
                        userRank && index === userRank - 1
                           ? "linear-gradient(35deg, rgb(7 219 211) 0%, rgb(28 174 195) 100%)"
                           : index === 0
                           ? "var(--green-dark-slate-gray)"
                           : index === 1 || index === 2
                           ? "var(--green-ash-gray)"
                           : "white",
                     color:
                        userRank && index === userRank - 1
                           ? "var(--green-charcoal)"
                           : index === 0
                           ? "white"
                           : "var(--green-charcoal)",
                     animationDuration: `${(index + 1) * 100 + 500}ms`,
                     boxShadow:
                        "-4.025546550750732px 4.025546550750732px 0px 0px rgba(53, 79, 82, 0.78)"
                  }}
                  className={
                     "w-full mb-[0.58rem] whitespace-nowrap font-bold duration-300 border-[4px] hover:scale-[.97] animate-pop [--jump-scale:1.01] flex items-center justify-between h-[5.47225rem] max-[475px]:h-[4.75rem] p-[0.56606rem_1.258rem] rounded-[0.56606rem] border-green-charcoal text-[1.22rem] max-[1024px]:text-[14pt] max-[475px]:text-[10pt]"
                  }
                  key={index}
               >
                  <span className="text-ellipsis w-[50%] overflow-hidden">
                     {index + 1}. {user.username}
                  </span>
                  <div className="flex justify-start max-[475px]:justify-end">
                     <div className="flex items-center p-[0.56rem] max-[475px]:px-[5px] gap-[5%] mr-[0.56rem] max-[475px]:mr-0">
                        <span className="mr-[0.2rem]">
                           {user.quizzesPlayed}
                        </span>
                        <svg
                           xmlns="http://www.w3.org/2000/svg"
                           width="24"
                           height="24"
                           viewBox="0 0 24 24"
                           fill="none"
                        >
                           <path
                              d="M11.7919 16.5884V16.5879C11.7819 16.5882 11.7717 16.5884 11.7614 16.5884H11.0714C9.07332 16.5884 7.44814 14.9647 7.44814 12.9664L7.44814 11.034C7.44814 9.03585 9.0732 7.41078 11.0714 7.41078H11.7614C13.7596 7.41078 15.3847 9.03585 15.3847 11.034V12.9664C15.3847 13.6643 15.1786 14.309 14.835 14.8572H17.0013H17.2463V15.1023V16.3434V16.5884H17.0013H12.037H11.7919ZM12.037 2.93693C7.03919 2.93693 2.97391 7.00221 2.97391 12C2.97391 16.9977 7.03919 21.063 12.037 21.063C17.0347 21.063 21.1 16.9977 21.1 12C21.1 7.00221 17.0347 2.93693 12.037 2.93693ZM12.037 22.7942C6.08469 22.7942 1.24275 17.9522 1.24275 12C1.24275 6.04771 6.08469 1.20577 12.037 1.20577C17.9892 1.20577 22.8312 6.04771 22.8312 12C22.8312 17.9522 17.9892 22.7942 12.037 22.7942ZM13.6535 11.034C13.6535 9.9915 12.805 9.14195 11.7614 9.14195H11.0714C10.0278 9.14195 9.1793 9.9915 9.1793 11.034L9.1793 12.9664C9.1793 14.0087 10.0276 14.8572 11.0714 14.8572H11.7614C12.8052 14.8572 13.6535 14.0088 13.6535 12.9664V11.034Z"
                              fill={
                                 index !== 0 ||
                                 (userRank && index === userRank - 1)
                                    ? "var(--green-charcoal)"
                                    : "white"
                              }
                              stroke={
                                 index !== 0 ||
                                 (userRank && index === userRank - 1)
                                    ? "var(--green-charcoal)"
                                    : "white"
                              }
                              strokeWidth="0.490089"
                           />
                        </svg>
                     </div>
                     <div className="flex items-center gap-[5%] p-[0.56rem] max-[475px]:px-[5px] mr-[0.56rem] max-[475px]:mr-0">
                        <span className="mr-[0.2rem]">{user.stars}</span>
                        <svg
                           xmlns="http://www.w3.org/2000/svg"
                           width="25"
                           height="24"
                           viewBox="0 0 25 24"
                           fill="none"
                        >
                           <path
                              d="M9.51523 5.0464C10.8514 2.64936 11.5195 1.45084 12.5184 1.45084C13.5173 1.45084 14.1854 2.64935 15.5216 5.04639L15.8673 5.66653C16.247 6.34769 16.4368 6.68828 16.7329 6.913C17.0289 7.13772 17.3975 7.22113 18.1349 7.38796L18.8063 7.53985C21.4009 8.12695 22.6984 8.42049 23.007 9.41307C23.3157 10.4056 22.4313 11.44 20.6623 13.5084L20.2046 14.0436C19.702 14.6314 19.4506 14.9253 19.3375 15.2889C19.2245 15.6526 19.2625 16.0447 19.3385 16.829L19.4077 17.543C19.6751 20.3028 19.8088 21.6828 19.0008 22.2962C18.1926 22.9097 16.9779 22.3503 14.5484 21.2318L13.9199 20.9423C13.2295 20.6245 12.8844 20.4655 12.5184 20.4655C12.1525 20.4655 11.8073 20.6245 11.117 20.9423L10.4884 21.2318C8.05894 22.3503 6.8442 22.9097 6.03611 22.2962C5.22801 21.6828 5.36173 20.3028 5.62917 17.543L5.69835 16.829C5.77436 16.0447 5.81236 15.6526 5.69928 15.2889C5.58621 14.9253 5.33488 14.6314 4.8322 14.0436L4.37456 13.5084C2.60562 11.44 1.72114 10.4056 2.02981 9.41307C2.33848 8.42049 3.63586 8.12695 6.23062 7.53985L6.90192 7.38796C7.63926 7.22113 8.00794 7.13772 8.30396 6.913C8.59998 6.68828 8.78984 6.3477 9.16955 5.66653L9.51523 5.0464Z"
                              stroke={
                                 index !== 0 ||
                                 (userRank && index === userRank - 1)
                                    ? "var(--green-charcoal)"
                                    : "white"
                              }
                              strokeWidth="2.35242"
                           />
                        </svg>
                     </div>
                     <div className="flex items-center p-[0.56rem] max-[475px]:px-[5px]">
                        <span className="mr-[0.2rem]">
                           {user.successRate.toFixed(2)}
                        </span>
                        <img
                           src={
                              index !== 0 ||
                              (userRank && index === userRank - 1)
                                 ? CheckMarkGreen
                                 : CheckMark
                           }
                           alt="checkmark"
                        />
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </main>
   );
}
