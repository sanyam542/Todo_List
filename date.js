

var today = new Date();
module.exports.getDate  = function() {

    
    var options = {
        weekday:"long",
        day: "numeric",
        month: "long"
    }
    
    return today.toLocaleDateString('en-US', options);

    
}
module.exports.getDay  = function() {

    
    var options = {
        weekday:"long"
    };
    
    
    return today.toLocaleDateString('en-US', options);
    
}