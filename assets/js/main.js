$("#map").css({height: "250px"});
var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -35, lng: 150.644},
        zoom: 8
    });
}

$( document ).ready(function() {
    $("#searchButton").mousedown(function() {
        emptyItinerary();
        let stay = getLengthOfStay(getStartDate(), getEndDate());
        itinerary(stay);


    });
    
    // // Do this stuff when enter button is pressed
    // $("#searchButton").bind("enterKey", function(e) {
    //     console.log("Enter has been pressed")

    // });
    // $("#searchButton").keyup(function(e) {
    //     if(e.keyCode == 13) {
    //         $(this).trigger("enterKey");
    //     }
    // });

})

/**
 * Function description
 * Renders the User Interface
 *
 * @param - Takes no params
 * @return - Does not return Anything
 *
 */
function renderUI() {
    // Summary
    // Map
    // Itinerary
}

/**
 * Function description
 * Gets information from the user (start and end date for trip and location)
 *
 * @param - Takes no params
 * @return - Returns destination city as a string, start-date as a string, and end-date as a string
 *
 */
function getLengthOfStay(startDate, endDate) {
    // If 2 out of 3 of the input fields are filled in, have the page load once the 3rd is complete
    
    var lengthOfStay = endDate.diff(startDate, "days");

    return lengthOfStay;
}

/**
 * Function description
 * Dynamically appends (insert div) div to include an itinerary for the range of dates
 * Suggests types of clothing based on weather, use switch case
 *
 * @param - 
 * @return - Does not return anything
 *
 */
function getDestination() {
    return $("#destination").val();
}

/**
 * Function description
 * Dynamically appends (insert div) div to include an itinerary for the range of dates
 * Suggests types of clothing based on weather, use switch case
 *
 * @param - 
 * @return - Does not return anything
 *
 */
function getStartDate() {
    return moment($("#start-date").val());
}

/**
 * Function description
 * Dynamically appends (insert div) div to include an itinerary for the range of dates
 * Suggests types of clothing based on weather, use switch case
 *
 * @param - 
 * @return - Does not return anything
 *
 */
function getEndDate() {
    return moment($("#end-date").val());
}



/**
 * Function description
 * Dynamically appends (insert div) div to include an itinerary for the range of dates
 * Suggests types of clothing based on weather, use switch case
 *
 * @param - 
 * @return - Does not return anything
 *
 */
function itinerary(lengthOfStay) {
    for (let i = 0; i < lengthOfStay; i++) {
        $("#day").append("<div class = 'row'>Testing</div>")
        
    }
}

/**
 * Function description
 * Displays the map
 *
 * @param - Location
 * @return - Does not return Anything
 *
 */
function emptyItinerary() {
    $("#day").empty();
}

/**
 * Function description
 * Displays the map
 *
 * @param - Location
 * @return - Does not return Anything
 *
 */




// AIzaSyA4AAkTCm_w_C8rC3a3aMGNL9WErabkNTg

// Google maps api key

// Delete this when files are merged!!!!!!!!!!!!
// function getLatLong(place){
    
//     let units = "imperial"
//     let url = `http://api.openweathermap.org/data/2.5/weather?&APPID=${openWeatherApiKey}&q=${place}&units=${units}`;
        
//     return fetch (url)
//         .then(function (response){
//             return response.json();
//         })
//         .then(function (json){
//             latLong = [json.coord.lat,json.coord.lon];
//             return latLong; //[json.coord.lon,json.coord.lat];
//         });
// }

// $("#start-date").attr("min",moment().format("YYYY-MM-DD"))
//$("#end-date").attr("min",moment().format("YYYY-MM-DD"))
