const json = require("./history-politics-and-geography/asia.json");
Object.keys(json).forEach((key) => {
   if (json[key] instanceof Array) {
      console.log(json[key].length);
   }
});
