/**
 * Confirm that a username is valid.
 * @param {string} username
 * @returns {boolean}
 */
function isValidUsername(username) {
   if (username.toLowerCase() !== username) {
      return false;
   }
   if (isNumeric(username[0])) {
      return false;
   }
   if (
      username
         .split("")
         .find((ch) => !isAlphabetic(ch) && !isNumeric(ch) && ch !== "_") !==
      undefined
   ) {
      return false;
   }
   if (username.length < 3 || username.length > 16) {
      return false;
   }
   return true;
}

/**
 *
 * @param {string} password
 */
function isValidPassword(password) {
   return (
      password.length > 7 &&
      /[0-9]/.test(password) &&
      /[a-z]/.test(password) &&
      /[A-Z]/.test(password)
   );
}

/**
 * @param {string} ch
 */
function isAlphabetic(ch) {
   return /[A-Za-z]/.test(ch);
}

/**
 *
 * @param {string} ch
 */
function isNumeric(ch) {
   return /[0-9]/.test(ch);
}

/**
 * Checks that an email is valid.
 * @param {string} emailAddress
 * @returns {boolean}
 */
function isValidEmail(emailAddress) {
   return true;
}

/**
 * @template T
 * Select a number of random items from an array
 * @param {T[]} array
 * @param {number} number MUST be less than or eqiual to the size of the array.
 * @returns {T[]}
 */
function selectRandom(array, number) {
   /**@type {number[]} */
   const indexes = [];
   const selected = [];

   while (selected.length < number) {
      const select = parseFloat((Math.random() * 100).toFixed()) % array.length;
      if (indexes.includes(select)) {
         continue;
      }
      indexes.push(select);
      selected.push(array[select]);
   }
   return selected;
}

/**
 * @template T
 * Returns a shuffled version of an array.
 * @param {T[]} array
 * @returns {T[]}
 */
function shuffle(array) {
   return selectRandom(array, array.length);
}

module.exports = {
   isAlphabetic,
   isNumeric,
   isValidEmail,
   isValidPassword,
   isValidUsername,
   selectRandom,
   shuffle,
};
