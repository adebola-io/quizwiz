import { Input } from "@/components/ui"
import { Button } from "@/components/ui"

export default function ResetPassword() {
  return (
    <main className="bg-[url('/src/assets/lines-background.png')] h-fit flex flex-col-reverse md:flex-row md:h-screen items-center">
        <section className="flex items-center h-full md:w-[48%] w-full">
          <div className="md:w-[80%] md:mx-auto md:h-[90%] h-[500px] shadow-components/shadow border-[6px] border-green-charcoal rounded w-full">
            <img src="/src/assets/signin-background.png" alt="background" className=" w-full h-full rounded"/>
          </div>
        </section>

        <section className="h-full flex items-center md:w-[48%] w-[100%] pt-5 px-4">
            <div className="mx-auto w-full">
              <p className="font-bold text-[3rem] leading-tight text-green-feldgrau font-avenir-next-lt-pro-bold">Enter a new <br /> password.</p>
              <div>
              <Input placeholder="Password" 
              type="password" 
              id="password" 
              className="w-full mt-4 animate-fade-in-from-right"
              containerClassName="animate-fade-in-from-right effect-item-1"/>

              <Input placeholder="Confirm Password" 
              type="password" 
              id="password" 
              className="w-full mt-4" 
              containerClassName="animate-fade-in-from-right effect-item-1"/>
              </div>

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
              

               
              >Reset Password</Button>
            </div>
        </section>
    </main>
  )
}
