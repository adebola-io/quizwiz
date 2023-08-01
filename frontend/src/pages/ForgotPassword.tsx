import { Input } from "@/components/ui"
import { Button } from "@/components/ui"

export default function ForgotPassword() {
  return (
    <main className="bg-[url('/src/assets/lines-background.png')] h-fit flex flex-col-reverse md:flex-row md:h-screen items-center">
        <section className="flex items-center h-full md:w-[48%] w-full">
          <div className="md:w-[80%] md:mx-auto md:h-[85%] h-[500px] shadow-components/shadow border-[6px] border-green-charcoal rounded w-full">
            <img src="/src/assets/signin-background.png" alt="background" className=" w-full h-full rounded"/>
          </div>
        </section>

        <section className="h-full flex items-center md:w-[48%] w-[100%] md:pt-0 pt-8 px-4">
            <div className="mx-auto">
              <p className="font-bold text-[3rem] leading-tight text-green-feldgrau font-avenir-next-lt-pro-bold">Enter the email used <br /> to verify your <br /> account.</p>

              <Input placeholder="email" 
              type="email" 
              id="email" 
              className="w-full mt-4" 
              containerClassName="animate-fade-in-from-right effect-item-1"/>
              
              <Button
              type="submit"
              className="w-full hover:brightness-90 animate-fade-in-from-right effect-item-3"
              variant="override"
              style={{
                boxShadow: "none",
                color: "var(--white)",
                backgroundColor: "var(--green-feldgrau)",
                borderWidth: "4px",
                height: "4.125rem",
                marginBottom: "1.36rem"
             }}
              

              
              >Continue</Button>
            </div>
        </section>
    </main>
  )
}
