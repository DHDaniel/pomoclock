
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
var pomodoroLength = 10;//25 * 60; // default pomodoro length in seconds
var breakLength = 5;//5 * 60; // default break length in seconds
var pomodoro = true;

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

// This function gets called each time the timer finishes, and it is passed the timer itself as an argument.
function restartTimer(timer) {

  // handling new start of clock
    timer.stop();
    if (pomodoro) {
      timer.originalTime = breakLength;
      timer.reset();
      $playButton.click();
      pomodoro = false;
    } else {
      timer.originalTime = pomodoroLength;
      timer.reset();
      $playButton.click();
      pomodoro = true;
    }
    timer.updateClock();


}

// all timers are declared global in order to be able to delete them later
var pomoClock = new Timer(pomodoroLength, $clockTime, restartTimer);
pomoClock.updateClock();

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
  pomodoroLength = ($("#pomodoro-length .number").html() * 60);
  breakLength = ($("#break-length .number").html() * 60);

  // resetting values for the clock
  pomodoro = false;
  restartTimer(pomoClock);
  $playButton.click();

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

    // starting break if task was completed
    pomdoro = true;
    restartTimer(pomoClock);

    // resetting current task box
    $currentTask.val("");

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

  if (e.target !== $(this)) {
    return;
  }

  var task = $(this).children("p").html();
  $currentTask.val(task);
  $("#finish-task").addClass("visible");

  pomodoro = false;
  restartTimer(pomoClock);

  // removing from list
  $(this).remove();
});

// removing tasks

$("#to-do").on("click", ".task .options .remove-task", function (e) {
  e.preventDefault();
  $(this).parents(".task").remove();
});
