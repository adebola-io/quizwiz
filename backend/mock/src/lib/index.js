const fs = require("fs");
const http = require("http");
require("colors");

/**
 * Custom API Endpoint generator
 */
class APIGenerator {
   /**
    * @private
    * @type {apigen.RoutePath}
    */
   root = {};
   /**
    * @type {apigen.ErrorHandler}
    */
   errorHandler;
   /**
    * @type {apigen.Protector}
    */
   protector;
   /**
    * Request delay.
    */
   delay = 0;
   /**
    * @private
    * @param {apigen.Request} req
    * @param {apigen.Response} res
    */
   handler(req, res) {
      let body = "";
      // Disable cors.
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Headers", "*");
      res.setHeader("Access-Control-Allow-Methods", "*");
      if (req.method === "OPTIONS") {
         res.writeHead(200);
         res.end();
         return;
      }

      req.on("data", (chunk) => (body += chunk));
      req.on("end", () => {
         if (this.delay > 0) {
            setTimeout(() => this.executeRequest(req, res, body), this.delay);
         } else this.executeRequest(req, res, body);
      });
   }
   /**
    * Execute a request.
    * @param {apigen.Request} req
    * @param {apigen.Response} res
    * @param {string} body
    */
   executeRequest(req, res, body) {
      try {
         req.body = JSON.parse(body || "{}");
      } catch {
         const error = new ServerError("Invalid request body.", 400);
         this.handleError(res, error);
         return;
      }
      const paths = req.url.split("/").filter(Boolean);

      let current = this.root;
      // Account for root URL.
      if (paths.length === 0) paths.push("");

      for (let i = 0; i < paths.length; i++) {
         try {
            let path = paths[i];
            if (!current.children[path]) {
               /// Try generic parameters.
               let parameterName = Object.keys(current.children).find((path) =>
                  path.startsWith(":")
               );
               if (parameterName) {
                  req.params = req.params || {};
                  req.params[parameterName.slice(1)] = path;
                  path = parameterName;
               } else {
                  const error = new ServerError("Route does not exist.", 404);
                  this.handleError(res, error);
                  break;
               }
            }
            current = current.children[path];
            if (i === paths.length - 1) {
               if (!current.handler) {
                  const error = new ServerError("Route does not exist.", 404);
                  this.handleError(res, error);
                  break;
               }

               if (current.protected) {
                  this.protector?.(req);
               }
               const response = current.handler(req, res);
               if (response) this.sendData({ res, data: response });
            }
         } catch (error) {
            const handlerResult = this.handleError(res, error);
            if (handlerResult.message) {
               /** @type {ErrorResponse} */
               const feedback = {
                  status: "error",
                  message: handlerResult.message,
               };
               this.sendData({ res, data: feedback });
            }
            if (handlerResult.fatal) {
               throw error;
            }
         }
      }
      res.end();
   }
   /**
    *
    * @param {apigen.Middleware} options
    */
   useMiddleware(options) {
      this.errorHandler = options.errorHandler;
      this.protector = options.protect;
      return this;
   }

   /**
    * Send an error to the client.
    * @param {apigen.Response} res
    * @param {apigen.ServerError} error
    */
   handleError(res, error) {
      if (!(this.errorHandler && error instanceof ServerError)) {
         throw error;
      }
      return this.errorHandler({ error, res });
   }

   /**
    * Send data through a response channel.
    * @param {apigen.DataResponseOptions} dataResponseOptions
    */
   sendData(dataResponseOptions) {
      const { res: response, data } = dataResponseOptions;
      const contentType = response.contentType || "application/json";
      response.writeHead(response.statusCode || 200, {
         "Content-Type": contentType,
      });
      let toSend;
      if (contentType === "application/json") toSend = JSON.stringify(data);
      else toSend = data;
      response.end(toSend);
   }

   /**
    * Defines the router routes.
    * @param {apigen.RoutesConfig} routesConfig
    */
   endpoints(routesConfig) {
      Object.entries(routesConfig).forEach(([route, value]) => {
         const paths = route.split("/").filter(Boolean);
         this.builtPathTree(paths, value);
      });
      return this;
   }
   /**
    * @param {string[]} paths
    * @param {apigen.RoutePathLeaf} value
    * @private
    */
   builtPathTree(paths, value) {
      let currentNode = this.root;
      if (paths.length === 0) {
         paths.push("");
      }
      for (let i = 0; i < paths.length; i++) {
         let path = paths[i];
         if (!currentNode.children) {
            currentNode.children = {};
         }
         if (!currentNode.children[path]) {
            currentNode.children[path] = {};
         }
         if (i === paths.length - 1) {
            currentNode.children[path] =
               value instanceof Function
                  ? { handler: value, children: {} }
                  : {
                       handler: value.handler,
                       protected: value.protected,
                       children: {},
                    };
         } else currentNode = currentNode.children[path];
      }
   }

   /**
    * Starts the server at a port
    * @param {number|string} port
    */
   listen(port) {
      http.createServer(this.handler.bind(this)).listen(port);
      return this;
   }
}

class ServerError extends Error {
   /**@type {number} */
   type;
   /**@type {number} */
   status;
   /**
    * @type {string|object|Array<unknown>}
    */
   data;
   message;

   /**@param {string} message */
   constructor(message, status = 400) {
      super(message);
      this.status = status;
      this.message = message;
   }
}

module.exports = {
   APIGenerator,
   ServerError,
   utils: require("./utils"),
};
