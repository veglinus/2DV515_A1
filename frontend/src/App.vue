<template>
  <div id="app">
    <Home/>
  </div>
</template>

<script>
import Home from './components/Home.vue'

export default {
  name: 'App',
  components: {
    Home
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 40px;
}
.section {
  display: inline-block;
  margin-left: 1%;
  margin-right: 1%;
}
input[type=number] {
  width: 30px;
  text-align: center;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
#error {
  font-weight: bolder;
  color: red;
}
.center {
  margin-left: auto;
  margin-right: auto;
}

table {
  text-align: left;
}

th, td {
  padding: 5px 10px;
}

button {
  margin-left: 1%;
  margin-right: 1%;
}
/*
tr:nth-child(odd) {
  background: rgb(224, 224, 224);
}
*/
</style>
