(function() {

	window.addEventListener('keydown', function(e) {
		if (e.keyCode == 82 && e.metaKey) {
			window.location.reload();
		}
	});

	if (!navigator.mozAlarms) {
		return;
	}

	var pickImage = document.querySelector("#pick-image");
	if (pickImage) {
		pickImage.onclick = function() {
			var pick = new MozActivity({
				name: "pick",
				data: {
					type: ["image/png", "image/jpg", "image/jpeg"]
				}
			});

			pick.onsuccess = function() {
				var img = document.createElement("img");
				img.src = window.URL.createObjectURL(this.result.blob);
				var imagePresenter = document.querySelector("#image-presenter");
				imagePresenter.appendChild(img);
				imagePresenter.style.display = "block";
			};

			pick.onerror = function() {
				alert("Can't view the image!");
			};
		}
	}

	var check = document.querySelector("#check");
	if (check) {
		check.onclick = function() {

			var now = new Date();
			var v = new Date();
			v.setSeconds(now.getSeconds() + 5);
			var h = now.getHours();
			var m = now.getMinutes();
			var s = now.getSeconds();


			// var alarmDate = new Date(+new Date() + dt);

			// var alarmDate = new Date(+new Date() );

			if (!navigator.mozAlarms) {
				return false;
			}

			var data = {
				label: "Test Alarm" + now
			};

			var request = navigator.mozAlarms.add(v, "ignoreTimezone", data);

			request.onsuccess = function() {
				alert('Alarm set' + v);
				// document.location.href="index2.html";
				document.getElementById('t1').innerHTML = h + ":" + m + ":" + s;
			};

			request.onerror = function() {
				alert("An error occurred: " + this.error.name);
			};

		}
	}

	var now = new Date();
	// if (navigator.mozAlarms) {
	//   document.getElementById('t2').innerHTML="now = "+now;
	// if (navigator.mozHasPendingMessage("alarm")) {
	document.getElementById('t3').innerHTML = "now = " + now;
	navigator.mozSetMessageHandler("alarm", function handleEvent(mozAlarm) {
		navigator.vibrate(2000);
		var notification = navigator.mozNotification.createNotification('There you go', mozAlarm.data.label);
		notification.show();
	});
	// }

	// }

	var test = document.querySelector("#test");
	if (test) {
		test.onclick = function() {

			var req = navigator.mozAlarms.getAll();
			req.onsuccess = function(e) {
				alert(JSON.stringify(e.target.result));
			};
			req.onerror = function(e) {
				alert(e.target.error.name);
			};
		}
	}

	var clear = document.querySelector("#clear");
	if (clear) {
		clear.onclick = function() {

			var reqClearAlarms = navigator.mozAlarms.getAll();

			reqClearAlarms.onsuccess = function(e) {

				e.target.result.forEach(function(v, k) {
					//if (v.data && v.data.src === 'daddy') {
					navigator.mozAlarms.remove(v.id);
					//}
				});
			};

			reqClearAlarms.onerror = function(e) {
				alert(e.target.error.name);
			};

		}
	}

})();