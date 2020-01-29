$( document ).ready(function() {
    getUserLocation();
    // initMap(getLatLong(getUserLocation()));
    $("#searchBtn").click(async () =>  {
        emptyItinerary();
        updateClothing(getDestination(), getStartDate(), getEndDate());
        updatePlaceDuration();
        let location = await getLatLong(getDestination());
        initMap(location);
    });
});
    
    // Do this stuff when enter button is pressed
    $("#searchBtn").bind("enterKey", async function(e) {
        emptyItinerary();
        updateClothing(getDestination(), getStartDate(), getEndDate());
        updatePlaceDuration();
        let location = await getLatLong(getDestination());
        initMap(location);
    });
    $("#searchBtn").keyup(function(e) {
        if(e.keyCode == 13) {
            $(this).trigger("enterKey");
        }
    });

// });

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
    $("#s-destination").text($("#destination").val());
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
    $("#map").empty();
    $("#test").empty();
    $("#tops").empty("<ul>");
    $("#bottoms").empty("<ul>");
    $("#accessories").empty("<ul>");
    $("#footwear").empty("<ul>");
}
