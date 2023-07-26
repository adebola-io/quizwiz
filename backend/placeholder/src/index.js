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
const logger = require("./lib/logger");
const { errorHandler, protect } = require("./middleware");

require("colors");

console.clear();
function main() {
   db.prepare().then(() => {
      if (process.argv.includes("--clear-db")) {
         logger.warn(
            "--clear-db option found, Removing all users from JSON file"
         );
         const users = db.getUsers();
         users.clear();
         users.writeToDisc();
      }

      const api = new APIGenerator();
      let delay = process.argv.find((arg) => arg.startsWith("--delay="));
      if (delay) {
         delay = delay.slice(8);
         api.delay = parseInt(delay);
         logger.inform(`API request delay set to ${delay}ms.`);
      }
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
      logger.success(`Mock Server is listening at http://localhost:${PORT}.`);
   });
}

function gracefulShutDown() {
   console.log("Shutting down...".grey);
   const users = db.getUsers();
   users.writeToDisc();
   process.exit(0);
}
process.on("SIGTERM", gracefulShutDown);
process.on("SIGINT", gracefulShutDown);

main();
