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
var trainId; //unique number for each train
var trainNum; //current number of total trains

//reset HTML form to empty
$("#form")[0].reset();

//increases current train number by 1 when page is loaded
updateTrainNum();

//function to increase trainNum in db and make trainId=trainNum
function updateTrainNum(){
    var t;
    var deferred=$.Deferred();
    database.ref().once("value", function(trainIdSnap){
        console.log(trainIdSnap.val().trainNum);
        var t=trainIdSnap.val().trainNum;
        t++;
        console.log(t);
        database.ref().update({
            trainNum:t
        });
        trainId=t;
        console.log(trainId);
        console.log(trainId);
        // rendTableNow=true;
        // renderTable();
        // return trainId;
    });
    deferred.resolve("");
    return deferred.promise();

};


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
            arrivalKnown=true;
            console.log("nextArr: "+nextArrival);
        }
        else if (time === currentTime){
            nextArrival = time;
            console.log("nextArr: "+nextArrival);
            arrivalKnown=true;
        }
        else {
            time = parseInt(time) + parseInt(frequency);
            console.log("nextArr is time: "+time);
        };
        var minAway = parseInt(nextArrival) - parseInt(currentTime);
        console.log("minAway: "+minAway);
    };

    // if (snapshot.child("name").exists() && snapshot.child("otherName").exists()){
    //     set them;
    // }

    //create new tr and insert data into html
    var newTableRow = $("<tr id="+trainId+">");
    var newDataName = $("<td id='newDataName"+trainId+"'>");
    var newDataDest = $("<td id='newDataDest"+trainId+"'>");
    var newDataFrequency = $("<td id='newDataFrequency"+trainId+"'>");
    var newDataNextArrival=$("<td id='newDataNextArrival"+trainId+"'>");
    var newDataMinutesAway=$("<td id='newDataMinutesAway"+trainId+"'>");

    $("tbody").append(newTableRow);
    $(newTableRow).append(newDataName, newDataDest, newDataFrequency, newDataNextArrival, newDataMinutesAway);

    //store info for each train in database object:
    database.ref("trains/train-"+trainId).set({
        trainId:trainId,
        name:capUpper(trainName),
        destination:capUpper(dest),
        firstTime:firstTime,
        frequency:frequency,
        nextArrivalTime:nextArrival,
        minutesAway:minAway,
    });

    // populate html with db info
    var r = "train-"+trainId;
    database.ref("trains/"+r).once("value", function(snap){
        console.log(snap.val());
        console.log(snap.val().name);
        $("#newDataName"+trainId).text(snap.val().name);
        $("#newDataDest"+trainId).text(snap.val().destination);
        $("#newDataFrequency"+trainId).text(snap.val().frequency);
        $("#newDataNextArrival"+trainId).text(convertMinutes(snap.val().nextArrivalTime));
        $("#newDataMinutesAway"+trainId).text(snap.val().minutesAway);
    });

    //increase trainNum in db by 1
    updateTrainNum();
    $("#form")[0].reset();
});

//renders the table with everything in db only when page loads
$.when(updateTrainNum()).then(
function renderTable(){
    //how to reference parents/root???
    var query=database.ref("trains").orderByChild("trainId");
    console.log(query);
    query.once("value").then(function(snap){
            console.log(snap);
            snap.forEach(function(trainSnap){
                var key=trainSnap.key;
                var ts=trainSnap.val();
                var trainId=ts.trainId;

                var newTableRow = $("<tr id="+trainId+">");
                console.log("new tr");
                var newDataName = $("<td id='newDataName"+trainId+"'>");
                var newDataDest = $("<td id='newDataDest"+trainId+"'>");
                var newDataFrequency = $("<td id='newDataFrequency"+trainId+"'>");
                var newDataNextArrival=$("<td id='newDataNextArrival"+trainId+"'>");
                var newDataMinutesAway=$("<td id='newDataMinutesAway"+trainId+"'>");

                $("tbody").append(newTableRow);
                $(newTableRow).append(newDataName, newDataDest, newDataFrequency, newDataNextArrival, newDataMinutesAway);

                var name=ts.name;
                $("#newDataName"+trainId).text(name);
                $("#newDataDest"+trainId).text(ts.destination);
                $("#newDataFrequency"+trainId).text(ts.frequency);
                $("#newDataNextArrival"+trainId).text(convertMinutes(ts.nextArrivalTime));
                $("#newDataMinutesAway"+trainId).text(ts.minutesAway);
            })
        })
    })

//converts minutes into HH:MM
function convertMinutes(event){
    console.log("event should be temp time:" +event);//correct
    //event = time in minutes
    var m = event%60;
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
//restart trainId on db to 0