export function showPasswordBriefly(password: HTMLInputElement) {
   password.type = "text";
   setTimeout(() => {
      password.type = "password";
   }, 3000);
}
