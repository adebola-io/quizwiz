import { ReactNode } from "react";

type PasswordLayoutProps = {
   children: ReactNode;
};
export default function PasswordLayout({ children }: PasswordLayoutProps) {
   return (
      <main className="lines flex h-screen items-center px-6 lg:px-12 gap-8">
         <section className="hidden md:flex items-center h-full md:w-1/2 w-full">
            <div className="w-full h-5/6">
               <img
                  src="/src/assets/password-background.png"
                  alt="background"
                  className="w-full h-full"
               />
            </div>
         </section>

         <section className="h-full flex items-center md:w-1/2 w-full pt-5 xl:px-16">
            {children}
         </section>
      </main>
   );
}
