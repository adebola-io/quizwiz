const fs = require("fs");
const { selectRandom, shuffle } = require("../lib/utils");

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
class QuestionData {
   /**
    * @type {{ [key in Categories]: Category;}}
    */
   categories = {
      "history-politics-and-geography": {
         topics: [],
      },
      "language-and-literature": {
         topics: [],
      },
      mathematics: {
         topics: [],
      },
      "pop-culture": {
         topics: [],
      },
      sports: {
         topics: [],
      },
      technology: {
         topics: [],
      },
   };
   /**
    * Get a list of random questions.
    * @param {RandomQuestionParams} options
    */
   random({ categoryName, number, level }) {
      /**@type {Question[]} */
      let questions = [];
      /** @type {Category[]} */
      let categoryList = [];
      if (categoryName) {
         categoryList.push(this.categories[categoryName]);
      } else {
         categoryList.push(...Object.values(this.categories));
      }
      while (questions.length < number) {
         for (const category of categoryList) {
            for (const topic of category.topics) {
               const randomQuestions = selectRandom(topic[`level${level}`], 3);
               for (let randomQuestion of randomQuestions) {
                  if (questions.length === number) return shuffle(questions);
                  while (questions.includes(randomQuestion)) {
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
    * @param {fs.PathLike} categoryFolder
    */
   load(categoryFolder) {
      const categories = fs
         .readdirSync(categoryFolder)
         .filter((folder) =>
            fs.lstatSync(`${categoryFolder}/${folder}`).isDirectory()
         );
      for (const category of categories) {
         const topics = fs.readdirSync(`${categoryFolder}/${category}`);
         for (const topic of topics) {
            const topicFile = fs
               .readFileSync(`${categoryFolder}/${category}/${topic}`)
               .toString();
            const topicObject = JSON.parse(topicFile);
            questionData.categories[category].topics.push(topicObject);
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

const users = new UserList();
const questionData = new QuestionData();
/**
 * Prepare JSON mock database for users.
 */
async function prepare() {
   users.setBaseFile("src/db/users.json");

   console.log("Mock User Database is ready.".cyan);

   questionData.load("../categories");

   console.log(`${questionData.count()} quiz questions available.`.cyan);
}
function getUsers() {
   return users;
}
function getQuestions() {
   return questionData;
}

module.exports = {
   getUsers,
   getQuestions,
   prepare,
};
