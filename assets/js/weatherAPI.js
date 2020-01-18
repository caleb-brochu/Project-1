let apiFolder = "../../../Project-1_API_keys/"
let openWeatherApiKey = $( "#result" ).load( apiFolder+"openWeather.txt", function() {
    alert( "OpenWeather Load was performed." );
});

let darkSkyApiKey = $( "#result" ).load( apiFolder+"darkSky.txt", function() {
    alert( "DarkSky Load was performed." );
});

let startDate;
let endDate;
let weatherObject;

function getWeather(loc,initDate,finalDate){
    startDate = initDate;
    endDate = finalDate;
    weatherObject = getLatLong(loc)
        .then(function (){
            weatherObject = fetchWeather(latLong)
                .then(function (){
                    console.log(weatherObject)
                    //doStuff(weatherObject);
                    //return weatherObject;
                });
        });
}

function getLatLong(place){
    
    let units = "imperial"
    let url = `http://api.openweathermap.org/data/2.5/weather?id=524901&APPID=
        ${openWeatherApiKey}&q=${place}&units=${units}`;
        
    return fetch (url)
        .then(function (response){
            return response.json();
        })
        .then(function (json){
            return [json.coord.lon,json.coord.lat];
        });
}


function fetchWeather(latLongArr){
    let latitude = latLongArr[0]
    let longitude = latLongArr[1]
    url = `https://api.darksky.net/forecast/${darkSkyAPIkey}/${latitude},${longitude}`

    return fetch (url)
        .then(function (response){
            return response.json();
        })
        .then(function (json){
            return createWeatherObject(json);
        });
    
}

function createWeatherObject(json){
    weatherObject = Object();
    let daily = json.daily.data;
    weatherObject.icon = daily.icon;
    weatherObject.tempHigh = daily.apparentTemperatureHigh;
    weatherObject.tempLow = daily.apparentTemperatureLow;
    weatherObject.uvIndex = daily.uvIndex;
    return weatherObject;
}
