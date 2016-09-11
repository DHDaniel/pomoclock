// Takes care of timing
// @param seconds | length of time the timer will countdown to
// @param $clock | jQuery object which represents clock to put time into
// @param callback | a function, which is called when the timer reaches 0. Parameter is optional
function Timer(seconds, secCallback, finalCallback) {

	// self-contained variables (not accessible)
	var self = this;
  this.play = false;
  var intervalIDSelf = null;

  function update(self) {
      self.timeLeft -= 1;
  }

  // keep track of time
  this.originalTime = seconds,
  this.timeLeft = seconds,

  // returns remaining time in hours, minutes and seconds
  this.getRemaining = function () {
    var totalTime = this.timeLeft;
    var time = {
      seconds : Math.floor((totalTime) % 60),
      minutes : Math.floor((totalTime / 60) % 60),
      hours : Math.floor((totalTime / 60 / 60) % 24),
    }

    return time;
  },

  // starts the timer
  this.start = function () {
  // setting flag to true
  	self.play = true;
  	update(self); // to avoid first-second delay
		secCallback(self);
  	var intervalID = setInterval(function () {
      if (self.timeLeft <= 0) {
      	clearInterval(intervalID);
        // if timer has ended and a callback function was passed
        if (self.timeLeft <= 0 && typeof finalCallback !== 'undefined') {
          finalCallback(self); // the timer is passed as an argument to the callback function - optional
        }
        return;
      }
    	update(self);
			secCallback(self) // callback called every second
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
    this.timeLeft = this.originalTime;
  }
}
