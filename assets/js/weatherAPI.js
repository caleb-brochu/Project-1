let openWeatherApiKey = "08d83a26a547b974c4657af18b49c038";
let latLong;

// let apiFolder = "../../../Project-1_API_keys/"
// let openWeatherApiKey = $( "#result" ).load( apiFolder+"openWeather.txt", function() {
//     alert( "OpenWeather Load was performed. Key:"+ $("#result").text());
// });

// let darkSkyApiKey = $( "#result" ).load( apiFolder+"darkSky.txt", function() {
//     alert( "DarkSky Load was performed. Key:" + $("#result").text());
// });

// fetch latLong
// fetch forecastLink
// fetch forecast
// create weather object

let startDate;
let endDate;
let forecastLink;
let weatherArray = [];

function updateClothing(loc,initDate,finalDate){
    startDate = initDate;
    endDate = finalDate;
    getLatLong(loc)
        .then(function (latLong){
            fetchWeather(latLong)
                .then(function (forecastLink){
                    fetchForecast(forecastLink)
                        .then(function (){
                            console.log(weatherArray);
                            generateDailyHtml(weatherArray);
                        });
                });
        });
};

function getLatLong(place){
    
    let units = "imperial"
    let url = `http://api.openweathermap.org/data/2.5/weather?&APPID=${openWeatherApiKey}&q=${place}&units=${units}`;
        
    return fetch (url)
        .then(function (response){
            return response.json();
        })
        .then(function (json){
            latLong = [json.coord.lat,json.coord.lon];
            return latLong; //[json.coord.lon,json.coord.lat];
        });
}


function fetchWeather(latLongArr){
    let latitude = latLongArr[0];
    let longitude = latLongArr[1];
    //let exclude = "?exclude=minutely,hourly";
    //url = `https://api.darksky.net/forecast/${darkSkyApiKey}/${longitude},${latitude}${exclude}`
    url = `https://api.weather.gov/points/${latitude},${longitude}`

    return fetch (url) //{mode:"no-cors"}
        .then(function (response){
            return response.json();
        })
        .then(function (json){
            forecastLink = json.properties.forecast;
            return forecastLink;
        });
}

function fetchForecast(forecastLink){
    return fetch(forecastLink)
        .then(function (response){
            return response.json();
        })
        .then(function (json){
            //console.log(json);
            return createWeatherObject(json);
        });
};

function createWeatherObject(weatherResponse){
    
    weatherObject = Object();
    console.log(weatherResponse);
    let weatherPeriods = weatherResponse.properties.periods;
    
    maxDays = moment(endDate,"YYYY-MM-DD").diff(moment(),"d");
    minDays = moment(startDate,"YYYY-MM-DD").diff(moment(),"d");
    
    // weather.gov has max 14 day forecast
    if (maxDays > 13){
        maxDays = 13;
    }

    // loop through weather data for each day and generate object
    for (i = minDays+1; i < maxDays+1; i++){
        let w = {};
        w["temp"] = weatherPeriods[i].temperature;
        w["precip"] = weatherPeriods[i].shortForecast;
        w["icon"] = weatherPeriods[i].icon;
        w["date"] = moment().add(i-1,"days").format("MM/DD");
        weatherArray.push(w);
    }
    // let daily = json.daily.data;
    // weatherObject.icon = daily.icon;
    // weatherObject.tempHigh = daily.apparentTemperatureHigh;
    // weatherObject.tempLow = daily.apparentTemperatureLow;
    // weatherObject.uvIndex = daily.uvIndex;
    return weatherArray;
}

// generate daily html from weather data
function generateDailyHtml(weatherArray) {
    $("#days").empty();
    for (i=0;i<weatherArray.length;i++){
        let weatherDiv = $("<div>").addClass("column has-text-centered has-text-grey-lighter");
        weatherDiv.text("Weather");
        let temp = $("<div>").text(`${weatherArray[i].temp}°F`);
        weatherDiv.append(temp);
        let precip = $("<div>").text(weatherArray[i].precip);
        weatherDiv.append(precip);
        let wIcon = $("<img>").attr("src",weatherArray[i].icon);


        let suggestionDiv = $("<div>").addClass("column has-text-centered has-text-grey-lighter");
        suggestionDiv.text("Suggestions");
        columnsDiv = $("<div>").addClass("columns is-mobile");
        columnsDiv.append(weatherDiv);
        columnsDiv.append(suggestionDiv);

        let dateDiv = $("<div>").addClass("bottom-border $section-padding");
        dateDiv.text(weatherArray[i].date);

        let colDiv = $("<div>").addClass("column has-text-grey-lighter has-text-centered");
        colDiv.append(dateDiv);
        colDiv.append(columnsDiv);

        let mainDiv = $("<div>").addClass("columns has-background-dark");
        mainDiv.attr("data-day",i);
        mainDiv.append(colDiv);
        $("#days").append(mainDiv);
    }

    // <div class="columns has-background-dark" data-day="">
    //     <div class="column has-text-grey-lighter has-text-centered">
    //         <div class="bottom-border $section-padding">Date</div>
                
    //         <div class="columns is-mobile">
    //             <div class="column has-text-centered has-text-grey-lighter">
    //                 Weather
    //             </div>
    //             <div class="column has-text-centered has-text-grey-lighter">
    //                 Suggestions
    //             </div>
    //         </div>
    //     </div>
    // </div>
}

//getLatLong("seattle")

// // check end date is after start date
// if (moment(endDate,"YYYY-MM-DD").diff(moment(startDate,"YYYY-MM-DD")) < 0){
//     alert("End date must be after start date");
// }

var script = document.createElement('script');
script.type = 'text/javascript';
script.src = 'https://momentjs.com/downloads/moment.js';
document.head.appendChild(script);

updateClothing("seattle","2020-01-22","2020-01-25");
