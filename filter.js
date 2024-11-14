// Name : Shin Thant Aung
// Class: DIT/FT/1B/11
// Admin No: 2329776


function filterCarParksByCarParkNumber(Data, input) {
    var filtered = "";

    for (var i = 0; i < Data.length; i++) {
        var carPark = Data[i];
        var carParkNumber = carPark.car_park_no.toUpperCase(); // Access car_park_no property of carPark

        if (carParkNumber.startsWith(input.toUpperCase())) { // Compare with input in uppercase
            filtered += carParkNumber + "," + carPark.address + "\n";
        }
    }

    return filtered;
}

function filterGantryHeight(Data, input) {
    var gantryHeightFiltered = "";
    
    for (var i = 0; i < Data.length; i++) {
        var gantryHeight = Data[i].gantry_height.toString(); // Convert gantry_height to string
        if (gantryHeight === input) { // Check if gantryHeight matches the input value exactly
            gantryHeightFiltered += Data[i].car_park_no + "," + gantryHeight + "," + Data[i].address +"\n";
        }
    }
    
    return gantryHeightFiltered;
}


export {

    filterCarParksByCarParkNumber,
    filterGantryHeight
}

