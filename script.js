//variables
const inputEl = document.getElementById("searchInput");
const searchEl = document.getElementById("searchBtn");

// const clearEl = document.getElementById("clear-history");
const nameEl = document.getElementById("currentCity-display");
const currentImgEl = document.getElementById("currentCity-img");

const currentTempEl = document.getElementById("temperature");
const currentHumidityEl = document.getElementById("humidity"); 4
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

            var currentDate = new Date(response.data.dt * 1000);
            var day = currentDate.getDate();
            var month = currentDate.getMonth() +1;
            var year = currentDate.getFullYear();
            //Display (Month/Day/Year)
            nameEl.innerHTML = response.data.name + " (" + month + "/" + day + "/" + year + ") ";
            //Display weather icon
            let weatherImg = response.data.weather[0].icon;
            currentImgEl.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherImg + "@2x.png");
            currentImgEl.setAttribute("alt", response.data.weather[0].description);
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
                    UVindex.setAttribute("class", "badge badge-danger");
                    UVindex.innerHTML = response.data[0].value;
                    currentUVEl.innerHTML = "UV Index: ";
                    currentUVEl.append(UVindex);
                });
        });
}

//Function to get 5-Day Forecast
let cityID = response.data.id;
let forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + APIKey;

function get5DayForecast(response) {
    $.ajax({
        url: forecastQueryURL,
        method: "GET"
    })
        .then(function (response) {
            console.log(response);

            var forecastEls = document.querySelectorAll(".forecast");
            //ForLoop- Displays Forecast for each Day in 5Day Forecast
            for (i = 0, i < forecastEls.length, i++) {
                forecastEls[i].innerHTML = "";
                var forecastIndex = i * 8 + 4;
                var forecastDate = new Date(response.data.list[forecastIndex].dt * 1000);
                //Get Day, Month, Year
                var forecastDay = forecastDate.getDate();
                var forecastMonth = forecastDate.getMonth() +1;
                var forecastYear = forecastDate.getFullYear();

                //Displays (Month/Day/Year) on each forecast
                var forecastDateEl = document.createElement("p");
                forecastDateEl.setAttribute("class", "mt-3 mb-0 forecast-date");
                forecastDateEl.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
                forecastEls[i].append(forecastDateEl);

                //Displays Weather Icon under Date (on each forecast)
                var forecastWeatherEl = document.createElement("img");
                forecastWeatherEl.setAttribute("src", "https://openweathermap.org/img/wn/" + response.data.list[forecastIndex].weather[0].icon + "@2x.png");
                forecastWeatherEl.setAttribute("alt", response.data.list[forecastIndex].weather[0].description);
                forecastEls[i].append(forecastWeatherEl);

                //Displays Temperature under Weather Icon (on each forecast)
                var forecastTempEl = document.createElement("p");
                forecastTempEl.innerHTML = "Temp: " + k2f(response.data.list[forecastIndex].main.temp) + " &#176F";
                forecastEls[i].append(forecastTempEl);

                //Displays Humidity under Temperature (on each forecast)
                var forecastHumdityEl = document.createElement("p");
                forecastHumdityEl.innerHtml = "Humidity: " + response.data.list[forecastIndex].main.humidity + "%";
                forecastEls[i].append(forecastHumdityEl);
            }

        })

} 