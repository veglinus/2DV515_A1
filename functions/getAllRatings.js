const ratingsPath = "./data/ratings.csv";
const csvToJson = require('convert-csv-to-json');

function getAllRatings(callback) {
    try {
      var json = csvToJson.getJsonFromCsv(ratingsPath);
      callback(json);
    } catch (error) {
      throw error;
    }
}

module.exports = {getAllRatings : getAllRatings}