const json = require("./pop-culture/music.json");
Object.keys(json).forEach((key, index) => {
   if (json[key] instanceof Array) {
      console.log(`Level ${index - 2}: ${json[key].length} questions`);
   }
});
