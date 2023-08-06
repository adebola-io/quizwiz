import PasswordLayout from "@/layouts/PasswordLayout";
import { ResetPasswordForm } from "@/components/fragments";

export default function ResetPassword() {
   return (
      <PasswordLayout>
         {/* <div className="mx-auto w-full">
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
            </div> */}
         <ResetPasswordForm />
      </PasswordLayout>
   );
}
