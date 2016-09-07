
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


// caching essential DOM elements to avoid repeated searches
var $clockTime = $("#clock-info .time");
var $playButton = $("#play");
var $settingsButton = $("#settings-button");
var $saveAndClose = $("#save-and-close");


// useful variables
var pomodoroLength = 25 * 60; // default pomodoro length in seconds
var breakLength = 5 * 60; // default break length in seconds
currentTimer = null;


/*==================================
 Timer and pomodoro related things
==================================*/

// play/pause functionality
function playButtonHandler(timer) {
  if (timer.play) {
    timer.stop();
    $playButton.find("i").removeClass("fa-pause").addClass("fa-play");
  } else {
    timer.start();
    $playButton.find("i").removeClass("fa-play").addClass("fa-pause");
  }
}

// Callback for each time a pomodoro timer ends
function startBreak() {
  delete currentTimer;
  $playButton.off(); // ensuring previous handler is gone
  breakClock = new Timer(breakLength, $clockTime, startPomodoro);
  breakClock.updateClock();
  breakClock.start();
  currentTimer = breakClock;
  // re-binding button to new timer object
  $playButton.click(function () {
    playButtonHandler(breakClock);
  });
}

// Callback for each time a break timer ends
function startPomodoro() {
  delete currentTimer;
  $playButton.off(); // ensuring previous handler is gone
  pomoClock = new Timer(pomodoroLength, $clockTime, startBreak);
  pomoClock.updateClock();
  pomoClock.start();
  currentTimer = pomoClock;
  // re-binding button to new timer object
  // re-binding button to new timer object
  $playButton.click(function () {
    playButtonHandler(pomoClock);
  });
}

// all timers are declared global in order to be able to delete them later
pomoClock = new Timer(pomodoroLength, $clockTime, startBreak);
pomoClock.updateClock();
currentTimer = pomoClock;

$playButton.click(function () {
  playButtonHandler(pomoClock);
});



/*==================================
--- SETTINGS
====================================*/

$settingsButton.clickToggle(function () {
  $(".overlay").addClass("open");
  $settingsButton.find("i").removeClass("fa-cog").addClass("fa-times");
  $settingsButton.addClass("open");
}, function () {
  $(".overlay").removeClass("open");
  $settingsButton.find("i").removeClass("fa-times").addClass("fa-cog");
  $settingsButton.removeClass("open");
});

$(".increase").click(function () {
  var curNum = $(this).parents(".inc-dec-container").find(".number").html();
  curNum = parseInt(curNum) + 1;
  $(this).parents(".inc-dec-container").find(".number").html(curNum);
});

$(".decrease").click(function () {
  var curNum = $(this).parents(".inc-dec-container").find(".number").html();
  curNum = parseInt(curNum) - 1;
  if (curNum <= 0) {
    curNum = 1;
  }
  $(this).parents(".inc-dec-container").find(".number").html(curNum);
});

// saving desired settings
$saveAndClose.click(function () {
  var pomodoroLength = ($("#pomodoro-length .number").html() * 60);
  var breakLength = ($("#break-length .number").html() * 60);

  delete currentTimer;

  pomoClock = new Timer(pomodoroLength, $clockTime, startBreak);
  currentTimer = pomoClock; // changing current timer
  pomoClock.reset();
  pomoClock.updateClock();

  $settingsButton.click(); // closing overlay and menu
});
