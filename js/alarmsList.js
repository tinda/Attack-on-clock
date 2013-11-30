'use strict';

var AlarmsList = (function() {

  var list = document.querySelector('#alarm-list ul');
  var removeButton = document.getElementById('alarm-list-remove');

  var count = 0;

  list.addEventListener('touchmove', function click(evt) {
    evt.preventDefault();
  });

  list.addEventListener('click', function click(evt) {
    evt.preventDefault();

    var checkbox = evt.target.querySelector('input[type="checkbox"]');

    if (!checkbox) {
      return;
    }

    var checked = checkbox.checked = !checkbox.checked;
    checked ? ++count : --count;

    if (count === 0) {
      removeButton.setAttribute('disabled', true);
    } else {
      removeButton.removeAttribute('disabled');
    }
  });

  function add(alarm) {
    var alarmLI = document.createElement('li');
    var alarmP = document.createElement('p');
    var alarmLabel = document.createElement('label');
    alarmLabel.classList.add('pack-checkbox');
    var alarmInput = document.createElement('input');
    alarmInput.setAttribute('type', 'checkbox');
    alarmInput.checked = false;
    var alarmSpan = document.createElement('span');
    alarmLabel.appendChild(alarmInput);
    alarmLabel.appendChild(alarmSpan);
    alarmP.appendChild(alarmLabel);
    var alarmStr;
    if (alarm) {
      alarmInput.dataset.id = alarm.id;
      var alarmDate = alarm.date;
      alarmStr =
        alarmDate.getDate() + '/' + (alarmDate.getMonth() + 1) + '/' +
        alarmDate.getFullYear() + ' ' +
        (alarmDate.getHours() < 10 ? '0' + alarmDate.getHours() :
          alarmDate.getHours()) + ':' +
        (alarmDate.getMinutes() < 10 ? '0' + alarmDate.getMinutes() :
         alarmDate.getMinutes());

      if (alarm.data) {
        if (alarm.data.name) {
          alarmStr += ' (' + alarm.data.name + ')';
        }
        if (alarm.data.tone && alarm.data.tone !== 'None') {
          alarmStr = '\u266A' + alarmStr;
        }
      }
    } else {
      alarmLabel.classList.add('hidden');
      alarmStr = 'NO ALARMS';
    }
    var alarmText = document.createTextNode(alarmStr);
    alarmP.appendChild(alarmText);
    alarmLI.appendChild(alarmP);
    list.appendChild(alarmLI);
  }

  function reset() {
    removeButton.setAttribute('disabled', true);
    count = 0;
    list.innerHTML = '';
  }

  function sort(alarms) {
    return alarms.sort(function compare(first, second) {
      if (first.date > second.date) {
        return 1;
      } else if (first.date > second.date) {
        return -1;
      } else {
        0
      }
    });
  }

  return {
    reset: reset,
    add: add,
    sort: sort
  };
}());
