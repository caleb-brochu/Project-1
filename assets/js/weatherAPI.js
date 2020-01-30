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
let categories = {
    tops: {},
    bottoms: {},
    accessories: {},
    footwear: {}};

let clothesMaps = {
    "coat" : "tops",
    "heavy shirt" : "tops",
    "heavy pants" : "bottoms",
    "gloves" : "accessories",
    "heavy hat" : "accessories",
    "boots" : "footwear",
    "wool socks" : "footwear",
    "jacket" : "tops",
    "long sleeve shirt" : "tops",
    "pants" : "bottoms",
    "socks" : "footwear",
    "T-Shirt" : "tops",
    "shorts" : "bottoms",
    "sandals" : "footwear",

    "underwear" : "bottoms",

    // clothes based on precipitation
    "rain coat" : "accessories",
    "umbrella" : "accessories",
    "scarf" : "accessories",
    "bounce house" : "accessories"
};


let needOnlyOne = new Set(["coat","gloves","boots","jacket","rain coat","umbrella","scarf","heavy hat","bounce house"]);

function updateClothing(loc,initDate,finalDate){
    tops = {};
    bottoms = {};
    accessories = {};
    footwear = {};
    weatherArray = [];
    categories = {
        tops: {},
        bottoms: {},
        accessories: {},
        footwear: {}};

    startDate = initDate;
    endDate = finalDate;
    getLatLong(loc)
        .then(function (latLong){
            fetchWeather(latLong)
                .then(function (forecastLink){
                    fetchForecast(forecastLink)
                        .then(function (){
                            //console.log(weatherArray);
                            generateDailyHtml(weatherArray);
                            updateClothesSummary();
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


function fetchForecast(forecastLink) {
    return fetch(forecastLink)
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            return createWeatherObject(json);
        })
}   



function createWeatherObject(weatherResponse){
    
    weatherObject = Object();
    //console.log(weatherResponse);
    let weatherPeriods = weatherResponse.properties.periods;
    let curTime = moment().startOf("day");
    minDays = moment(startDate,"YYYY-MM-DD").startOf("day").diff(curTime,"d");
    maxDays = moment(endDate,"YYYY-MM-DD").startOf("day").diff(curTime,"d")+1;

    // weather.gov has max 14 day forecast
    if (maxDays > 13){
        maxDays = 13;
    }

    // loop through weather data for each day and generate object
    for (i = minDays; i <= maxDays; i++){
        let w = {};
        w["temp"] = weatherPeriods[i].temperature;
        w["precip"] = weatherPeriods[i].shortForecast;
        w["icon"] = weatherPeriods[i].icon;
        w["date"] = moment().add(i,"days").format("MM/DD");
        weatherArray.push(w);
    }
    // let daily = json.daily.data;
    // weatherObject.icon = daily.icon;
    // weatherObject.tempHigh = daily.apparentTemperatureHigh;
    // weatherObject.tempLow = daily.apparentTemperatureLow;
    // weatherObject.uvIndex = daily.uvIndex;
    return weatherArray;
}

/**
 * Function description
 * Calculates the average temperature during the duration of the trip based on forecast data
 *
 * @param - Takes weatherArray as an array of temperatures
 * @return - Returns the average temperature
 *
 */
function getAverageTempOfTrip(weatherObj) {
    let sum = 0;
    let avg = 0;
    for(let i = 0; i < weatherObj.length; i++) {
        sum += weatherObj[i].temp;
    }
    
    avg = sum / weatherArray.length;
    return avg;
}



// generate daily html from weather data
function generateDailyHtml(weatherArray) {
    // $("#days").empty();
    for (i = 0; i < weatherArray.length; i++){
        let weatherDiv = $("<div>").addClass("column has-background-grey-lighter margin rounded black-border");
        // weatherDiv.text("Weather");
        let temp = $("<div>").text(`${weatherArray[i].temp}°F`);
        temp.addClass("has-text-centered temp");
        weatherDiv.append(temp);
        let precip = $("<div>").text(weatherArray[i].precip);
        precip.addClass("has-text-centered precip");
        weatherDiv.append(precip);
        let iconDiv =$("<p>").addClass("weather-icon")
        let wIcon = $("<img>").attr("src", weatherArray[i].icon);
        wIcon.addClass(".has-image-centered icon");
        iconDiv.append(wIcon);
        weatherDiv.append(iconDiv);

        let suggestionDiv = $("<div>").addClass("column has-background-grey-lighter margin rounded black-border");
        //suggestionDiv.text("Suggestions");

        suggestionObject = getSuggestions(weatherArray[i]);
        placeDaySuggestions(suggestionObject,suggestionDiv);

        columnsDiv = $("<div>").addClass("columns is-mobile has-text-left");
        columnsDiv.append(weatherDiv);
        columnsDiv.append(suggestionDiv);

        let dateDiv = $("<div>").addClass("bottom-border-thin column date-header");
        dateDiv.text(weatherArray[i].date);

        let colDiv = $("<div>").addClass("column has-text-centered");
        colDiv.append(dateDiv);
        colDiv.append(columnsDiv);

        let mainDiv = $("<div>").addClass("columns");
        mainDiv.attr("data-day",i);
        mainDiv.append(colDiv);
        $("#days").append(mainDiv);
    }
}

function getSuggestions(weather){
    let temp = weather.temp;
    let precip = weather.precip.toLowerCase();
    let s = {};
    
    // clothes based on temperature
    if ( temp <= 30 ){
        s.coat = "coat";
        s.heavyShirt = "heavy shirt";
        s.heavyPants = "heavy pants";
        s.gloves = "gloves";
        s.heavyHat = "heavy hat";
        s.boots = "boots";
        s.woolSocks = "wool socks";
    }
    else if( temp <= 65 ){
        s.jacket = "jacket";
        s.longSleeve = "long sleeve shirt";
        s.pants = "pants";
        s.socks = "socks";
    }
    else{
        s.tShirt = "T-Shirt";
        s.shorts = "shorts";
        s.sandals = "sandals";
    }

    s.underwear = "underwear";

    // clothes based on precipitation
    if ( precip.includes("light rain") ){
        s.rainCoat = "rain coat";
    }
    else if ( precip.includes("rain") || precip.includes("showers") || precip.includes("thunderstorms")){
        s.umbrella = "umbrella";
    }

    if ( precip.includes("snow") ){
        s.scarf = "scarf";
    }

    if ( precip.includes("hail") ){
        s.bounceHouse = "bounce house";
    }

    // increment number of clothing item in category (tops, bottoms, ...)
    for (objStr of Object.values(s)){
        let clothesCatObj = categories[clothesMaps[objStr]];
        if (objStr in clothesCatObj){
            clothesCatObj[objStr] += 1;
        }
        else{
            clothesCatObj[objStr] = 1;
        }
    }

    return s;
}

function placeDaySuggestions(suggs,sDiv){
    let ul = $("<ul>")
    for (let [key, value] of Object.entries(suggs)){
        ul.append( $("<li>").text(titleCase(value)) );
    }
    sDiv.append(ul);
}

function titleCase(string) {
    var sentence = string.toLowerCase().split(" ");
    for(var i = 0; i< sentence.length; i++){
       sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
    }
    return sentence.join(" ");
}

function updateClothesSummary(){
    //$("#tops").append("<ul>");
    //$("#bottoms").append("<ul>");
    //$("#accessories").append("<ul>");
    //$("#footwear").append("<ul>");

    populateSummaryCat($("#tops"),categories["tops"]);
    populateSummaryCat($("#bottoms"),categories["bottoms"]);
    populateSummaryCat($("#accessories"),categories["accessories"]);
    populateSummaryCat($("#footwear"),categories["footwear"]);
}

function populateSummaryCat(curDiv,summaryObj){
    for (let [key, value] of Object.entries(summaryObj)){
        if (needOnlyOne.has(key)){
            curDiv.append($("<li>").text(`${titleCase(key)}: 1`));
        }
        else{
            curDiv.append($("<li>").text(`${titleCase(key)}: ${value}`));
        }
    }
}    



//getLatLong("seattle")

// // check end date is after start date
// if (moment(endDate,"YYYY-MM-DD").diff(moment(startDate,"YYYY-MM-DD")) < 0){
//     alert("End date must be after start date");
// }

// var script = document.createElement('script');
// script.type = 'text/javascript';
// script.src = 'https://momentjs.com/downloads/moment.js';
// document.head.appendChild(script);

// updateClothing("seattle","2020-01-27","2020-01-30");
