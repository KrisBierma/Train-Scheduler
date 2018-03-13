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

    // if (snapshot.child("name").exists() && snapshot.child("otherName").exists()){
    //     set them;
    // }

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

        //calculate next arrival
        getTime(); //gets current time

        //convert firstTime (from user input) to minutes
        var f = data.firstTime.split(":");
        f = (+f[0]) * 60 + (+f[1]);
        console.log("firstTime in min:"+f);

        //temporary var
        var time = parseInt(f) + parseInt(data.frequency); 
        console.log("temp time (firstTime+freq: "+time);
        var nextArrival;
        var arrivalKnown = false;

        //does it work if starting time if beyond current time?
        while (!arrivalKnown){
            if (time > currentTime){
                nextArrival = time;
                arrivalKnown=true;
                console.log("nextArr: "+nextArrival);
            }
            else if (time === currentTime){
                nextArrival = time;
                console.log("nextArr: "+nextArrival);
                arrivalKnown=true;
            }
            else {
                time = parseInt(time) + parseInt(data.frequency);
                console.log("nextArr is time: "+time);
            };
            
            //calculate minutes away
            var minAway = parseInt(nextArrival) - parseInt(currentTime);
            console.log("minAway: "+minAway);
        };



        //create new tr and insert data into html
        var newTableRow = $("<tr>");
        var newDataName = $("<td>").text(data.name);
        var newDataDest = $("<td>").text(data.destination);
        var newDataFrequency = $("<td>").text(data.frequency);
        var newDataNextArrival=$("<td>").text(convertMinutes(nextArrival));
        var newDataMinutesAway=$("<td>").text(minAway);


        newTableRow.append(newDataName, newDataDest, newDataFrequency, newDataNextArrival, newDataMinutesAway);
        $("tbody").append(newTableRow);
    };//end if statement
});//end "child_added"

//function to get current time
var currentTime;
function getTime(){
    //convert first train time to minutes
    var rightNow=new Date();
    var hours = rightNow.getHours();
    var minutes = rightNow.getMinutes();
    currentTime= hours * 60 + minutes; //converts current time to minutes
    console.log("currentTime:"+currentTime); //correct
};

//converts minutes into HH:MM
function convertMinutes(event){
    console.log("event should be temp time:" +event);//correct
    //event = time in minutes
    var m = event%60;
    // if (m===0){
    //     m=00;
    // };
    var h = Math.floor(event/60);
    var convertedTime = h + ":" + m;
    console.log("Should be temp time in HH:MM " +convertedTime);//correct
    return convertedTime;
};

//Capitalize first letter of train name and destination
function capUpper(name){
    return name.charAt(0).toUpperCase() + name.slice(1);
};


});//end doc.ready

//continually update 
//users from different machines able to view
//add extra 0 to end of next arrival time