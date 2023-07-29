const json = require("./history-politics-and-geography/nigerian-history.json");
Object.keys(json).forEach((key, index) => {
   if (json[key] instanceof Array) {
      console.log(`Level ${index - 2}: ${json[key].length} questions`);
   }
});
