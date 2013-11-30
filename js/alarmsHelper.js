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
    myquestions[4]="Jeremy fall in _?_ with Jourdon;hate,eat,love;2";
    myquestions[5]="You can learn more by _?_ questions.;to ask,asking,ask;1";
    myquestions[6]="Peter's sister wrote a letter to her boyfriend. It means she wrote a letter to _?_.;him,her,she;0";
    myquestions[7]="After class, all the students took _?_ own things and left the classroom.;their,they,them;0";
    myquestions[8]="_?_ is an American.;They,You,He;2";
    myquestions[9]="Smith and Susan decide _?_ a trip this summer.;take,to take,taking;1";
    myquestions[10]="Please _?_  your book to page 101. We'll learn Lesson 11 today.;open,opened,are opening;0";
    myquestions[11]="Life is like a box of _?_.;ckae,chocolate,shit;1";
    myquestions[12]="Arnold said : I’ll be _?_.;back,you,there;0";
    myquestions[13]="夸父追_?_.;日,月,星;0";
    myquestions[14]="歲月如_?_;梭,光,時;0";
    myquestions[15]="汗_?_充棟;雞,牛,蛇 ;1";
    myquestions[16]="_?_庭若市;窗,戶,門;2";
    myquestions[17]="罄_?_難書;柳,花,竹;2";
    myquestions[18]="_?_死__烹;狗/兔,雞/鴨,兔/狗;2";
    myquestions[19]="入木_?_分;五,七,三;2";
    myquestions[20]="大_?_展翅;鷹,鵰,鵬;2";
    myquestions[21]="呆若木_?_;鵝,鳥,雞;2";
    myquestions[22]="鯉魚躍__門;狗,大,龍;2";
    myquestions[23]="一樣米飼_?_樣人;個,十,百;2";
    myquestions[24]="_?_比人，氣死人;哈,猴,人;2";
    myquestions[25]="輸人不輸陣，輸陣就歹看_?_;面,手,腳;0";
    myquestions[26]="女人心，海底_?_;撈,針,摸;1";
    myquestions[27]="三角形有幾個角_?_;3 ,4 ,2;0";
    myquestions[28]="請問6X6=36，那麼7X7=_?_;36 ,49 ,56;1";
    myquestions[29]="5分之5約分後=1那麼，6分之6約分等於_?_;0.5 ,1.5 ,1;2";
    myquestions[30]="你在平均時數90公里下，騎了兩個小時後請問你騎了_?_ 公里;90 ,180 ,270;1";
    myquestions[31]="五的倍數有_?_;2 ,135 ,188;1";
    myquestions[32]="_?_不是台灣藝人;阿Ken,阿Ben,奧蘭多布魯;2";
    myquestions[33]="漂白水的成分是_?_;次氯酸鈉,檸檬汁,香蕉汁;0";
    myquestions[34]="葡萄汁是用_?_做成的;芭樂,香蕉,葡萄;2";
    myquestions[35]="_?_為洗衣精牌子;墊腳石,熊寶貝,五匙靈;1";
    myquestions[36]="2013年台灣總統是_?_;成吉思汗,馬英九,布希;1";
    myquestions[37]="Apple公司的現今CEO是_?_;庫克,賈伯斯,比爾蓋茲;0";
    myquestions[38]="現今人口最多的國家是_?_;台灣,中國,紐西蘭;1";
    myquestions[39]="巴黎最有名的景點是_?_;巴黎鐵塔,巴黎汽車,巴黎漢堡;0";
    myquestions[40]="木須炒麵中的木須是指_?_;龍,韭黃,蛋;2";
    myquestions[41]="世界上沒有_?_樹;榴槤,葡萄,檸檬;1";
    myquestions[42]="_?_不能微波;瓷盤,馬克杯,鐵碗;2";
    myquestions[43]="_?_不是宮崎駿動畫主角?;蘇菲,豆豆先生,波妞;1";
    myquestions[44]="迪士尼卡通看不到_?_;鳴人,米奇,白雪公主;0";
    myquestions[45]="哆拉A夢最愛的食物是_?_;冰淇淋,銅鑼燒,肉包;1";
    myquestions[46]="下列哪一組中的兩數互質_?_;26、39 ,28、35,24、25;2";
    myquestions[47]="11~30這些數中，共有_?_個質數;4個 ,5個,6個;2";
    myquestions[48]="一束花有8朵海芋和5朵百合。海芋和百合數量比的比值是_?_;5/8 ,8/5,13/8;1";
    myquestions[49]="3：5是_?_的最簡單整數比？;3.1：5.1 ,113：115,310：0.5;2";
    myquestions[50]="快樂百貨清倉大拍賣，每消費20元可集1點，小明買了一件2000元的裙子，可集到_?_點;200點 ,150點,100點;2";
    myquestions[51]="把圓規張開10公分所畫出來的圓，直徑是_?_公分;20公分 ,10公分,15公分;0";
    myquestions[52]="半斤=八兩，一斤=0.6公斤，下列哪個最重_?_; Amy體重40公斤 ,豬有800兩重 ,50斤麵粉;0";
    myquestions[53]="_?_ you crazy?; Are , Is , Am;0";
    myquestions[54]="Bill always _?_his own bed.; made , had , makes;2";
    myquestions[55]="I consider _?_  you are my best friend.; which , that , apple;1";
    myquestions[56]="Marie is _?_ aloud.; talking,told,tolded;0";
    myquestions[57]="How _?_ do you go to gym?;are,often,never;1";
    myquestions[58]="What _?_ is today?;day,banana ,fish;0";
    myquestions[59]="How are _?_;she , me , you;2";
    myquestions[60]="I can't find _?_ book.;she , my ,we;1";
    myquestions[61]="It is a _?_;pie , apple , egg;0";
    myquestions[62]="f_?_tball;aa ,oo , ee;1";
    myquestions[63]="s_?_ool; ch , sh ,th;0";
    myquestions[64]="a_?_le;pp ,kk , ee;0";
    myquestions[65]="e_?_;kk , dd , gg;2";
    myquestions[66]="comput_?_;ar ,er ,or;1";
    myquestions[67]="faceb__k; aa ,oo , ou;1";
    myquestions[68]="Sam is _?_ the tree.;playing ,climbing ,dancing;1";
    myquestions[69]="Tai_?_; wan , won ,win;0";
    myquestions[70]="_?_101;Taichung , Tainan ,Taipei;2";
    myquestions[71]="Roses are _?_, Violets are blue.; great ,green ,red;2";
    myquestions[72]="大象有四隻腳，那長毛象有_?_隻腳?; 5隻, 2隻, 4隻;2";
    myquestions[73]="麥當勞的代表人物是_?_;麥當勞爺爺,麥當勞奶奶,麥當勞叔叔;2";
    myquestions[74]="_?_無法禦寒?;毛衣,泳褲,羽絨外套;1";
    myquestions[75]="如果被燙傷，要_?_;沖脫泡蓋送,蒸煮烤烹燒,衝托炮蓋誦;0";
    myquestions[76]="小華右手斷掉後裝上了義肢，請問他現在有_?_隻腳?1,2,3;1";
    myquestions[77]="_?_並非台灣偶像團體?; S.H.E. ,5566 ,Maroon 5;2";
    myquestions[78]="復仇者聯盟成員不包括_?_;火影忍者綠巨人浩克,雷神索爾;0";
    myquestions[79]="超級瑪莉歐吃_?_會長大?;蘑菇,茄子,烏龜;0";
    myquestions[80]="_?_不是台灣企業？; hTC ,Asus ,Lenovo;2";
    myquestions[81]="目前台北氣溫15度，_?_最有可能在下雪？;陽明山,大坑山,喜馬拉雅山;2";

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
		whichquestion = Math.round(Math.random() * 81);
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
