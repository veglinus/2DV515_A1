const getAllRatings = require("./getAllRatings").getAllRatings;

async function pearsonUser(mainUser, userB, callback) {
    getAllRatings(function(allRatings) {
        const mainUserRatings = allRatings.filter(element => element.UserId === mainUser);
        const userBRatings = allRatings.filter(element => element.UserId === userB);
        let sum1 = 0;
        let sum2 = 0;
        let sum1sq = 0;
        let sum2sq = 0;
        let pSum = 0;
        let n = 0;

        mainUserRatings.forEach(rA => {
            userBRatings.forEach(rB => {

                if (rA.MovieId == rB.MovieId) {
                //console.log("matching movie id: " + rA.MovieId + " Rating: " + rA.Rating + " - " + rB.Rating);

                let scoreA = parseFloat(rA.Rating);
                let scoreB = parseFloat(rB.Rating);

                sum1 += scoreA;
                sum2 += scoreB;
                sum1sq += scoreA**2;
                sum2sq += scoreB**2;
                pSum += scoreA * scoreB;
                n++;

                //console.log("pSum = " + pSum);
                }
            
            });
        });

        if (n === 0) {
        callback(0);
        } else {
        // Calculate Pearson
        let num = pSum - (sum1 * sum2 / n);
        let den = Math.sqrt((sum1sq - sum1**2 / n) * (sum2sq - sum2**2 / n));
        let result = num / den;
        callback(result);
        }
    });
}

module.exports = { pearsonUser : pearsonUser};