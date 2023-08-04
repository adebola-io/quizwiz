const { selectRandom, shuffle } = require("../lib/utils");
const logger = require("../lib/logger");
const {
   readdirSync,
   writeFileSync,
   existsSync,
   createWriteStream,
   readFileSync,
   lstatSync,

   appendFileSync
} = require("fs");

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
    * @type {UserRecord[]}
    * @private
    */
   items = [];
   /**
    * The JSON file to store the users.
    * @type {import("fs").PathLike | undefined}
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
   writeToDisk() {
      writeFileSync(this.baseFile, JSON.stringify(this.items));
   }
   /**
    * Finds a user in the list.
    * @param {(userData: UserRecord) => boolean} predicate
    */
   find(predicate) {
      return this.items.find(predicate);
   }
   /**
    * Sets the JSON file on the disk where users should be stored or retrieved from.
    * @param {import("fs").PathLike} baseFile
    */
   setBaseFile(baseFile) {
      if (!existsSync(baseFile)) {
         logger.warn(`Users JSON file is not present. Creating ${baseFile}...`);
         createWriteStream(baseFile);
         writeFileSync(baseFile, "[]");
      }
      this.baseFile = baseFile;
      this.items = JSON.parse(readFileSync(baseFile).toString());
      for (const { metadata } of this.items) {
         this.idMap.set(metadata._id, true);
      }

      // Write to disk every thirty minutes.
      setInterval(() => {
         logger.inform("Writing users to disk.");
         this.writeToDisk();
      }, 1800000);
   }
   /**
    * Adds a new user to the database and returns the user's metadata.
    * @param {User} user The user to add.
    */
   add(user) {
      /**@type {UserMetadata} */
      const metadata = {
         _id: this.createId(),
         createdAt: new Date().toISOString(),
         updatedAt: new Date().toISOString()
      };
      this.items.push({
         data: user,
         metadata
      });
      return metadata;
   }
   /**
    * Removes a user from the database.
    * @param {User} user The user to remove
    */
   remove(user) {
      this.items = this.items.filter((record) => {
         if (record.data === user) {
            this.idMap.delete(record.metadata._id);
            return false;
         }
         return true;
      });
   }
   clear() {
      this.items = [];
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
class QuestionData {
   /**
    * @type {{ [key in Categories]: Category;}}
    */
   categories = {
      "history-politics-and-geography": {
         topics: []
      },
      "language-and-literature": {
         topics: []
      },
      mathematics: {
         topics: []
      },
      "pop-culture": {
         topics: []
      },
      sports: {
         topics: []
      },
      technology: {
         topics: []
      }
   };
   /**
    * Get a list of random questions.
    * @param {RandomQuestionParams} options
    */
   random({ categoryName, number, level }) {
      logger.inform("retrieving random questions...");
      /**@type {Question[]} */
      let questions = [];
      /** @type {Category[]} */
      let categoryList = [];
      if (categoryName) {
         categoryList.push(this.categories[categoryName]);
      } else {
         categoryList.push(...Object.values(this.categories));
      }
      let MAX_ITERATION_COUNT = 3000;
      while (questions.length < number && MAX_ITERATION_COUNT--) {
         for (const category of categoryList) {
            for (const topic of category.topics) {
               const randomQuestions = selectRandom(topic[`level${level}`], 2);
               for (let randomQuestion of randomQuestions) {
                  if (questions.length === number) return shuffle(questions);
                  while (
                     questions.includes(randomQuestion) &&
                     topic[`level${level}`].find(
                        (question) => !questions.includes(question)
                     )
                  ) {
                     randomQuestion = selectRandom(
                        topic[`level${level}`],
                        1
                     )[0];
                  }
                  questions.push(randomQuestion);
               }
            }
         }
      }
      return shuffle(questions);
   }
   /**
    * Load quiz data into memory.
    * @param {import("fs").PathLike} categoryFolder
    */
   load(categoryFolder) {
      const categories = readdirSync(categoryFolder).filter((folder) =>
         lstatSync(`${categoryFolder}/${folder}`).isDirectory()
      );
      for (const category of categories) {
         const topics = readdirSync(`${categoryFolder}/${category}`);
         for (const topic of topics) {
            const topicPath = `${categoryFolder}/${category}/${topic}`;
            try {
               const topicFile = readFileSync(topicPath).toString();
               const topicObject = JSON.parse(topicFile);
               this.categories[category].topics.push(topicObject);
            } catch {
               logger.error(`An error was found while parsing ${topicPath}.`);
               process.exit(0);
            }
         }
      }
   }
   /**
    * Counts the number of quiz questions available.
    * @param {Categories} categoryName
    */
   count(categoryName = undefined) {
      let sum = 0;
      for (const [name, category] of Object.entries(this.categories)) {
         if (categoryName && categoryName !== name) {
            continue;
         }
         for (const topic of category.topics) {
            sum +=
               topic.level0.length +
               topic.level1.length +
               topic.level2.length +
               topic.level3.length +
               topic.level4.length;
         }
      }
      return sum;
   }
}

class EmailService {
   /**
    * @type {import("fs").PathLike}
    * @private
    */
   emailFile;
   /**
    * Set file that emails will be written to.
    * @param {import("fs").PathLike} file
    */
   setEmailFile(file) {
      if (!existsSync(file)) {
         createWriteStream(file);
         logger.warn(`Email JSON file is not present. Creating ${file}...`);
      }
      this.emailFile = file;
   }
   /**
    * Removes all stored emails.
    */
   clear() {
      if (this.emailFile && existsSync(this.emailFile)) {
         writeFileSync(this.emailFile, "");
      }
   }
   /**
    * Send an email.
    * @param {string} address
    * @param {string} message
    */
   sendEmail(address, message) {
      appendFileSync(
         this.emailFile,
         `\n------------------------------
EMAIL FROM SERVER 
Sent to ${address}
Received at ${logger.timeStamp()}

${message}

------------------------------\n`
      );
      logger.inform(
         `New Email sent to ${address}, stored in ${this.emailFile}`
      );
   }
}

class TokenProvider {
   ids = 0;
   /**
    * How long each token should last, in ms.
    * @private
    * @type {number}
    */
   tokenLifetime;
   /**
    * Current valid tokens
    * @private
    * @type {Map<Token, true>}
    */
   currentTokens = new Map();
   /**
    * Set how long a token should last.
    * @param {number} tokenLifetime
    */
   setLifetime(tokenLifetime) {
      this.tokenLifetime = tokenLifetime;
   }
   /**
    * Delete a token.
    * @param {Token} token
    */
   deleteToken(token) {
      if (token.timeout) {
         clearTimeout(token.timeout);
      }
      this.currentTokens.delete(token);
      logger.inform(`Token with ID ${token.id} cleared.`);
   }
   /**
    * Find a token.
    * @param {string} value
    * @param {Token['type']} type
    * @returns {Token|undefined}
    */
   findToken(value, type) {
      for (const [token] of this.currentTokens) {
         if (token.value === value && token.type == type) {
            return token;
         }
      }
   }
   /**
    * Check that a token for email verification is valid.
    * @param {string} value
    * @param {User} user
    * @param {Token['type']} type
    */
   isValidToken(value, user, type) {
      const token = this.findToken(value, type);
      return token && token.reference === user;
   }
   /**
    * Generates and keeps track of a new token.
    * @param {0|1} type
    * @param {any} reference
    */
   generate(type, reference) {
      const id = this.ids++;
      const value = `${Math.random().toString(16) + Math.random().toString(16)}`
         .split(".")
         .join("");

      /**@type {Token} */
      const token = { id, type, reference, value };

      this.currentTokens.set(token, true);
      logger.inform(
         `Token with id ${token.id} created, valid for ${(
            this.tokenLifetime / 60000
         ).toFixed(2)} minutes.`
      );
      token.timeout = setTimeout(() => {
         logger.important(
            `Token with id ${token.id} has expired and been invalidated.`
         );
         this.currentTokens.delete(token);
      }, this.tokenLifetime);
      return token;
   }
}

const users = new UserList(),
   questionData = new QuestionData(),
   emailService = new EmailService(),
   tokenProvider = new TokenProvider();

module.exports = {
   getUsers() {
      return users;
   },
   getQuestions() {
      return questionData;
   },
   getEmailService() {
      return emailService;
   },
   getTokenProvider() {
      return tokenProvider;
   },
   async prepare() {
      users.setBaseFile("src/db/users.json");
      if (process.argv.includes("--clear-db")) {
         logger.warn(
            "--clear-db argument found. Removing all users and emails..."
         );
         users.clear();
         emailService.clear();
         users.writeToDisk();
      }

      logger.inform(
         `Mock User Database is ready. ${users.length} user${
            !users.length || users.length > 2 ? "s are" : " is"
         } available.`
      );

      questionData.load("../categories");

      logger.inform(
         `Question set is ready. ${questionData.count()} questions are available.`
      );

      tokenProvider.setLifetime(300000);

      emailService.setEmailFile("src/db/emails.txt");
   }
};
