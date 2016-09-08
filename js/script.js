
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
var $currentTask = $("#current-task");

// useful variables
var pomodoroLength = 25 * 60; // default pomodoro length in seconds
var breakLength = 5 * 60; // default break length in seconds
var currentTimer = null;

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

// TO-DO --- FIX ANNOYING BUG BY SIMPLY MAKING THE TIMER SELF SUFFICIENT, SO WE ONLY HAVE ONE timer

// Callback for each time a pomodoro timer ends
function startBreak() {
  delete currentTimer[0];
  $playButton.off(); // ensuring previous handler is gone
  breakClock = new Timer(breakLength, $clockTime, startPomodoro);
  breakClock.updateClock();
  breakClock.start();
  currentTimer[0] = breakClock;
  // re-binding button to new timer object
  $playButton.click(function () {
    playButtonHandler(breakClock);
  });
}

// Callback for each time a break timer ends
function startPomodoro() {
  delete currentTimer[0];
  $playButton.off(); // ensuring previous handler is gone
  pomoClock = new Timer(pomodoroLength, $clockTime, startBreak);
  pomoClock.updateClock();
  pomoClock.start();
  currentTimer[0] = pomoClock;
  // re-binding button to new timer object
  // re-binding button to new timer object
  $playButton.click(function () {
    playButtonHandler(pomoClock);
  });
}

// all timers are declared global in order to be able to delete them later
var pomoClock = new Timer(pomodoroLength, $clockTime, startBreak);
pomoClock.updateClock();
currentTimer[0] = pomoClock;

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

  delete currentTimer[0];

  pomoClock = new Timer(pomodoroLength, $clockTime, startBreak);
  currentTimer[0] = pomoClock; // changing current timer
  pomoClock.reset();
  pomoClock.updateClock();

  $settingsButton.click(); // closing overlay and menu
});


/*=====================================
TASK RELATED THINGS
=======================================*/

function Task(description) {
  this.description = description;
}

// handling new tasks written in input
$currentTask.on("keydown", function (e) {
  var key = e.which;
  // if enter was pressed
  if (key == 13) {
    startPomodoro();
    // resetting
    $(this).val("");
  }

  $("#finish-task").addClass("visible");

  // if backspace
  if (key == 8) {
    $("#finish-task").removeClass("visible");
  }
});

// handling when tasks are finished
$("#finish-task").click(function () {
  var task = $currentTask.val();

  if (Boolean(task)) {
    task = new Task(task);
    var html = completedTask(task);
    startBreak();

    // adding task to completed list
    $(".box#completed .task-container").append(html);
  }

});

// adding to to-do list
$("#to-do #add-task").keypress(function (e) {
  var key = e.which;
  // if enter or return
  if (key == 13) {
    var task = new Task($(this).val());
    var html = toDoTask(task);
    $(".box#to-do .task-container").append(html);

    // resetting
    $(this).val("");
  }
});

$("#to-do").on("click", ".task", function (e) {
  // checking here because I don't want to change the HTML code
  if ($(this).attr("id") == "add") {
    return;
  }

  console.log(e.target);
  console.log($(this));
  if (e.target !== $(this)) {
    return;
  }

  var task = $(this).children("p").html();
  $currentTask.val(task);
  $("#finish-task").addClass("visible");

  // restarting timer
  currentTimer.stop();
  currentTimer.reset();
  $playButton.click();

  // removing from list
  $(this).remove();
});

// removing tasks

$("#to-do").on("click", ".task .options .remove-task", function (e) {
  e.preventDefault();
  $(this).parents(".task").remove();
});
