'use strict';

var AlarmsHelper = (function() {

 	var ringText = document.getElementById('ring-text');
  	var ringTime = document.getElementById('ring-time');
  	var audio = new Audio();
  	var vibrationInterval;

  	var rightcounter = 0;

	var currentAlarm;
	var whichquestion = 0;
	var myquestions = new Array();
    myquestions[0]="Jason _?_ English on Mondays and Thursdays.;studies,study,is studying;0";
    myquestions[1]="Mr.Wang looks _?_ today.;happy,happily,like;0";
    myquestions[2]="Jassica enjoys _?_ shopping. She always buys a lot of bags.;go,to go,going;2";
    myquestions[3]="Mary: Is that a book? Jack: Yes, ? is.;that,this,it,its;2";
    myquestions[4]="Mary: Is that a book? Jack: Yes, ? is.;that,this,it,its;2";
    myquestions[5]="Mary: Is that a book? Jack: Yes, ? is.;that,this,it,its;2";
    myquestions[6]="Mary: Is that a book? Jack: Yes, ? is.;that,this,it,its;2";
    myquestions[7]="Mary: Is that a book? Jack: Yes, ? is.;that,this,it,its;2";
    myquestions[8]="Mary: Is that a book? Jack: Yes, ? is.;that,this,it,its;2";
    myquestions[9]="Mary: Is that a book? Jack: Yes, ? is.;that,this,it,its;2";
    myquestions[10]="Mary: Is that a book? Jack: Yes, ? is.;that,this,it,its;2";
    myquestions[11]="Mary: Is that a book? Jack: Yes, ? is.;that,this,it,its;2";
    myquestions[12]="Mary: Is that a book? Jack: Yes, ? is.;that,this,it,its;2";
    myquestions[13]="Mary: Is that a book? Jack: Yes, ? is.;that,this,it,its;2";
    myquestions[14]="Mary: Is that a book? Jack: Yes, ? is.;that,this,it,its;2";
    myquestions[15]="Mary: Is that a book? Jack: Yes, ? is.;that,this,it,its;2";
    myquestions[16]="Mary: Is that a book? Jack: Yes, ? is.;that,this,it,its;2";
    myquestions[17]="Mary: Is that a book? Jack: Yes, ? is.;that,this,it,its;2";
    myquestions[18]="Mary: Is that a book? Jack: Yes, ? is.;that,this,it,its;2";
    myquestions[19]="Mary: Is that a book? Jack: Yes, ? is.;that,this,it,its;2";
    myquestions[20]="Mary: Is that a book? Jack: Yes, ? is.;that,this,it,its;2";
    myquestions[21]="Mary: Is that a book? Jack: Yes, ? is.;that,this,it,its;2";
    myquestions[22]="Mary: Is that a book? Jack: Yes, ? is.;that,this,it,its;2";
    myquestions[23]="Mary: Is that a book? Jack: Yes, ? is.;that,this,it,its;2";
    myquestions[24]="Mary: Is that a book? Jack: Yes, ? is.;that,this,it,its;2";
    myquestions[25]="Mary: Is that a book? Jack: Yes, ? is.;that,this,it,its;2";
    myquestions[26]="Mary: Is that a book? Jack: Yes, ? is.;that,this,it,its;2";
    myquestions[27]="Mary: Is that a book? Jack: Yes, ? is.;that,this,it,its;2";
    myquestions[28]="Mary: Is that a book? Jack: Yes, ? is.;that,this,it,its;2";
    myquestions[29]="Mary: Is that a book? Jack: Yes, ? is.;that,this,it,its;2";

  function ring(alarm) {
    stopRinging();
    currentAlarm = alarm;
    updateAlarmList();
    if (alarm.data && alarm.data.vibrate) {
      vibrationInterval = setInterval(function() {
        navigator.vibrate([250, 250]);
      }, 500);
    }
    if (alarm.data && alarm.data.tone && alarm.data.tone !== 'None') {
      audio.src = 'media/' + alarm.data.tone;
      audio.loop = true;
      audio.play();
    }
    settingquestion();
    var hours, minutes;
    hours = alarm.date.getHours();
    minutes = alarm.date.getMinutes();
    ringTime.textContent = (hours < 10 ? '0' + hours : hours) + ':' +
      (minutes < 10 ? '0' + minutes : minutes);
		ringText.textContent = alarm.data ? alarm.data.name : '';


    utils.navigation.go('#ring');
  }
	function settingquestion(){
		whichquestion = Math.round(Math.random() * 2);
		var getquestion = myquestions[whichquestion];
		var questionsection = getquestion.split(";");
		var qoption = questionsection[1].split(",");

		document.getElementById('question-title').innerHTML = questionsection[0];
		document.getElementById('op1').innerHTML = qoption[0];
		document.getElementById('op2').innerHTML = qoption[1];
	    document.getElementById('op3').innerHTML = qoption[2];
    }

    document.getElementById('ring-question-submit').addEventListener('click', function (ev) {
  		ev.preventDefault();
  		button_go();
	});

    function button_go(){
  	var form_name = document.getElementById('ring');
  	for (var i=0; i<form_name.question.length; i++)
    {
      if (form_name.question[i].checked)
      {
        var getquestion = myquestions[whichquestion];
        var questionsection = getquestion.split(";");
		var getoption = questionsection[2];
        if(getoption==i){
			alert("good !");
			rightcounter = rightcounter+1;
			if(rightcounter>=3){
				document.getElementById('ring-close').removeAttribute('disabled');
			}
			break;
        }else{
        	alert("wrong !");
        	break;
        }
      }
    }
    settingquestion();
  	// utils.navigation.go('#question-section');
    }

    document.getElementById('ring-close').addEventListener('click', function (ev) {
		ev.preventDefault();
		rightcounter = 0;
		AlarmsHelper.stopRinging();
		utils.navigation.back();
	});

	if (navigator.mozAlarms) {
	  navigator.mozHasPendingMessage('alarm');
	  navigator.mozSetMessageHandler('alarm', function (mozAlarm) {
		  var req = navigator.mozApps.getSelf();
			req.onsuccess = function() {
				req.result.launch();
				setTimeout(ring.bind(this, mozAlarm));
			};
		});
	} else {
		// How can I know whether my app is launched from Alarm or not?
		var reqAppControl = tizen.application.getCurrentApplication().
																											 getRequestedAppControl();
		if (reqAppControl) {
			var appCtrl = reqAppControl.appControl;
			if (appCtrl.operation === 'http://tizen.org/appcontrol/operation/alarm') {
				appCtrl.data.forEach(function iter(item) {
					if (item.key === 'http://tizen.org/appcontrol/data/alarm_id') {
						var id = item.value[0];
						var req = WebAlarmAPI.get(id);

						req.onsuccess = function() {
							ring(this.result);
							navigator.alarms.remove(id);
						};
					}
				});
			}
		}
	}

	var parseTime = function(time) {
	  var parsed = time.split(':');
	  var hour = +parsed[0]; // cast hour to int, but not minute yet
	  var minute = parsed[1];

	  // account for 'AM' or 'PM' vs 24 hour clock
	  var periodIndex = minute.indexOf('M') - 1;
	  if (periodIndex >= 0) {
		  hour = (hour == 12) ? 0 : hour;
		  hour += (minute.slice(periodIndex) == 'PM') ? 12 : 0;
		  minute = minute.slice(0, periodIndex);
	  }

	  return {
		  hour: hour,
		  minute: +minute // now cast minute to int
	  };
	};

  function addAlarm(time, callback, data) {
		time = parseTime(time);
		var date = new Date();
		date.setHours(time.hour, time.minute, 0, 0);
		var request = navigator.alarms.add(date, 'ignoreTimezone', data);

		request.onsuccess = function () {
			console.log("The alarm has been scheduled");
			callback();
		};

		request.onerror = function () {
			console.error("An error occurred: " + this.error.name);
			callback();
		};
	}

  function stopRinging() {
    clearInterval(vibrationInterval);
    if (!audio.paused) {
      audio.pause();
      audio.currentTime = 0;
    }
  }

  return {
    addAlarm: addAlarm,
    stopRinging: stopRinging,

		get currentAlarm() {
			return currentAlarm;
		}
  };
}());
