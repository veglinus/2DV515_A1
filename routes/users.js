var express = require('express');
const csvToJson = require('convert-csv-to-json');
var router = express.Router();

const moviesPath = "./data/movies.csv";
const ratingsPath = "./data/ratings.csv";
const usersPath = "./data/users.csv";

const euclidean = require("../functions/euclidean");
const pearson = require("../functions/pearson");

var euclideanUser = euclidean.euclideanUser;
var pearsonUser = pearson.pearsonUser;

/* Routes */
router.get("/", function(req, res) { // Get all users
  getAllUsers(function(users) {
    res.json(users);
  })
});

router.get('/topmatch/:id', function(req, res, next) {
  getTopMatchingUsers(req.params.id, req.query.algorithm, function(response) {
    res.json(response);
  });
});
router.get('/recommend/:id', function(req, res, next) {
  getRecommendedMovie(req.params.id, req.query.algorithm, function(response) {
    res.json(response);
  });
});

function getAllUsers(callback) { // Get all users
  try {
    var json = csvToJson.getJsonFromCsv(usersPath);
    callback(json);
  } catch (error) {
      throw error;
  }
}
function getAllRatings(callback) {
  try {
    var json = csvToJson.getJsonFromCsv(ratingsPath);
    callback(json);
  } catch (error) {
    throw error;
  }
}

function getTopMatchingUsers(userid, algorithm, callback) {
  try {
    var list = [];

    if (!algorithm) {
      list.push({Error: "No algorithm parameter in request, please choose pearson or euclidean"});
      callback(list);
    } else {

      // Calculate the similarity score between the user and all other users
      getAllUsers(function(allUsers) {
        allUsers.forEach(userB => {
          if (userB.UserId != userid) { // Don't compare user to itself


            // Check for algorithm used here
            if (algorithm == "euclidean") {
              euclideanUser(userid, userB.UserId, function(res) { // Compare euclidean score between chosen user and next user
                list.push({UserId: userB.UserId, Name: userB.Name, score: res}) // Add similarity score, uid and name to list
              });
            } else if (algorithm == "pearson") { // Pearson
              pearsonUser(userid, userB.UserId, function(res) {
                list.push({UserId: userB.UserId, Name: userB.Name, score: res})
              });
            }
          }
        });

        list.sort((a, b) => (b.score - a.score)); // Sort list in descending order      
        //var result = list.slice(0, 3); // Return first 3 values of list
        callback(list);
      });
    }

  } catch (error) {
      throw error;
  }
}

function getRecommendedMovie(mainUser, algorithm, callback) {

  getMoviesNotWatched(mainUser, function(moviesNotWatched) {

    // foreach user that has watched a movie toby has not seen
    getAllRatings(function(allRatings) {
      let usersToCheck = [];

      allRatings.forEach(element => {
        if (element.UserId != mainUser) { // Ignore Toby's ratings
          if (moviesNotWatched.some(e => e.MovieId === element.MovieId)) {
            usersToCheck.push(element);
          }
        }
      });

      let users = [...new Set(usersToCheck.map(x => x.UserId))]; // All unique UserIds of people who have seen movies toby hasn't
      
      let similarityMap = [];
      users.forEach(userB => {
        if (algorithm == "pearson") { // TODO: don't include person who has not watched some movies (pearson)
          pearsonUser(mainUser, userB, function(result) {
            if (result > 0) { // Similarity must be above 0
              similarityMap.push({UserId: userB, ws: result});
            }
          })
        } else if (algorithm == "euclidean") {
          euclideanUser(mainUser, userB, function(result) {
            if (result > 0) {
              similarityMap.push({UserId: userB, ws: result});
            }
          })
        } else {
          callback("Error, no algorithm supplied");
        }
      });

      let wsMap = [];
      moviesNotWatched.forEach(movie => {
        let sum = 0;
        let esim = 0;

        similarityMap.forEach(person => {
          getRatingOfMovieForUser(person.UserId, movie.MovieId, algorithm, function(rating) {

            if (algorithm == "euclidean") {
              sum += person.ws * rating.Rating;
              esim += person.ws;
            } else {
              if (rating != null) { // If there's no rating, we don't include users WS in Esim using perason
                sum += person.ws * rating.Rating;
                esim += person.ws;
              }
            }
          })
        });

        let endResult = sum / esim;
        // ews: sum, esim: esim, 
        wsMap.push({MovieId: movie.MovieId, Name: movie.Title, score: endResult});
      });
      
      wsMap.sort((a, b) => (b.score - a.score)); // Sort list in descending order 
      callback(wsMap);
    })
  });

}

function getRatingOfMovieForUser(userid, movieid, algorithm, callback) {
  getAllRatings(function(allRatings) {
    allRatings.forEach(element => {
      if (element.UserId == userid && element.MovieId == movieid) {
        callback(element);
      } else if (algorithm == "pearson") {
        callback(null);
      }
    });
  })
}

function getMoviesNotWatched(userid, callback) {
  var movies = csvToJson.getJsonFromCsv(moviesPath);

  getAllRatings(function(allRatings) {
    const moviesSeen = allRatings.filter(element => element.UserId === userid);
    let moviesNotWatched = [];

    movies.forEach(element => { // Foreach movie in movies
      //console.log(element);
      if (!moviesSeen.some(e => e.MovieId === element.MovieId)) { // Check if toby doesn't have a rating of the movie
        moviesNotWatched.push(element);
      }
    });

    // TODO: Handle if all movies have been seen, if so then moviesNotWatched is empty
    callback(moviesNotWatched);
  });
}

module.exports = router;