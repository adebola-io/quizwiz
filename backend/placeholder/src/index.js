const { addNewUser, deleteUser } = require("./controllers");
const db = require("./db");
const { APIGenerator } = require("./lib");
const { errorHandler } = require("./middleware");

require("colors");

const port = process.env.PORT || 4174;

console.clear();

db.prepare().then(() => {
   const api = new APIGenerator();
   api.errorHandler = errorHandler;
   api.endpoints({
      "/": function (req, res) {
         res.statusCode = 200;
         res.contentType = "text/html";
         return "hello there!";
      },
      "/user/create": function (req, res) {
         const data = addNewUser(req);
         res.statusCode = 201;
         return data;
      },
      "/user/delete": {
         protected: true,
         handler: function (req, res) {
            const data = deleteUser(req);
            res.statusCode = 204;
            return data;
         },
      },
      "/user/login": function () {},
      "/user/stats": {
         protected: true,
         handler: function (req, res) {},
      },
      "/user/stats/update": {
         protected: true,
         handler: function (req, res) {},
      },
      "/categories/:id/:level": function () {},
      "/random/:level": function () {},
      "/rpdfire/questions": {
         protected: true,
         handler: function (req, res) {},
      },
      "/rpdfire/completed": {
         protected: true,
         handler: function (req, res) {},
      },
   });
   api.listen(port);
   console.log();
   console.log(
      `Mock Server is listening at http://localhost:${port}.`.green.bold
   );
});
