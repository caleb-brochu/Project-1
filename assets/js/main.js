$( document ).ready(function() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 47.6062, lng: 122.3321},
        zoom: 11
    });
    var service = new google.maps.places.PlacesService(map);
    var infowindow = new google.maps.InfoWindow();

    setLimitsForCalendars();
    getUserLocation();

    $("#searchBtn").click(async () =>  {
        let place = getDestination();

        emptyItinerary();
        updateClothing(getDestination(), getStartDate(), getEndDate());
        updatePlaceDuration();
        remakeMap(place, service, map);
        let avgTemp = await getWeatherData();
        getStorePosition(getStoreSuggestions(avgTemp, new google.maps.places.PlacesService(map)));
        // createMarker(getStorePosition());

    });

    // Do this stuff when enter button is pressed
    $("#destination").bind("enterKey", async function(e) {
        let place = getDestination();

        emptyItinerary();
        updateClothing(getDestination(), getStartDate(), getEndDate());
        updatePlaceDuration();
        remakeMap(place, service, map);
        let avgTemp = await getWeatherData();
        // getStoreSuggestions(avgTemp);
        getStorePosition(getStoreSuggestions(avgTemp, new google.maps.places.PlacesService(map)));
        createMarker(getStorePosition());
    });

    $("#destination").keyup(function(e) {
        if(e.keyCode == 13) {
            $(this).trigger("enterKey");
        }
    });
});

/**
 * Function description
 * Calls the necessary functions to get the average temperature during the trip
 *
 * @param - Takes no params
 * @return - Returns the average temperature
 *
 */
async function getWeatherData() {
    let tempCoords = await getLatLong(getDestination());
    let tempLink = await fetchWeather(tempCoords);
    let tempWeatherObject = await fetchForecast(tempLink);
    let avgTemp = getAverageTempOfTrip(tempWeatherObject);

    return avgTemp;
}



// Set the limits for the calendars
function setLimitsForCalendars(){
    $("#start-date").val(moment().format("YYYY-MM-DD"));
    $("#start-date").attr("min",moment().format("YYYY-MM-DD"));
    $("#end-date").attr("min",moment().format("YYYY-MM-DD"));

    $("#start-date").attr("max",moment().add(14,'days').format("YYYY-MM-DD"));
    $("#end-date").attr("max",moment().add(14,'days').format("YYYY-MM-DD"));

}

$("#end-date").click(function setEndDateLimit(){
    $("#end-date").attr("min",moment($("#start-date").val(),"YYYY-MM-DD").format("YYYY-MM-DD"))
});

/**
 * Function description
 * Gets start and end date of trip and calculates the duration of the trip 
 *
 * @param - Takes no params
 * @return - Returns destination city as a string, start-date as a string, and end-date as a string
 *
 */
function updatePlaceDuration(){
    let numDays = moment(endDate,"YYYY-MM-DD").diff(moment(startDate,"YYYY-MM-DD"),"d");
    $("#duration").text(numDays + " days");
    $("#s-destination").text(titleCase($("#destination").val()));
}

function titleCase(string) {
    var sentence = string.toLowerCase().split(" ");
    for(var i = 0; i< sentence.length; i++){
       sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
    }
    return sentence.join(" ");
}

/**
 * Function description
 * Takes the value from the "Destination" textbox
 *
 * @param - Does not take any params
 * @return - Returns the value from the "Destination" textbox
 *
 */
function getDestination() {
    return $("#destination").val().toUpperCase();
}

/**
 * Function description
 * Takes the value from the 'Leaving' Calendar Date using moment.js
 *
 * @param - Does not take any params
 * @return - Returns the start date for the trip
 *
 */
function getStartDate() {
    return moment($("#start-date").val());
}

/**
 * Function description
 * Takes the value from the 'Returning' Calendar Date using moment.js
 * 
 * @param - Does not take any params
 * @return - Returns the end date of the trip
 *
 */
function getEndDate() {
    return moment($("#end-date").val());
}

/**
 * Function description
 * Empties the (previously) generated itinerary before a new search
 *
 * @param - Does not take any params
 * @return - Does not return does not return anything
 *
 */
function emptyItinerary() {
    $("#days").empty();
    // $("#map").empty();
    $("#tops").empty("<ul>");
    $("#bottoms").empty("<ul>");
    $("#accessories").empty("<ul>");
    $("#footwear").empty("<ul>");
}

