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
                console.log(year)
                //Display (Month/Day/Year)
                $("nameEl").html(response.name + " (" + month + "/" + day + "/" + year + ") ");

                console.log(nameEl.innerText);
                //Display weather icon
                let weatherImg = response.weather[0].icon;
                console.log("Message1")
                $("currentImgEl").attr("src", "https://openweathermap.org/img/wn/" + weatherImg + "@2x.png");
                console.log("Message2")
                $("currentImgEl").attr("alt", response.weather[0].description);
                console.log("Message3")
                //Display Temp, Humidity, Wind Speed
                currentTempEl.innerHTML = "Temperature: " + k2f(response.main.temp) + " F";
                console.log(response.main.temp);
                console.log(currentTempEl.innerHTML);
                currentHumidityEl.innerHTML = "Humidity: " + response.main.humidity + "%";
                console.log(currentHumidityEl.innerHTML);
                currentWindEl.innerHTML = "Wind Speed: " + response.wind.speed + " MPH";
                console.log(currentWindEl.innerHTML);

                getUVIndex(response.coord.lat, response.coord.lon);
            });
    }

    function getUVIndex(lat, lon) {
        //Display UV Index  
        console.log(lat, lon);
        let UVQueryURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=3f61d52554cfb25b0d5c75844b1a2a65" + "&cnt=1";
        $.ajax({
            url: UVQueryURL,
            method: "GET"
        }).then(function (response) {
            let UVindex = document.createElement("span");
            $("UVindex").attr("class", "badge badge-danger");
            UVindex.innerHTML = response[0].value;
            currentUVEl.innerHTML = "UV Index: " + response[0].value;
            // currentUVEl.append(UVindex);
            console.log(response.id);
            get5DayForecast(response.id);
            
        });
    }

    //Function to Display for 5-Day Forecast
    function get5DayForecast(cityID) {
        // var cityID = response.id;
        console.log("Mess3");
        console.log(cityID);
        var forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=3f61d52554cfb25b0d5c75844b1a2a65";

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
                    forecastDateEl.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
                    forecastEls[i].append(forecastDateEl);

                    //Displays Weather Icon under Date (on each forecast)
                    var forecastWeatherEl = document.createElement("img");
                    $("forecastWeatherEl").attr("src", "https://openweathermap.org/img/wn/" + response.list[forecastIndex].weather[0].icon + "@2x.png");
                    console.log("mess")
                    forecastWeatherEl.setAttribute("alt", response.list[forecastIndex].weather[0].description);
                    console.log("mess2")
                    forecastEls[i].append(forecastWeatherEl);

                    //Displays Temperature under Weather Icon (on each forecast)
                    var forecastTempEl = document.createElement("p");
                    forecastTempEl.innerHTML = "Temp: " + k2f(response.list[forecastIndex].main.temp) + " &#176F";
                    forecastEls[i].append(forecastTempEl);

                    //Displays Humidity under Temperature (on each forecast)
                    var forecastHumdityEl = document.createElement("p");
                    forecastHumdityEl.innerHtml = "Humidity: " + response.list[forecastIndex].main.humidity + "%";
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
        historyEl.innerHTML = "";
        for (let i = 0; i < searchHistory.length; i++) {
            var history = document.createElement("input");

            history.setAttribute("type", "text")
            // history.setAttribute("readonly","true");
            history.setAttribute("class", "form-control d-block bg-white");
            history.setAttribute("value", "searchHistory[i]");
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