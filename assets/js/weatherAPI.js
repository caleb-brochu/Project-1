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
let clothesSummary = {};
let tops = {};
let bottoms = {};
let accessories = {};
let footwear = {};

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

let clothesStrToVar = {
    "tops" : tops,
    "bottoms" : bottoms,
    "footwear" : footwear,
    "accessories" : accessories
}

let needOnlyOne = new Set(["coat","gloves","boots","jacket","rain coat","umbrella","scarf","bounce house"]);

function updateClothing(loc,initDate,finalDate){
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
    //console.log(weatherResponse);
    let weatherPeriods = weatherResponse.properties.periods;
    let curTime = moment();
    minDays = moment(startDate,"YYYY-MM-DD").diff(curTime,"d");
    maxDays = moment(endDate,"YYYY-MM-DD").diff(curTime,"d")+1;
    //console.log(minDays);
    //console.log(maxDays);
    //console.log(endDate,maxDays,curTime);
    //console.log();
    // weather.gov has max 14 day forecast
    if (maxDays > 13){
        maxDays = 13;
    }

    // loop through weather data for each day and generate object
    for (i = minDays+1; i <= maxDays+1; i++){
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
    //$("#days").empty();
    for (i = 0; i < weatherArray.length; i++){
        let weatherDiv = $("<div>").addClass("column");
        weatherDiv.text("Weather");
        let temp = $("<div>").text(`${weatherArray[i].temp}°F`);
        weatherDiv.append(temp);
        let precip = $("<div>").text(weatherArray[i].precip);
        weatherDiv.append(precip);
        let wIcon = $("<img>").attr("src",weatherArray[i].icon);


        let suggestionDiv = $("<div>").addClass("column");
        suggestionDiv.text("Suggestions");

        suggestionObject = getSuggestions(weatherArray[i]);
        placeDaySuggestions(suggestionObject,suggestionDiv);

        columnsDiv = $("<div>").addClass("columns is-mobile");
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

function getSuggestions(weather){
    let temp = weather.temp;
    let precip = weather.precip.toLowerCase();
    let s = {};

    // let heavyJackets = 0;
    // let lightJackets = 0;
    // let tShirts = 0;

    // let tops = 0;
    // let bottoms = 0;
    // let accessories = 0;
    
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
    else if ( precip.includes("rain") ){
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
        let clothesCatObj = clothesStrToVar[clothesMaps[objStr]];
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

    populateSummaryCat($("#tops"),tops);
    populateSummaryCat($("#bottoms"),bottoms);
    populateSummaryCat($("#accessories"),accessories);
    populateSummaryCat($("#footwear"),footwear);
}

function populateSummaryCat(curDiv,summaryObj){
    for (let [key, value] of Object.entries(summaryObj)){
        if (key in needOnlyOne){
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
