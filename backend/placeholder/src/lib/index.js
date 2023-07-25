const fs = require("fs");
const http = require("http");
const { ERROR_TYPES } = require("../middleware/errors");
require("colors");

/**
 * An in-memory representation of users.
 */
class UserList {
   /**
    * @type {Map<string, boolean>}
    * @private
    */
   idMap = new Map();
   /**
    * The items in memory.
    * @type {User[]}
    * @private
    */
   items = [];
   /**
    * The JSON file to store the users.
    * @type {fs.PathLike|undefined}
    * @private
    */
   baseFile;
   /**
    * Update the base file.
    * @private
    */
   /**
    * Number of users in the database.
    */
   get length() {
      return this.items.length;
   }
   [Symbol.iterator]() {
      return this.items[Symbol.iterator]();
   }
   update() {
      if (this.baseFile)
         fs.writeFileSync(this.baseFile, JSON.stringify(this.items));
   }
   /**
    * Sets the JSON file on the disk where users should be stored or retrieved from.
    * @param {fs.PathLike} baseFile
    */
   setBaseFile(baseFile) {
      if (!fs.existsSync(baseFile)) {
         console.log("Users JSON file is not present. Creating...".green);
         fs.createWriteStream(baseFile);
         fs.writeFileSync(baseFile, "[]");
      }
      this.baseFile = baseFile;
      this.items = JSON.parse(fs.readFileSync(baseFile).toString());
      for (const { id } of this.items) {
         this.idMap.set(id, true);
      }
   }
   /**
    * Adds a new user to the database.
    * @param {User} user The user to add.
    */
   add(user) {
      this.items.push(user);
      this.update();
   }
   /**
    * Removes a user from the database.
    * @param {string} id The ID of the user to remove
    */
   remove(id) {
      this.items = this.items.filter((user) => user.id !== id);
      this.update();
   }
   /**
    * Creates a new user ID.
    */
   createId() {
      let id = (Math.random().toString(16) + this.length.toString().slice(0, 1))
         .split("")
         .reverse()
         .join("")
         .slice(0, 10);
      while (this.idMap.has(id)) {
         id = (Math.random().toString(16) + this.length.toString().slice(0, 1))
            .split("")
            .reverse()
            .join("")
            .slice(0, 10);
      }
      this.idMap.set(id, true);
      return id;
   }
}

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
    * @private
    * @param {apigen.IncomingMessage} req
    * @param {apigen.Response} res
    */
   handler(req, res) {
      let body = "";
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Headers", "*");
      req.on("data", (chunk) => (body += chunk));
      req.on("end", () => {
         try {
            req.body = JSON.parse(body || "{}");
         } catch {
            const error = new ServerError(ERROR_TYPES.MALFORMED_REQUEST, 400);
            this.handleError(res, error);
            return;
         }
         const paths = req.url.split("/").filter(Boolean);

         let current = this.root;
         // Account for root URL.
         if (paths.length === 0) paths.push("");
         for (let i = 0; i < paths.length; i++) {
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
                  const error = new ServerError(ERROR_TYPES.NOT_FOUND, 404);
                  this.handleError(res, error);
                  break;
               }
            }
            current = current.children[path];
            if (i === paths.length - 1) {
               if (!current.handler) {
                  const error = new ServerError(ERROR_TYPES.NOT_FOUND, 404);
                  this.handleError(res, error);
                  break;
               }
               try {
                  if (current.protected) {
                     this.protector?.(req);
                  }
                  const response = current.handler(req, res);
                  if (response) this.sendData({ res, data: response });
               } catch (error) {
                  const handlerResult = this.handleError(res, error);
                  if (handlerResult.feedback) {
                     this.sendData({ res, data: handlerResult.feedback });
                  }
                  if (handlerResult.fatal) {
                     throw error;
                  }
               }
            }
         }
         res.end();
      });
   }

   /**
    * Send an error to the client.
    * @param {apigen.Response} res
    * @param {apigen.ServerError} error
    */
   handleError(res, error) {
      if (!this.errorHandler) {
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
   data;

   /**@param {number} type */
   constructor(type, status = 400) {
      super("");
      this.type = type;
      this.status = status;
   }
}

module.exports = {
   APIGenerator,
   UserList,
   ServerError,
   utils: require("./utils"),
};
