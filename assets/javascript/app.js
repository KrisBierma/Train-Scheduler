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

//hold trainId in database so it doesn't overwrite info or reset to 0
var trainId=database.get(trainId);
console.log(trainId);

//reset HTML form to empty
$("#form")[0].reset();

var currentTime;
function getTime(){
    //convert first train time to minutes
    var rightNow=new Date();
    var hours = rightNow.getHours();
    var minutes = rightNow.getMinutes();
    currentTime= hours * 60 + minutes; //converts current time to minutes
    console.log("currentTime:"+currentTime); //correct
};

//on click of submit function of all below
$("#submit").on("click", function(event){
    event.preventDefault();
    getTime();

    trainId++;
    // $(".form-group").reset();

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
    var trainName=$("#train-name").val().trim().toUpperCase();
    var dest=$("#train-dest").val().trim().toUpperCase();
    var firstTime=$("#train-first-time").val().trim();
    var frequency=$("#train-frequency").val().trim();
    console.log(trainName, dest, firstTime, frequency);
    //give each entry a trainId

    //convert firstTime to minutes
    var f = firstTime.split(":");
    firstTime = (+f[0]) * 60 + (+f[1]);
    console.log("firstTime in min:"+firstTime);//correct

    //calculate next arrival and minutes away
    var time = parseInt(firstTime) + parseInt(frequency); //temporary var
    console.log("temp time (firstTime+freq: "+time);//correct
    var nextArrival;
    var arrivalKnown = false;

    //does it work if starting time if beyond current time?
    while (!arrivalKnown){
        if (time > currentTime){
            nextArrival = time;
            time=convertMinutes(time);
            nextArrival=convertMinutes(nextArrival);
            arrivalKnown=true;
            console.log("nextArr: "+nextArrival);
        }
        else if (time === currentTime){
            nextArrival = convertMinutes(currentTime);
            console.log("nextArr: "+nextArrival);
            arrivalKnown=true;
        }
        else {
            time = parseInt(time) + parseInt(frequency);
            console.log("nextArr is time: "+time);
        };
    };

    var minAway = parseInt(nextArrival) - parseInt(currentTime);
    console.log("minAway: "+minAway);

    //store info for each train in database object:
    database.ref("train-"+trainId).set({
        trainId:trainId,
        name:trainName,
        destination:dest,
        firstTime:firstTime,
        frequency:frequency,
        nextArrivalTime:nextArrival,
        minutesAway:minAway,
    });

    // if (snapshot.child("name").exists() && snapshot.child("otherName").exists()){
    //     set them;
    // }

    //create new tr and insert td from object into html
    var newTableRow = $("<tr>");
    var newDataName = $("<td>"+trainName+"<td>");
    var newDataFrequency = $("<td>"+frequency+"<td>");
    var newDataNextArrival=$("<td>"+nextArrival+"<td>");
    var newDataMinutesAway=$("<td>"+minAway+"<td>");

    // $("form").append(newTableRow);
    // $(newTableRow).append(newDataName, newDataFrequency, newDataNextArrival, newDataMinutesAway);


    // newTableRow.attr("trainId", ??);
    $("#newDataName").text(trainName);
    $("#newDataFrequency").text(frequency);
    $("#newDataNextArrival").text(nextArrival);
    $("#newDataMinutesAway").text(minAway);
});

//converts minutes into HH:MM
function convertMinutes(event){
    console.log("event should be temp time:" +event);//correct
    //event = time in minutes
    var m = event%60;
    var h = Math.floor(event/60);
    var convertedTime = h + ":" + m;
    console.log("Should be temp time in HH:MM " +convertedTime);//correct
    return convertedTime;
}
});

//continually update 
//users from different machines able to view