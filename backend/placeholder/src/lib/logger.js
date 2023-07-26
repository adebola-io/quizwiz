const { reset } = require("colors");
const { appendFile, existsSync, createWriteStream, mkdirSync } = require("fs");

module.exports = {
   /**
    * Returns a time stamp.
    */
   timeStamp() {
      const date = new Date();
      let hours = date.getHours();
      let minutes = date.getMinutes();
      let seconds = date.getSeconds();
      let isPM;
      if (hours > 12) {
         hours = hours % 12;
         isPM = true;
      } else isPM = false;
      const hour_string = hours < 10 ? `0${hours}` : hours.toString();
      const minutes_string = minutes < 10 ? `0${minutes}` : minutes.toString();
      const seconds_string = seconds < 10 ? `0${seconds}` : seconds.toString();
      return `${hour_string}:${minutes_string}:${seconds_string} ${
         isPM ? "pm" : "am"
      }`;
   },
   /**
    * @private
    * @param {string} message
    */
   writeToDisc(message) {
      message = reset(message);
      if (!existsSync("./log")) {
         mkdirSync("./log");
      }
      const date = new Date();
      const file = `./log/${date.getFullYear()}-${
         date.getMonth() + 1
      }-${date.getDate()}`;
      if (!existsSync(file)) createWriteStream(file);
      appendFile(file, `\n${this.timeStamp()} - ${message}`, (err) => {
         if (err) throw err;
      });
   },
   /**
    * Logs a red error to the console.
    * @param {string} message
    */
   error(message) {
      console.log(`${this.timeStamp().gray} - ${message.red}`);
      this.writeToDisc(message);
   },
   /**
    * Logs a green success message to the console.
    * @param {string} message
    */
   success(message) {
      console.log(`${this.timeStamp().gray} - ${message.green}`);
      this.writeToDisc(message);
   },
   /**
    * Logs a warning to the console.
    * @param {string} message
    */
   warn(message) {
      console.clear();
      console.log(`${this.timeStamp().gray} - ${message.yellow}`);
      this.writeToDisc(message);
   },
   /**
    * Logs info to the console.
    * @param {string} message
    */
   inform(message) {
      console.log(`${this.timeStamp().gray} - ${message.blue}`);
      this.writeToDisc(message);
   },
};
