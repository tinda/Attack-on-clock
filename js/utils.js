'use strict';

var utils = this.utils || {};

utils.alarms = (function() {

  var getAlarmMessage = function al_getAlarmMessage(time) {
    var timeArr = time.split(':', 2);
    var timeHours = parseInt(timeArr[0]);
    var timeMinutes = parseInt(timeArr[1]);
    var now = new Date(Date.now());
    var inHours;
    if (timeHours >= now.getHours()) {
      inHours = timeHours - now.getHours();
    }
    var inMinutes;
    if (timeMinutes >= now.getMinutes()) {
      if (inHours >= 0) {
        inMinutes = timeMinutes - now.getMinutes();
      }
    } else {
      if (inHours > 0) {
        inHours -= 1;
        inMinutes = (60 - now.getMinutes()) + timeMinutes;
      }
    }
    var statusStr = 'New alarm set';
    if (inHours) {
      statusStr += ' in ' + inHours + ' hours';
      if (inMinutes) {
        statusStr += ' and ' + inMinutes + ' minutes';
      }
    } else if (inMinutes) {
      statusStr += ' in ' + inMinutes + ' minutes';
    }
    statusStr += '!';
    return statusStr;
  }

  return {
    getAlarmMessage: getAlarmMessage
  }
})();
