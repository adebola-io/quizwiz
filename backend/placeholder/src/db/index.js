const { UserList } = require("../lib");

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
