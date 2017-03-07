// convert date into type of date format needed

var makeDate = function(){

    // create variable ' d ' that will make a date
    var d = new Date();

    // start with empty string
    var formattedDate = "";

    // add month to string (added +1 because js starts index with 0 and that won't work sir)
    formattedDate += (d.getMonth() + 1) + "_";

    // add date to string
    formattedDate += d.getDate() + "_";

    // add year to string
    formattedDate += d.getFullYear();

    // return the fully formatted date
    return formattedDate;

};

// export the date sso it can be used throughout the program
module.exports = makeDate;