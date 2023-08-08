const db = require("../db");
const { ServerError } = require("../lib");

/**
 * Returns 45 users with the best rank scores.
 * @route "/users/ranked"
 * @param {apigen.Request} req Server request.
 * @throws {apigen.ServerError}
 * @return {SucessResponse}
 */
function rankUsers(req) {
   if (req.method !== "GET") {
      throw new ServerError(
         `${req.method} /category/get/:id/:level is not a valid route.`,
         401
      );
   }

   const users = db.getUsers();
   /** @type {PublicUser[]}*/
   const publicUsers = [...users.items]
      .sort((a, b) => calculateRankScore(b) - calculateRankScore(a))
      .map((record) => ({
         username: record.data.username,
         quizzesPlayed: record.data.quizzesPlayed,
         stars: record.data.stars,
         successRate: record.data.successRate
      }))
      .slice(0, 45);

   return {
      status: "success",
      message: "Ranked users retrieved successfully",
      data: {
         users: publicUsers
      }
   };
}

/**
 * Calculate the rank score of a user.
 * @param {UserRecord} user
 */
function calculateRankScore(user) {
   return (
      user.data.quizzesPlayed * 0.2 +
      user.data.stars * 0.5 +
      user.data.successRate * 0.3
   );
}

module.exports = {
   rankUsers
};
