$( document ).ready(function() {

    $("#searchBtn").click(() =>  {
        console.log(updateClothing(getDestination(), getStartDate(), getEndDate()));
        // Fetch latitude and longitude
        // let locationFetch = Promise.resolve(getLatLong(getDestination()));
        // let locationResolve = Promise.resolve(locationFetch);
        // locationResolve.then((latLongArr) => {
        //     // fetch forecast link
        //     // console.log(fetchWeather(latLongArr));
        //     let weatherFetch = Promise.resolve(fetchWeather(latLongArr));
        //     let weatherResolve = Promise.resolve(weatherFetch);
        //     weatherResolve.then((weatherFetch) => {
        //         // fetch forecast
        //         let forecastFetch = Promise.resolve(fetchForecast(weatherFetch));
        //         let forecastResolve = Promise.resolve(forecastFetch);
        //         console.log(forecastResolv     e);
            // });
    


        emptyItinerary();
        let stay = getLengthOfStay(getStartDate(), getEndDate());
        itinerary(stay);
    });
});
    
    // Keep this stuff for enter presses
    // // Do this stuff when enter button is pressed
    // $("#searchButton").bind("enterKey", function(e) {
    //     console.log("Enter has been pressed")

    // });
    // $("#searchButton").keyup(function(e) {
    //     if(e.keyCode == 13) {
    //         $(this).trigger("enterKey");
    //     }
    // });

// });

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
 * Takes the value from the "Destination" textbox
 *
 * @param - Does not take any params
 * @return - Returns the value from the "Destination" textbox
 *
 */
function getDestination() {
    return $("#destination").val();
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
 * Empties the (previously) generated itinerary before a new search
 *
 * @param - Does not take any params
 * @return - Does not return does not return anything
 *
 */
function emptyItinerary() {
    $("#day").empty();
}

