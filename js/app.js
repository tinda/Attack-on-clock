'use strict';

utils.navigation.init('[data-position="current"]', 100);

window.addEventListener('hashchange', function (ev) {
  updateDate();
  if (location.hash !== 'panel1') {
    document.getElementById('panel1').removeAttribute('aria-selected');
  }
});

function updateDate() {
  document.getElementById('date-text').textContent = (new Date()).toDateString();
}

updateDate();

document.getElementById('alarm-new').addEventListener('click', function (ev) {
  document.getElementById('name').value = '';
  // Set up the time entryfield to current time + 2 minutes
  var date = new Date((new Date()).getTime() + 2 * 60000);
  var hours = date.getHours();
  var minutes = date.getMinutes();
  document.getElementById('time').value = (hours < 10 ? '0' + hours : hours) + ':' +
                                          (minutes < 10 ? '0' + minutes : minutes);
  utils.navigation.go('#alarm-new-details');
});

document.getElementById('tone').addEventListener('change', function (ev) {
  document.getElementById('tone-button').textContent =
    ev.target.options[ev.target.selectedIndex].text;
});

document.getElementById('vibration').addEventListener('change', function (ev) {
  document.getElementById('vibration-button').textContent =
    ev.target.options[ev.target.selectedIndex].text;
});

document.getElementById('alarm-new-details-back').addEventListener('click', function (ev) {
  ev.preventDefault();
  utils.navigation.back();
});

document.getElementById('alarm-new-details-done').addEventListener('click', function (ev) {
  ev.preventDefault();

  var time = document.getElementById('time').value;
  if (!time || time.trim().length === 0) {
    utils.navigation.back();
    return;
  }

  document.getElementById('show-alarms').removeAttribute('disabled');

  var selectEl = document.getElementById('tone');
  AlarmsHelper.addAlarm(time, utils.navigation.back, {
    name: document.getElementById('name').value,
    vibrate: document.getElementById('vibration').value === 'false' ? false : true,
    tone: selectEl.options[selectEl.selectedIndex].value
  });

  utils.status.show(utils.alarms.getAlarmMessage(time));
});

function updateAlarmList() {
  var alarmsRequest = navigator.alarms.getAll();
  alarmsRequest.onsuccess = function (ev) {
    AlarmsList.reset();
    if (this.result.length) {
      document.getElementById('show-alarms').removeAttribute('disabled');
      var i, alarms = this.result;
      alarms = AlarmsList.sort(alarms);
      for (i = 0; i < alarms.length; i++) {
        AlarmsList.add(alarms[i]);
      }
    } else {
      document.getElementById('show-alarms').setAttribute('disabled', true);
      AlarmsList.add();
    }
  };
  alarmsRequest.onerror = function (error) {
    console.log("ERROR");
  };
}

updateAlarmList();

document.getElementById('show-alarms').addEventListener('click', function (ev) {
  updateAlarmList();
  utils.navigation.go('#alarm-list');
});

document.getElementById('alarm-list-back').addEventListener('click', function (ev) {
  utils.navigation.back();
});

document.getElementById('alarm-list-remove').addEventListener('click', function (ev) {
  ev.preventDefault();

  var checkboxes = document.querySelectorAll('#alarm-list ul input[type="checkbox"]:checked');

  for(var i = 0; i < checkboxes.length; i++) {
    navigator.alarms.remove(checkboxes[i].dataset.id);
  }

  utils.status.show('Alarms removed successfully.', 3000);

  updateAlarmList();
  utils.navigation.back();
});

document.getElementById('ring-snooze').addEventListener('click', function (ev) {
  ev.preventDefault();
  AlarmsHelper.stopRinging();
  var now = new Date(Date.now());
  var newTime = new Date(now.getTime() + 5*60000);
  var minutes = newTime.getMinutes();
  AlarmsHelper.addAlarm(newTime.getHours() + ':' +
                        (minutes < 10 ? '0' + minutes : minutes),
                        utils.navigation.back, AlarmsHelper.currentAlarm.data);
  utils.status.show('The alarm has been snoozed for 5 minutes.', 3000);
  updateAlarmList();
});

var stopWatchStart = document.getElementById('stopwatch-start');
var stopWatchReset = document.getElementById('stopwatch-reset');
var stopWatchMin = document.getElementById('stopwatch-min');
var stopWatchSec = document.getElementById('stopwatch-sec');
var stopWatchInterval, stopWatchStatus = 'stopped';
stopWatchStart.addEventListener('click', function (ev) {
  var min, sec;
  if (stopWatchStatus === 'running') {
    clearInterval(stopWatchInterval);
    stopWatchStatus = 'paused';
    stopWatchStart.textContent = 'Resume';
    stopWatchStart.classList.remove('recommend');
  } else {
    stopWatchStatus = 'running';
    stopWatchStart.textContent = 'Pause';
    stopWatchStart.classList.add('recommend');
    stopWatchReset.removeAttribute('disabled');
    stopWatchInterval = setInterval(function () {
      min = parseInt(stopWatchMin.textContent, 10);
      sec = parseInt(stopWatchSec.textContent, 10);
      if (sec === 59) {
        stopWatchMin.textContent = ((min < 10) ? '0' : '') + (min + 1);
        stopWatchSec.textContent = '00';
      } else {
        stopWatchSec.textContent = ((sec < 10) ? '0' : '') + (sec + 1);
      }
    }, 1000);
  }
});
stopWatchReset.addEventListener('click', function (ev) {
  stopWatchStatus = 'stopped';
  clearInterval(stopWatchInterval);
  stopWatchStart.textContent = 'Start';
  stopWatchStart.classList.remove('recommend');
  stopWatchReset.setAttribute('disabled', true);
  stopWatchMin.textContent = '00';
  stopWatchSec.textContent = '00';
});
