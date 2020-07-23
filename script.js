//variables
const inputEl = document.getElementById("searchInput");
const searchEl = document.getElementById("searchBtn");

// const clearEl = document.getElementById("clear-history");
const nameEl = document.getElementById("currentCity-display");
const currentPicEl = document.getElementById("currentCity-img");

const currentTempEl = document.getElementById("temperature");
const currentHumidityEl = document.getElementById("humidity");4
const currentWindEl = document.getElementById("wind-speed");
const currentUVEl = document.getElementById("UV-index");

// const historyEl = document.getElementById("history");
let searchHistory = JSON.parse(localStorage.getItem("search")) || [];
console.log(searchHistory);

//API Key
var apiKey = "&appid=afaa8eea1769b4359fd8e07b2efcefbd";

//Function to get current Weather conditions
function getWeatherConditions(response) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + apiKey;

    $.ajax({
        url: queryURL,
        method: "GET"
    })
    .then(function (response) {


    })

}
