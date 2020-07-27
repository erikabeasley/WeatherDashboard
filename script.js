//variables
$(document).ready(function () {

    var inputEl = document.getElementById("searchInput");
    var searchEl = $("#searchBtn");

    //On click event for Search Button
    searchEl.on("click", function (event) {
        var city = $("#searchInput").val();
        event.preventDefault();
        var searchTerm = inputEl.value;
        getWeatherConditions(city);
        searchHistory.push(searchTerm);
        localStorage.setItem("search", JSON.stringify(searchHistory));
        renderSearchHistory();
    })

    var nameEl = $("#currentCity");
    // var currentImgEl = $("#currentCity-img");

    var currentTempEl = $("#temperature");
    var currentHumidityEl = $("#humidity");
    var currentWindEl = $("#wind-speed");
    var currentUVEl = $("#UV-index");

    var historyEl = $("#history");
    let searchHistory = JSON.parse(localStorage.getItem("search")) || [];
    var city = $("#searchInput").value;


    //Function to get current Weather conditions
    function getWeatherConditions(city) {
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=3f61d52554cfb25b0d5c75844b1a2a65";

        $.ajax({
            url: queryURL,
            method: "GET"
        })
            .then(function (response) {

                var currentDate = new Date(response.dt * 1000);
                var day = currentDate.getDate();
                var month = currentDate.getMonth() + 1;
                var year = currentDate.getFullYear();

                //Display City Name and (Month/Day/Year)
                var dateEl = response.name + " (" + month + "/" + day + "/" + year + ") ";
                nameEl.html(dateEl);
                                
                //Display weather icon
                var weatherImg = "https://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png";
                
                // currentImgEl.src(weatherImg);
                $("#currentCity-img").attr("src", weatherImg);
                $("#currentCity-img").attr("alt", response.weather[0].description);
        
                //Display Temp, Humidity, Wind Speed
                currentTempEl.html("Temperature: " + k2f(response.main.temp) + " F");
                currentHumidityEl.html("Humidity: " + response.main.humidity + "%");
                currentWindEl.html("Wind Speed: " + response.wind.speed + " MPH");
                getUVIndex(response.coord.lat, response.coord.lon, city);
            });
    }

    function getUVIndex(lat, lon, city) {
        //Display UV Index  
        let UVQueryURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=3f61d52554cfb25b0d5c75844b1a2a65" + "&cnt=1";
        $.ajax({
            url: UVQueryURL,
            method: "GET"
        }).then(function (response) {
            if (response[0].value <=4)
                var UVindex = $("<span>").attr("class", "badge badge-success").attr("type", "text").text(response[0].value)
            
            else if (response[0].value >=5 && response[0].value <=8)
                var UVindex = $("<span>").attr("class", "badge badge-warning").attr("type", "text").text(response[0].value)
            else
                var UVindex = $("<span>").attr("class", "badge badge-danger").attr("type", "text").text(response[0].value)

            currentUVEl.html("UV Index: ")
            currentUVEl.append(UVindex);
            get5DayForecast(city);

        });
    }

    //Function to Display for 5-Day Forecast
    function get5DayForecast(city) {

        var forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=3f61d52554cfb25b0d5c75844b1a2a65";

        $.ajax({
            url: forecastQueryURL,
            method: "GET"
        })
            .then(function (response) {

                var forecastEl = $(".forecast");
                var forecastTemp = $("#forecastTemp");
                
                //ForLoop- Displays Forecast for each Day in 5Day Forecast
                for (i = 0; i < forecastEl.length; i++) {
                    forecastEl[i].innerHTML = "";
                    var forecastIndex = i * 8 + 4;
                    var forecastDate = new Date(response.list[forecastIndex].dt * 1000);
                    console.log(forecastDate);

                    //Get Day, Month, Year
                    var forecastDay = forecastDate.getDate();
                    var forecastMonth = forecastDate.getMonth() + 1;
                    var forecastYear = forecastDate.getFullYear();

                    //Displays (Month/Day/Year) on each forecast
                    var forecastDateY = forecastMonth + "/" + forecastDay + "/" + forecastYear;
                    $("forecastDateY").attr("class", "mt-3 mb-0 forecast-date");                             
                    forecastEl[i].append(forecastDateY);

                    //Displays Weather Icon under Date (on each forecast)
                    var forecastImg = "https://openweathermap.org/img/wn/" + response.list[forecastIndex].weather[0].icon + "@2x.png"
                    $("#forecastWeatherImg").attr("src", forecastImg);
                    $("#forecastWeatherImg").attr("alt", response.list[forecastIndex].weather[0].description);

                    //Displays Temperature under Weather Icon (on each forecast)
                    var forecastTempEl = "Temp: " + k2f(response.list[forecastIndex].main.temp) + " F"
                    console.log(forecastTempEl);
                    forecastTemp.append(forecastTempEl);

                    //Displays Humidity under Temperature (on each forecast)
                    var forecastHumdityEl = document.createElement("p");
                    forecastHumdityEl.html("Humidity: " + response.list[forecastIndex].main.humidity + "%");
                    forecastEl[i].append(forecastHumdityEl);
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