const getAllRatings = require("./getAllRatings").getAllRatings;

async function euclideanUser(mainUser, userB, callback) {
    getAllRatings(function(allRatings) {
    const mainUserRatings = allRatings.filter(element => element.UserId === mainUser);
    const userBRatings = allRatings.filter(element => element.UserId === userB);
    let sim = 0;
    let n = 0;

    mainUserRatings.forEach(rA => {
        userBRatings.forEach(rB => {
        if (rA.MovieId == rB.MovieId) {
            let scoreA = parseFloat(rA.Rating);
            let scoreB = parseFloat(rB.Rating);
            sim += (scoreA - scoreB)**2;
            n += 1;
        }
        });
    });

    if (n === 0) {
        callback(0);
    } else {
        var result = 1 / (1 + sim);
        callback(result);
    }
    });
}
  
module.exports = { euclideanUser : euclideanUser};