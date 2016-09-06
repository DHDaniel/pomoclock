
// mini JQuery toggle plugin @ http://stackoverflow.com/questions/4911577/jquery-click-toggle-between-two-functions/21520499#21520499
;jQuery.fn.clickToggle = function(a, b) {
    function cb() {
        [b, a][this._tog ^= 1].call(this); // magic
    }
    return this.on("click", cb);
};



// Getting and compiling templates
var toDoTaskRaw = $("#to-do-task-template").html();
var completedTaskRaw = $("#completed-task-template").html();

var toDoTask = Handlebars.compile(toDoTaskRaw);
var completedTask = Handlebars.compile(completedTaskRaw);


// useful IDs
var clockTime = $("#clock-info .time");


// useful variables
var pomodoroLength = 10;//25 * 60; // default pomodoro length in seconds
var breakLength = 5;//5 * 60; // default break length in seconds

// Timer and pomodoro related things

// Callback for each time a pomodoro timer ends
function startBreak() {
  delete pomoClock;
  $("#play").off();
  breakClock = new Timer(breakLength, clockTime, startPomodoro);
  breakClock.updateClock();
  breakClock.start();
  // re-binding button to new timer object
  $("#play").click(function () {
    if (breakClock.play) {
      breakClock.stop();
    } else {
      breakClock.start();
    }
  });
}

// Callback for each time a break timer ends
function startPomodoro() {
  delete breakClock;
  $("#play").off();
  pomoClock = new Timer(pomodoroLength, clockTime, startBreak);
  pomoClock.updateClock();
  pomoClock.start();
  // re-binding button to new timer object
  // re-binding button to new timer object
  $("#play").click(function () {
    if (pomoClock.play) {
      pomoClock.stop();
    } else {
      pomoClock.start();
    }
  });
}

pomoClock = new Timer(pomodoroLength, clockTime, startBreak);
pomoClock.updateClock();

$("#play").click(function () {
  if (pomoClock.play) {
    pomoClock.stop();
  } else {
    pomoClock.start();
  }
});
