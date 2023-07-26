const { PORT } = require("./constants");
const {
   addNewUser,
   deleteUser,
   loginUser,
   getUserStats,
   updateStats,
} = require("./controllers");
const db = require("./db");
const { APIGenerator } = require("./lib");
const { errorHandler, protect } = require("./middleware");

require("colors");

console.clear();

db.prepare().then(() => {
   if (process.argv.includes("--clear-db")) {
      console.log("--clear-db option found, Removing all users.".yellow);
      const users = db.getUsers();
      users.clear();
      users.writeToDisc();
   }
   const api = new APIGenerator();
   api.delay = 3000;
   api.useMiddleware({
      errorHandler,
      protect,
   });
   api.endpoints({
      "/user/create": function (req, res) {
         const session = addNewUser(req);
         res.statusCode = 201;
         return session;
      },
      "/user/delete": {
         protected: true,
         handler: function (req, res) {
            const data = deleteUser(req);
            res.statusCode = 204;
            return data;
         },
      },
      "/user/login": function (req, res) {
         const session = loginUser(req);
         res.statusCode = 200;
         return session;
      },
      "/user/stats": {
         protected: true,
         handler: function (req, res) {
            const stats = getUserStats(req);
            res.statusCode = 200;
            return stats;
         },
      },
      "/user/stats/update": {
         protected: true,
         handler: function (req, res) {
            const data = updateStats(req);
            res.statusCode = 204;
            return data;
         },
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
   api.listen(PORT);
   console.log();
   console.log(
      `Mock Server is listening at http://localhost:${PORT}.`.green.bold
   );
});

function gracefulShutDown() {
   console.log("Shutting down...".grey);
   const users = db.getUsers();
   users.writeToDisc();
   process.exit(0);
}
process.on("SIGTERM", gracefulShutDown);
process.on("SIGINT", gracefulShutDown);
