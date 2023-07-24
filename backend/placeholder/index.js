const colors = require("colors");
const http = require("http");
const { prepareUserDB } = require("./lib/users");

const port = process.env.PORT || 4174;

/**
 * Server Handler
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 */
function listener(req, res) {
   console.log(req.method);
   console.log(req.url);
   switch (req.url) {
      case "/user/create":
         try {
            
         }
   }
   res.end();
}

function main() {
   console.clear();
   const users = prepareUserDB();
   http.createServer(listener).listen(port);
   console.log(`Local Server is running on port ${port}.`.green);
}

main();
