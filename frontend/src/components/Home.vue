<template>
  <div class="home">
    <h1>2DV515 - Assignment 1</h1>

    <p id="error" v-if="error">{{error}}</p>

    <div class="section">
      <label for="person">User: </label>
      <select v-model="person" name="person" id="person">
          <option disabled value="" selected>Pick a person</option>
          <option v-for="person in people" v-bind:value="person.UserId" :key="person.UserId">
              {{person.UserId}} {{person.Name}}
          </option>
      </select>
    </div>

    <div class="section">
      <label for="algorithm"> Similarity: </label>
      <select v-model="algorithm" name="algorithm" id="algorithm">
        <option value="euclidean" selected>Euclidean</option>
        <option value="pearson">Pearson</option>
      </select>
    </div>

    <div class="section">
      <label for="number"> Results: </label>
      <input type="number" v-model="resultAmount" placeholder="" name="number" id="number">
    </div>

    <br><br>
    <button v-on:click="getData('topmatch')">Find top matching users</button>
    <button v-on:click="getData('recommend')">Find recommended movies</button>
    
    <br><br>
    <table v-if="topMatches" class="center">
      <thead>
        <th>Name</th>
        <th>ID</th>
        <th>Score</th>
      </thead>

      <tr v-for="match in topMatches" :key="match.Name">
        <td>{{match.Name}}</td>
        <td v-if="match.UserId">{{match.UserId}}</td>
        <td v-if="match.MovieId">{{match.MovieId}}</td>
        <td>{{match.score}}</td>
      </tr>
    </table>

  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Home',
  created () {
    this.getPeople()
  },
    data: function() {
        return {
            error: "",
            people: null,
            person: "",
            algorithm: "euclidean",
            resultAmount: 3,
            topMatches: null,
        }
    },
    methods: {

      getPeople: function() {
          axios.get("http://localhost:3000/users").then((response) => {
              if (response != null) {
                  this.people = response.data;
              } else {
                  console.log(response);
              }
          })
      },

      getData: function(endpoint) {
        if (this.person != "" && this.resultAmount > 0) {
          this.error = "";
          this.topMatches = null;
          let url = "http://localhost:3000/users/" + endpoint + "/" + this.person + "?algorithm=" + this.algorithm;

          axios.get(url).then((response) => {
              if (response != null) {
                  console.log(response.data);
                  if (response.data.length == 0) { // If server returns empty array
                    this.error = "No results found."
                  } else {
                    this.topMatches = response.data.slice(0, this.resultAmount);
                  }
              } else {
                this.error = response;
                console.log(response);
              }
          })

        } else { // Error handling
          this.error = "";
          if (this.person == "") {
            this.error += "Please pick a person. "
          }
          if (0 >= this.resultAmount) {
            this.error += "Please enter a valid amount of results. "
          }
        }
      }
    }
}
</script>