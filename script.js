//variables
$(document).ready(function () {

    var inputEl = document.getElementById("searchInput");
    var searchEl = $("#searchBtn");

    //On click event for Search Button
    searchEl.on("click", function (event) {
        var city = $("#searchInput").val();
        event.preventDefault();
        var searchTerm = inputEl.value;
        console.log("searchTerm" + searchTerm);
        getWeatherConditions(city);
        searchHistory.push(searchTerm);
        localStorage.setItem("search", JSON.stringify(searchHistory));
        renderSearchHistory();
    })

    var nameEl = $("#currentCity");
    var currentImgEl = $("#currentCity-img");

    var currentTempEl = $("#temperature");
    var currentHumidityEl = $("#humidity");
    var currentWindEl = $("#wind-speed");
    var currentUVEl = $("#UV-index");

    var historyEl = $("#history");
    let searchHistory = JSON.parse(localStorage.getItem("search")) || [];
    console.log(searchHistory);
    var city = $("#searchInput").value;

    console.log(city)

    //Function to get current Weather conditions
    function getWeatherConditions(city) {
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=3f61d52554cfb25b0d5c75844b1a2a65";
        console.log(queryURL);
        console.log(city)

        $.ajax({
            url: queryURL,
            method: "GET"
        })
            .then(function (response) {
                console.log(response);

                var currentDate = new Date(response.dt * 1000);
                console.log(currentDate);
                var day = currentDate.getDate();
                var month = currentDate.getMonth() + 1;
                var year = currentDate.getFullYear();
    
                //Display (Month/Day/Year)
                nameEl.html(response.name + " (" + month + "/" + day + "/" + year + ") ");

                //Display weather icon
                let weatherImg = response.weather[0].icon;
                $("currentImgEl").attr("src", "https://openweathermap.org/img/wn/" + weatherImg + "@2x.png");
                
                $("currentImgEl").attr("alt", response.weather[0].description);
                console.log("Message3")

                //Display Temp, Humidity, Wind Speed
                currentTempEl.html("Temperature: " + k2f(response.main.temp) + " F");
                currentHumidityEl.html("Humidity: " + response.main.humidity + "%");
                currentWindEl.html("Wind Speed: " + response.wind.speed + " MPH");
                getUVIndex(response.coord.lat, response.coord.lon, city);
            });
    }

    function getUVIndex(lat, lon, city) {
        //Display UV Index  
        console.log(lat, lon, city);
        let UVQueryURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=3f61d52554cfb25b0d5c75844b1a2a65" + "&cnt=1";
        $.ajax({
            url: UVQueryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            let UVindex = document.createElement("span");
            UVindex.setAttribute("class", "badge badge-danger");
            UVindex.setAttribute("type", "text");
            UVindex.setAttribute("value", response[0].value);
            // UVindex.html(response[0].value);
            
            console.log(UVindex);
            var strUVIndex = JSON.stringify(UVindex); 
            console.log(strUVIndex);
            currentUVEl.html("UV Index: " + strUVIndex);            
            
            // currentUVEl.append(UVindex);

            console.log(city);
            get5DayForecast(city);
            
        });
    }

    //Function to Display for 5-Day Forecast
    function get5DayForecast(city) {
        console.log(city);
        var forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + city + "&appid=3f61d52554cfb25b0d5c75844b1a2a65";

        $.ajax({
            url: forecastQueryURL,
            method: "GET"
        })
            .then(function (response) {
                console.log(response);

                var forecastEls = document.querySelectorAll(".forecast");
                //ForLoop- Displays Forecast for each Day in 5Day Forecast
                for (i = 0; i < forecastEls.length; i++) {
                    forecastEls[i].innerHTML = "";
                    var forecastIndex = i * 8 + 4;
                    var forecastDate = new Date(response.list[forecastIndex].dt * 1000);
                    //Get Day, Month, Year
                    var forecastDay = forecastDate.getDate();
                    var forecastMonth = forecastDate.getMonth() + 1;
                    var forecastYear = forecastDate.getFullYear();

                    //Displays (Month/Day/Year) on each forecast
                    var forecastDateEl = document.createElement("p");
                    forecastDateEl.setAttribute("class", "mt-3 mb-0 forecast-date");
                    forecastDateEl.html(forecastMonth + "/" + forecastDay + "/" + forecastYear);
                    forecastEls[i].append(forecastDateEl);

                    //Displays Weather Icon under Date (on each forecast)
                    var forecastWeatherEl = document.createElement("img");
                    $("forecastWeatherEl").attr("src", "https://openweathermap.org/img/wn/" + response.list[forecastIndex].weather[0].icon + "@2x.png");
                    forecastWeatherEl.setAttribute("alt", response.list[forecastIndex].weather[0].description);
                    forecastEls[i].append(forecastWeatherEl);

                    //Displays Temperature under Weather Icon (on each forecast)
                    var forecastTempEl = document.createElement("p");
                    forecastTempEl.html("Temp: " + k2f(response.list[forecastIndex].main.temp) + " &#176F");
                    forecastEls[i].append(forecastTempEl);

                    //Displays Humidity under Temperature (on each forecast)
                    var forecastHumdityEl = document.createElement("p");
                    forecastHumdityEl.html("Humidity: " + response.list[forecastIndex].main.humidity + "%");
                    forecastEls[i].append(forecastHumdityEl);
                }

            })
    }

    //Function for Kelvin To Fahrenheit
    function k2f(K) {
        return Math.floor((K - 273.15) * 1.8 + 32);
    }


    //Function for rendering Search History
    function renderSearchHistory() {
        historyEl.html("");
        for (let i = 0; i < searchHistory.length; i++) {
            var history = document.createElement("input");

            history.setAttribute("type", "text")
            // history.setAttribute("readonly","true");
            history.setAttribute("class", "form-control d-block bg-white");
            history.setAttribute("value", searchHistory[i]);
            //add event listener 
            history.addEventListener("click", function () {
                getWeatherConditions(history.value);
            })
            //Display search history on page
            historyEl.append(history);
        }
    }

    //When page loads, this will automaticall display the last city searched for
    renderSearchHistory();
    if (searchHistory.length > 0) {
        getWeatherConditions(searchHistory[searchHistory.length - 1])
    }






})