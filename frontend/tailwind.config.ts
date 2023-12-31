import { Config } from "tailwindcss";

const config: Config = {
   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
   theme: {
      extend: {
         colors: {
            white: "#ffffff",
            black: "#000000",
            "heat-wave": "#ff7a00",
            "fine-purple": "#c20275",
            "royal-red": "#c00073",
            "error-red": "#930202",
            "indigo-dye": "#284B63",
            purple: {
               "raisin-black": "#1a1423",
               "english-violet": "#3d314a",
               eggplant: "#684756",
               chaimosee: "#96705b",
               beaver: "#ab8476",
               amethyst: "#9966cc",
               redwood: "#b75d69",
               "pale-dogwood": "#eacdc2"
            },
            green: {
               "cambridge-blue": "#84a98c",
               "ash-gray": "#cad2c5",
               viridian: "#6b917e",
               "hookers-green": "#52796f",
               feldgrau: "#446461",
               "dark-slate-gray": "#354f52",
               charcoal: "#2f3e46"
            }
         },
         fontSize: {
            base: "1.2243750095367432rem",
            lg: "2.510209083557129rem",
            xl: "3.036875009536743rem",
            "2xl": "7.125rem",
            "3xl": "7.625rem"
         },
         fontFamily: {
            poppins: "Poppins, sans-serif",
            "eras-bold": "Eras Bold ITC, sans-serif",
            "avenir-next-lt-pro": '"Avenir Next LT Pro", sans-serif',
            "avenir-next-lt-pro-bold": '"Avenir Next LT Pro Bold", sans-serif'
         },
         boxShadow: {
            "image-depth":
               "-10.093087196350098px 18.794025421142578px 0px 0px rgba(53,79,82,1)",
            "text-depth": "inset 12px 5px 4px 0px rgba(0,0,0,0.25)",
            "inner-shadow": "inset 8px 0px 22px 0px rgba(47,62,70,1)",
            "screens/shadow": "-10px 10px 0px 0px rgba(1,45,0,0.59)",
            "components/shadow": "-4px 4px 0px 0px rgba(53,79,82,0.78)",
            "components/smaller-shadow": "-2px 2px 0px 0px rgba(70,57,86,0.78)"
         },
         borderRadius: {
            none: "0",
            xs: "0.13358040153980255rem",
            sm: "0.13961835205554962rem",
            default: "0.27384576201438904rem",
            lg: "0.3403184711933136rem",
            xl: "0.35719016194343567rem",
            "2xl": "0.375rem",
            "3xl": "0.4066466987133026rem",
            "4xl": "0.4375rem",
            "5xl": "0.4569905400276184rem",
            "6xl": "0.4571874737739563rem",
            "7xl": "0.5625rem",
            "8xl": "0.625rem",
            "9xl": "0.627440333366394rem",
            "10xl": "0.8125rem",
            "11xl": "1.1014820337295532rem",
            "12xl": "1.25rem",
            "13xl": "1.625rem",
            "14xl": "1.78125rem",
            "15xl": "1.8437501192092896rem",
            "16xl": "1.953125rem",
            "17xl": "4.53125rem",
            full: "9999px"
         }
      }
   }
};
export default config;
