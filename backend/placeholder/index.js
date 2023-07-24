const colors = require("colors");
const http = require("http");

const port = process.env.PORT || 4174;

/**
 * Server Handler
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 */
function listener(req, res) {}

http.createServer(listener).listen(port);
console.log(`Local Server is running on port ${port}.`.green);
