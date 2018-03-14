$(document).ready(function() {

// Initialize Firebase
var config = {
    apiKey: "AIzaSyAet3nogZ_KgQwlrzsIel9CYQrIBJ7CgNE",
    authDomain: "trainscheduler-7c860.firebaseapp.com",
    databaseURL: "https://trainscheduler-7c860.firebaseio.com",
    projectId: "trainscheduler-7c860",
    storageBucket: "",
    messagingSenderId: "234534350052"
};
firebase.initializeApp(config);

//var to hold database info
var database = firebase.database();

//virtual clock on webpage
updateClock();
function updateClock(){
    $("#clock").html(moment().format('LTS'));
}

//set interval so next arrival and minutes away refreshes every minute
setInterval(updateClock, 1000);
setInterval(updateTimes, 1000*60);//change to 60

//reset HTML form to empty
$("#form")[0].reset();

//on click of submit function of all below
$("#submit").on("click", function(event){
    event.preventDefault();

    //if not all included, alert
        if($("#train-name").val() ==""){
            alert("Train name is missing.");
            return false;
        }
        if($("#train-dest").val()==""){
            alert("Train destination is missing.");
            return false;
        }
        if($("#train-first-time").val()==""){
            alert("Train's first departure time is missing.");
            return false;
        }
        if($("#train-frequency").val()==""){
            alert("Train frequency is missing.");
            return false;
        }

    //get info from form
        var trainName=$("#train-name").val().trim();
        var dest=$("#train-dest").val().trim();
        var firstTime=$("#train-first-time").val().trim();
        var frequency=$("#train-frequency").val().trim();
        console.log(trainName, dest, firstTime, frequency);

    //conditional to keep out blank info
    if(trainName!="" && dest!="" && firstTime!="" && frequency!=""){
    //store info for each train in new database object:
        database.ref().push({
            name:capUpper(trainName),
            destination:capUpper(dest),
            firstTime:firstTime,
            frequency:frequency,
        });
    };

    $("#form")[0].reset();
}); //end on.click submit

database.ref().on("child_added", function(snapshot){
    if (snapshot.val()){
        var data = snapshot.val();
        getTime(); //gets current time

        //convert firstTime (from user input) to minutes
        var f = data.firstTime.split(":");
        f = (+f[0]) * 60 + (+f[1]);

        //makes sure firstTime is before currentTime
        if (f > currentTime) {
            f = f - 1440;
        };

        var time = parseInt(f) + parseInt(data.frequency); 

        var nextArrival;
        var arrivalKnown = false;

        while (!arrivalKnown){
            if (time > currentTime){
                nextArrival = time;
                arrivalKnown=true;
            }
            else if (time === currentTime){
                nextArrival = time;
                arrivalKnown=true;
            }
            else {
                time = parseInt(time) + parseInt(data.frequency);
            };
            
            var minAway = parseInt(nextArrival) - parseInt(currentTime);
            if (minAway===0){
                minAway = "Now Boarding";
            };
        };

        //create new tr and insert data into html
        var newTableRow = $("<tr id="+snapshot.key+">");
        var newDataName = $("<td>").text(data.name);
        var newDataDest = $("<td>").text(data.destination);
        var newDataFrequency = $("<td>").text(data.frequency);
        var newDataNextArrival=$("<td id=nextArr"+snapshot.key+">").text(convertMinutes(nextArrival));
        var newDataMinutesAway=$("<td id='minAway"+snapshot.key+"'>").text(minAway);
        var newBtn=$("<td><button class='deleteBtn btn' id='deleteBtn btn'>Delete</button>");

        newTableRow.append(newDataName, newDataDest, newDataFrequency, newDataNextArrival, newDataMinutesAway, newBtn);
        $("tbody").append(newTableRow);
    };
});//end "child_added"

//calculate next arrival and minutes away
function updateTimes(){
    database.ref().on("value", function(snapshot){
        snapshot.forEach(function(childSnap){
            getTime();
            var data = childSnap.val();

            var f = data.firstTime.split(":");
            f = (+f[0]) * 60 + (+f[1]);

            //makes sure firstTime is before currentTime
            if (f > currentTime) {
                f = f - 1440;
            };

            var time = parseInt(f) + parseInt(data.frequency); 

            var nextArrival;
            var arrivalKnown = false;

            while (!arrivalKnown){
                if (time > currentTime){
                    nextArrival = time;
                    arrivalKnown=true;
                }
                else if (time === currentTime){
                    nextArrival = time;
                    arrivalKnown=true;
                }
                else {
                    time = parseInt(time) + parseInt(data.frequency);
                };
                
                var minAway = parseInt(nextArrival) - parseInt(currentTime);
                if (minAway===0){
                    minAway = "Now Boarding";
                };
            };

            $("#nextArr"+childSnap.key).text(convertMinutes(nextArrival));
            $("#minAway"+childSnap.key).text(minAway);
        });
    });
};//end function updateTimes

//function to get current time
var currentTime;
function getTime(){
    var hours=moment().format("H");
    var minutes=moment().format("mm");
    currentTime=parseInt(hours) * 60 + parseInt(minutes);
};

// converts minutes to HH:MM
function convertMinutes(event){
    var m = event%60;
    var h = Math.floor(event/60);
    var convertedTime;
    return moment.utc().hours(h).minutes(m).format("hh:mm A");
};

//Capitalize first letter of train name and destination
function capUpper(name){
    return name.charAt(0).toUpperCase() + name.slice(1);
};

$(document).on("click", ".deleteBtn", function(e){
    var rowId=e.target.parentElement.parentElement.id;
    $(this).parents('tr').remove(); //removes tr
    database.ref().child(rowId).remove(); //removes info from db
});

});//end doc.ready