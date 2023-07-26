const json = require("./history-politics-and-geography/classics.json");
Object.keys(json).forEach((key) => {
   if (json[key] instanceof Array) {
      console.log(json[key].length);
   }
});
