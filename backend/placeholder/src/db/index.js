const fs = require("fs");

/**
 * An in-memory representation of users.
 */
class UserList {
   /**
    * @type {Map<string, boolean>}
    * @private
    */
   idMap = new Map();
   mutationCounter = 0;
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
   /**
    * Update the JSON file.
    */
   writeToDisc() {
      console.log("Updating baseFile...".magenta);
      fs.writeFileSync(this.baseFile, JSON.stringify(this.items));
      this.mutationCounter = 0;
   }
   /**
    * Finds a user in the list.
    * @param {(user:User)=>boolean} predicate
    */
   find(predicate) {
      return this.items.find(predicate);
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
   }
   /**
    * Removes a user from the database.
    * @param {string} id The ID of the user to remove
    */
   remove(id) {
      this.items = this.items.filter((user) => user.id !== id);
      this.idMap.delete(id);
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

const users = new UserList();
/**
 * Prepare JSON mock database for users.
 */
async function prepare() {
   users.setBaseFile("src/db/users.json");
   console.log("Mock Database is ready.".cyan);
   return users;
}
function getUsers() {
   return users;
}

module.exports = {
   getUsers,
   prepare,
};
