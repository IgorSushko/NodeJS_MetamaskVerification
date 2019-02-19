const fs = require('fs');


/**
 * @param {String} showingResult
 * @param {String} number
 * @returns {void} Write data to log file in JSON format
 */
module.exports.saveToLogFile = (showingResult, number) => {
  const currentTime = Date.now();
  const jsonObj = {
    cardNumber: `${number}`,
    verificationResult: `${showingResult}`,
    verificationTime: `${currentTime}`,
  };
  const jsonObjstring = JSON.stringify(jsonObj);
  fs.appendFileSync(`${process.env.FILES_ROOT_FOLDER}/data/cardValidatorLog.json`, jsonObjstring);
};
