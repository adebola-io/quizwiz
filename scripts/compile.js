const fs = require("fs");
const { readAll, randomize } = require("../utils");

/** @type {Question[]} */
let compiled = [];

const files = readAll("topics");
for (const file of files) {
   let questions = JSON.parse(file);
   for (const question of questions) {
      compiled.push(question)
   }
}

const arguments = process.argv;
const isRandom = arguments.includes("--random");
if (isRandom) {
   compiledFiles = randomize(compiledFiles);
}

let result = `compiled${isRandom ? "-random" : ""}.json`;
fs.createWriteStream(result);
fs.writeFileSync(result, JSON.stringify(compiled));