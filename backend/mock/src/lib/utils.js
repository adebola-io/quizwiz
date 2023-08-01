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
   return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailAddress);
}

/**
 * @template T
 * Select a number of random items from an array
 * @param {T[]} array
 * @param {number} number MUST be less than or eqiual to the size of the array.
 * @returns {T[]}
 */
function selectRandom(array, number) {
   if (array.length === 0) return [];
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
      if (selected.length === array.length) break;
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

/**
 * Converts a string with spaces, commas and capital letters into hyphenated text.
 * @param {string} input
 */
function hyphenate(input) {
   return input
      .replace(/\.|,/g, "")
      .replace(/\s+[A-Za-z0-9]/g, (match) => {
         return "-" + match.trim();
      })
      .toLowerCase();
}

const dates = {
   /**
    * Compares two days and returns true if a is later than b.
    * @param {Date} a
    * @param {Date} b
    */
   isLater(a, b) {
      const yearA = a.getFullYear();
      const yearB = b.getFullYear();
      if (yearA < yearB) {
         return false;
      }
      if (yearA > yearB) {
         return true;
      }
      const isSameYear = yearA === yearB;
      const monthA = a.getMonth();
      const monthB = b.getMonth();
      if (isSameYear && monthA < monthB) {
         return false;
      }
      if (isSameYear && monthA > monthB) {
         return true;
      }
      const isSameMonth = monthA && monthB;
      const dateA = a.getDate();
      const dateB = b.getDate();
      if (isSameYear && isSameMonth && dateA < dateB) {
         return false;
      }
      if (isSameYear && isSameMonth && dateA > dateB) {
         return true;
      }
      const isSameDay = dateA === dateB;
      if (isSameYear && isSameMonth && isSameDay) {
         return false;
      }
      return true;
   },
};

module.exports = {
   isAlphabetic,
   isNumeric,
   isValidEmail,
   isValidPassword,
   isValidUsername,
   selectRandom,
   shuffle,
   dates,
   hyphenate,
};
