// Takes care of timing
// @param seconds | length of time the timer will countdown to
// @param $clock | jQuery object which represents clock to put time into
// @param callback | a function, which is called when the timer reaches 0. Parameter is optional
function Timer(seconds, $clock, callback) {

	// self-contained variables (not accessible)
	var self = this;
  this.play = false;
  var intervalIDSelf = null;

  function update(self) {
      self.length -= 1;
  }

  // formats the string to be returned according to amount of time
  function format(t) {
    if (parseInt(t.hours) !== 0) {
      return ("0" + t.hours).slice(-2) + ":" + ("0" + t.minutes).slice(-2) + ":" + ("0" + t.seconds).slice(-2);
    } else { // only down to minutes
      return ("0" + t.minutes).slice(-2) + ":" + ("0" + t.seconds).slice(-2);
    }
  }

  // keep track of time
  this.originalTime = seconds,
  this.length = seconds,

  // returns remaining time in hours, minutes and seconds
  this.getRemaining = function () {
    var totalTime = this.length;
    var time = {
      seconds : Math.floor((totalTime) % 60),
      minutes : Math.floor((totalTime / 60) % 60),
      hours : Math.floor((totalTime / 60 / 60) % 24),
    }

    return time;
  },

  // updates HTML clock with formatted time HH:MM:SS
  this.updateClock = function () {
    var t = this.getRemaining();
    // format the time
    var clockString = format(t);
    $clock.html(clockString);
  },

  // starts the timer
  this.start = function () {
  // setting flag to true
  	self.play = true;
  	update(self); // to avoid first-second delay
    self.updateClock();
  	var intervalID = setInterval(function () {
      if (self.length <= 0) {
      	clearInterval(intervalID);
        // if timer has ended and a callback function was passed
        if (self.length <= 0 && typeof callback !== 'undefined') {
          callback();
        }
        return;
      }
    	update(self);
      self.updateClock();
    }, 1000);
    intervalIDSelf = intervalID;
  },

  // stops the timer
  this.stop = function () {
  	self.play = false;
    clearInterval(intervalIDSelf); // handling it here avoids bugs when two clicks are done in under 1 second
  },

  // resets the timer
  this.reset = function () {
  	this.stop();
    this.length = this.originalTime;
  }
}
