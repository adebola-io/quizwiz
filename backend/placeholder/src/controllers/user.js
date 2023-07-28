const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db");
const { utils, ServerError } = require("../lib");
const { JWT_SECRET, TOKENS } = require("../constants");
const logger = require("../lib/logger");

require("colors");

/**
 * Adds a new user.
 * @route "/user/create"
 * @param {apigen.Request} req Server request.
 * @throws {apigen.ServerError}
 * @returns {CreateUserResponse}
 */
function addNewUser(req) {
   if (req.method !== "POST") {
      throw new ServerError(
         `${req.method} /user/create is not a valid route.`,
         401
      );
   }

   const { username, emailAddress, password, confirmPassword } = req.body;

   if (typeof username !== "string" || !utils.isValidUsername(username)) {
      throw new ServerError("Invalid username.");
   }
   if (typeof emailAddress !== "string" || !utils.isValidEmail(emailAddress)) {
      throw new ServerError("Invalid email.");
   }
   if (typeof password !== "string" || !utils.isValidPassword(password)) {
      throw new ServerError("Invalid password.");
   }
   if (
      typeof confirmPassword !== "string" ||
      !utils.isValidPassword(password) ||
      confirmPassword !== password
   ) {
      throw new ServerError("Passwords do not match");
   }
   const users = db.getUsers();
   for (const { data: previousUser } of users) {
      if (previousUser.username == username) {
         throw new ServerError(`${username} already exists.`);
      }
      if (previousUser.emailAddress == emailAddress) {
         throw new ServerError(`${emailAddress} already exists.`);
      }
   }
   const hashedPassword = bcrypt.hashSync(password, 10);

   /**@type {User} */
   const userData = {
      username,
      password: hashedPassword,
      emailAddress,
      emailConfirmationStatus: false,
      quizzesPlayed: 0,
      rapidFireCheckpoint: null,
      stars: 0,
      successRate: 0,
   };

   const metadata = users.add(userData);
   logger.success(`New user with username "${username}" created.`);
   /**@type {CreateUserResponse} */
   let response = {
      status: "success",
      message: "registration successful, kindly check your email for next step",
      data: {
         token: generateUserToken(metadata._id),
         user: {
            ...userData,
            password: undefined,
            ...metadata,
         },
      },
   };
   const tokenProvider = db.getTokenProvider();
   const emailService = db.getEmailService();
   const { value } = tokenProvider.generate(
      TOKENS.EMAIL_VERIFICATION,
      userData
   );
   emailService.sendEmail(
      userData.emailAddress,
      `Welcome to QuizApp. To verify your email, use the token ${value}.`
   );

   return response;
}

/**
 * Deletes user from database.
 * @protected
 * @route "/user/delete"
 * @param {apigen.Request} req Server request.
 * @throws {apigen.ServerError}
 * @return {SucessResponse}
 */
function deleteUser(req) {
   if (req.method !== "DELETE") {
      throw new ServerError(
         `${req.method} /user/delete is not a valid route.`,
         401
      );
   }

   const users = db.getUsers();
   /**@type {User} */
   const user = req["user"];
   users.remove(user);
   logger.warn(`User with username ${user.username} deleted.`);
   return { status: "success", message: "User deleted successfully." };
}

/**
 * Log in a user.
 * @route "/user/login"
 * @param {apigen.Request} req Server Request
 * @throws {apigen.ServerError}
 * @returns {CreateUserResponse}
 */
function loginUser(req) {
   if (req.method !== "POST") {
      throw new ServerError(
         `${req.method} /user/login is not a valid route.`,
         401
      );
   }
   const { username, email, password } = req.body;
   if (typeof username !== "string" && typeof email !== "string") {
      throw new ServerError("Email/Username and Password must be provided.");
   }
   const users = db.getUsers();
   const record = users.find(
      (user) =>
         user.data.username === username || user.data.emailAddress === email
   );
   if (!record) {
      throw new ServerError("Invalid email, username or password.", 404);
   }
   if (!bcrypt.compareSync(password, record.data.password)) {
      throw new ServerError("Invalid email, username or password.", 401);
   }
   /**@type {CreateUserResponse} */
   let response = {
      status: "success",
      message: "registration successful, kindly check your email for next step",
      data: {
         token: generateUserToken(record.metadata._id),
         //@ts-ignore
         user: { ...record.data, password: undefined, ...record.metadata },
      },
   };
   logger.inform(`User "${username}" logged in.`);
   return response;
}

/**
 * Verifies a user email.
 * @protected
 * @route "/user/verify_email/:oneTimeToken"
 * @param {apigen.Request} req
 * @throws {apigen.ServerError}
 * @return {SucessResponse}
 */
function verifyEmail(req) {
   if (req.method !== "PATCH") {
      throw new ServerError(
         `${req.method} /verify_email/:token is not a valid route.`,
         401
      );
   }
   /**@type {User} */
   const user = req["user"];
   let { oneTimeToken } = req.params;
   if (typeof oneTimeToken !== "string") {
      throw new ServerError("token expired, kindly request a new one.");
   }
   const tokenProvider = db.getTokenProvider();
   const token = tokenProvider.findToken(
      oneTimeToken,
      TOKENS.EMAIL_VERIFICATION
   );
   if (
      token === undefined ||
      !tokenProvider.isValidToken(oneTimeToken, user, TOKENS.EMAIL_VERIFICATION)
   ) {
      throw new ServerError("token expired, kindly request a new one.");
   }
   tokenProvider.deleteToken(token);
   user.emailConfirmationStatus = true;
   logger.success(`Email for user "${user.username}" successfully activated.`);

   // Update record.
   const users = db.getUsers();
   const parentRecord = users.find((record) => record.data === user);
   parentRecord.metadata.updatedAt = new Date().toISOString();

   return {
      status: "success",
      message: "Email successfully activated.",
   };
}

/**
 * Triggers a new email token.
 * @protected
 * @route "/user/resend_email"
 * @param {apigen.Request} req
 * @throws {apigen.ServerError}
 * @returns {SucessResponse}
 */
function resendVerificationEmail(req) {
   if (req.method !== "POST") {
      throw new ServerError(
         `${req.method} /user/resend_email is not a valid route.`,
         401
      );
   }
   const { email } = req.body;
   if (typeof email !== "string" || !utils.isValidEmail(email)) {
      throw new ServerError("Invalid email.");
   }
   /**@type {User} */
   const user = req["user"];
   // TODO: is this redundant?
   if (!user) {
      throw new ServerError("User not found.", 401);
   }
   if (user.emailConfirmationStatus) {
      throw new ServerError("Your account is already activated.", 409);
   }
   const tokenProvider = db.getTokenProvider();
   const emailService = db.getEmailService();
   const { value } = tokenProvider.generate(TOKENS.EMAIL_VERIFICATION, user);
   emailService.sendEmail(
      user.emailAddress,
      `To verify your email, use the token ${value}.`
   );
   return {
      status: "success",
      message: "Verification email sent successfully!",
   };
}

/**
 * Triggers a forgot password cycle.
 * @route "/user/forgot_password"
 * @param {apigen.Request} req
 * @throws {apigen.ServerError}
 * @returns {SucessResponse}
 */
function handleForgotPassword(req) {
   if (req.method !== "POST") {
      throw new ServerError(
         `${req.method} /user/forgot_password is not a valid route.`,
         401
      );
   }
   const { email } = req.body;
   if (typeof email !== "string") {
      throw new ServerError("Invalid email.");
   }
   const users = db.getUsers();
   const user = users.find(
      (record) => record.data.emailAddress === email
   )?.data;
   if (!user) {
      throw new ServerError("User not found.", 401);
   }
   const emailService = db.getEmailService();
   const tokenProvider = db.getTokenProvider();
   const { value } = tokenProvider.generate(TOKENS.PASSWORD_RESET, email);
   emailService.sendEmail(
      user.emailAddress,
      `To change your password, use the token "${value}".`
   );
   return {
      status: "success",
      message: "Message sent to your email, kindly check.",
   };
}

/**
 * Resets a user's password.
 * @protected
 * @route "/user/reset_password"
 * @param {apigen.Request} req
 * @throws {apigen.ServerError}
 * @returns {SucessResponse}
 */
function resetPassword(req) {
   if (req.method !== "POST") {
      throw new ServerError(
         `${req.method} /user/reset_password is not a valid route.`,
         401
      );
   }
   const { oneTimeToken } = req.params;
   const tokenProvider = db.getTokenProvider();
   if (typeof oneTimeToken !== "string") {
      throw new ServerError("Invalid or expired token.");
   }
   const token = tokenProvider.findToken(oneTimeToken, TOKENS.PASSWORD_RESET);
   if (!token) {
      throw new ServerError("Invalid or expired token.");
   }
   const { password, confirmPassword } = req.body;
   if (typeof password !== "string") {
      throw new ServerError("Invalid password, or password not provided.");
   }
   if (password !== confirmPassword) {
      throw new ServerError(
         "Passwords do not match, or confirm password not provided."
      );
   }
   const users = db.getUsers();
   const record = users.find(
      (record) => record.data.emailAddress === token.reference
   );
   record.data.password = bcrypt.hashSync(password, 10);
   record.metadata.updatedAt = new Date().toISOString();
   tokenProvider.deleteToken(token);

   logger.inform(`Password changed for user "${record.data.username}".`);
   return {
      status: "success",
      message: "Password was reset successfully.",
   };
}

/**
 * Returns the metrics of a user so far.
 * @protected
 * @route "/user/stats"
 * @param {apigen.Request} req
 * @throws {apigen.ServerError}
 * @return {UserStatsResponse}
 */
function getUserStats(req) {
   if (req.method !== "GET") {
      throw new ServerError(
         `${req.method} /user/stats is not a valid route.`,
         401
      );
   }
   /**@type {User} */
   const user = req["user"];
   let quizzesPlayed = user.quizzesPlayed;
   let stars = user.stars;
   let successRate = user.successRate;
   logger.inform(`GET /user/stats for "${user.username}"`);
   return {
      quizzesPlayed,
      stars,
      successRate,
   };
}

/**
 * Updates the metrics of a user.
 * @protected
 * @route "/user/stats/update"
 * @param {apigen.Request} req
 * @throws {apigen.ServerError}
 * @returns {SucessResponse}
 */
function updateStats(req) {
   if (req.method !== "PUT") {
      throw new ServerError(
         `${req.method} /user/stats/update is not a valid route.`,
         401
      );
   }
   const { quizResult, starsEarned } = req.body;
   if (typeof quizResult !== "number") {
      throw new ServerError("Invalid quiz result.");
   }
   if (typeof starsEarned !== "number") {
      throw new ServerError("Invalid stars earned.");
   }
   /**@type {User} */
   const user = req["user"];
   user.quizzesPlayed += 1;
   user.successRate = (quizResult + user.successRate) / user.quizzesPlayed;
   user.stars += starsEarned;
   logger.inform(`Metrics for user "${user.username}" updated.`);
   return {
      status: "success",
      message: "Stats updated successfully.",
   };
}

/**
 * Generate a user token.
 * @param {string} id
 */
function generateUserToken(id) {
   return jwt.sign({ id }, JWT_SECRET, {
      expiresIn: "20d",
   });
}

module.exports = {
   addNewUser,
   deleteUser,
   getUserStats,
   handleForgotPassword,
   loginUser,
   resendVerificationEmail,
   resetPassword,
   updateStats,
   verifyEmail,
};
