//variables
const inputEl = document.getElementById("searchInput");
const searchEl = document.getElementById("searchBtn");

// const clearEl = document.getElementById("clear-history");
const nameEl = document.getElementById("currentCity-display");
const currentImgEl = document.getElementById("currentCity-img");

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
        console.log(response);
        
        var currentDate = new Date(response.data.dt*1000);
        var day = currentDate.getDate();
        var month = currentDate.getMonth();
        var year = currentDate.getFullYear();
        //Display (Month/Day/Year)
        nameEl.innerHTML = response.data.name + " (" + month + "/" + day + "/" + year + ") ";
        //Display weather icon
        let weatherImg = response.data.weather[0].icon;
        currentImgEl.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherImg + "@2x.png");
        currentImgEl.setAttribute("alt",response.data.weather[0].description);
        //Display Temp, Humidity, Wind Speed
        currentTempEl.innerHTML = "Temperature: " + k2f(response.data.main.temp) + "F";
        currentHumidityEl.innerHTML = "Humidity: " + response.data.main.humidity + "%";
        currentWindEl.innerHTML = "Wind Speed: " + response.data.wind.speed + " MPH";
        //Display UV Index
        let lat = response.data.coord.lat;
        let lon = response.data.coord.lon;
        let UVQueryURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&cnt=1";
            $.ajax({
                url: UVQueryURL,
                method: "GET"
            })
            .then(function (response) {
                let UVindex = document.createElement("span");
                UVindex.setAttribute("class","badge badge-danger");
                UVindex.innerHTML = response.data[0].value;
                currentUVEl.innerHTML = "UV Index: ";
                currentUVEl.append(UVindex);
            });
    });
}

//Function to get 5-Day Forecast
