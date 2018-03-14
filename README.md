# Train-Scheduler

The train scheduler takes in user information, stores it in a Firebase database, and uploads it to the train board. Next arrival times and minutes away are calculated in the app, posted to the train board, and refreshed every minute. 

## Instructions

1. Enter train information into form and click submit button. All information is necessary.
2. The information gets added to the train board and the Firebase database.
3. The train board shows each train's name, destination, and frequency. The app calculates the next arrival time and minutes away and updates these every minute.
3. Delete any trains no longer needed. Deleted trains are removed from the train board and the database.

## Built With

* [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) - Makes it interactive
* [JQuery](http://jquery.com/) - Handles events
* [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) - Makes it pretty
* [Moment.js](https://momentjs.com/) - Handles the time
* [Firebase](https://firebase.google.com/) - Holds information in its database

## Author

* **Kris Acker Bierma** - [KrisBierma](https://github.com/KrisBierma)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details