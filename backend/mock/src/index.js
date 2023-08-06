const { readFileSync } = require("fs");
const { PORT } = require("./constants");
const {
   addNewUser,
   deleteUser,
   loginUser,
   // getUserStats,
   updateStats,
   verifyEmail,
   resendVerificationEmail,
   handleForgotPassword,
   resetPassword,
   getUserProfile,
   getCategoryQuestions,
   getRandomQuestions,
   getRapidFireQuestions,
   completeRapidFire
} = require("./controllers");
const db = require("./db");
const { APIGenerator } = require("./lib");
const logger = require("./lib/logger");
const { errorHandler, protect } = require("./middleware");

require("colors");

/**
 * Starts the local mock backend.
 * @param {number|undefined} delay API Request delay
 */
function runServer(delay) {
   const api = new APIGenerator();
   api.delay = delay;
   api.useMiddleware({
      errorHandler,
      protect
   })
      // UI.
      .endpoints({
         "/"(_, res) {
            res.contentType = "text/html";
            const html = readFileSync("src/html/index.html").toString();
            logger.inform("Home visited.");
            return html;
         }
      })
      // User routes
      .endpoints({
         "/user/create"(req, res) {
            const session = addNewUser(req);
            res.statusCode = 201;
            return session;
         },
         "/user/login"(req, res) {
            const session = loginUser(req);
            res.statusCode = 200;
            return session;
         },
         "/user/profile": {
            protected: true,
            handler(req, res) {
               const data = getUserProfile(req);
               res.statusCode = 200;
               return data;
            }
         },
         "/user/verify_email/:oneTimeToken": {
            protected: true,
            handler(req, res) {
               const data = verifyEmail(req);
               res.statusCode = 200;
               return data;
            }
         },
         "/user/resend_email": {
            protected: true,
            handler(req, res) {
               const data = resendVerificationEmail(req);
               res.statusCode = 200;
               return data;
            }
         },
         "/user/forgot_password"(req, res) {
            const data = handleForgotPassword(req);
            res.statusCode = 200;
            return data;
         },
         "/user/reset_password/:oneTimeToken"(req, res) {
            const data = resetPassword(req);
            res.statusCode = 204;
            return data;
         },
         "/user/delete": {
            protected: true,
            handler(req, res) {
               const data = deleteUser(req);
               res.statusCode = 204;
               return data;
            }
         },
         // "/user/stats": {
         //    protected: true,
         //    handler(req, res) {
         //       const stats = getUserStats(req);
         //       res.statusCode = 200;
         //       return stats;
         //    },
         // },
         "/user/stats/update": {
            protected: true,
            handler(req, res) {
               const data = updateStats(req);
               res.statusCode = 200;
               return data;
            }
         }
      })
      // Others
      .endpoints({
         "/category/get/:id/:level"(req, res) {
            const data = getCategoryQuestions(req);
            res.statusCode = 200;
            return data;
         },
         "/question/random/:level"(req, res) {
            const data = getRandomQuestions(req);
            res.statusCode = 200;
            return data;
         },
         "/question/rpdfire": {
            protected: true,
            handler(req, res) {
               const data = getRapidFireQuestions(req);
               res.statusCode = 200;
               return data;
            }
         },
         "/question/rpdfire/completed": {
            protected: true,
            handler(req, res) {
               const data = completeRapidFire(req);
               res.statusCode = 200;
               return data;
            }
         }
      });

   api.listen(PORT);
   logger.success(
      `Setup successful. Mock Server is listening at http://localhost:${PORT}.`
   );
}

function gracefulShutDown() {
   logger.important("Shutting down Local Server...");
   const users = db.getUsers();
   users.writeToDisk();
   process.exit(0);
}

// ----
console.clear();
logger.important("Starting Local Server...");
let delay = parseInt(
   process.argv.find((arg) => arg.startsWith("--delay="))?.slice(8)
);
if (delay) logger.inform(`API request delay set to ${delay}ms.`);
db.prepare().then(() => runServer(delay));
process.on("SIGTERM", gracefulShutDown);
process.on("SIGINT", gracefulShutDown);
