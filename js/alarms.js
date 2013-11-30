'use strict';

var AsyncStorage = (function() {

  var DBNAME = 'AsyncStorage';
  var DBVERSION = '1';
  var STORENAME = 'alarms';
  var db = null;

  function withStore(type, cb) {
    if (db !== null) {
      cb(db.transaction(STORENAME, type).objectStore(STORENAME));
    } else {
			window.indexedDB = window.webkitIndexedDB;
      var openreq = window.indexedDB.open(DBNAME, DBVERSION);
      openreq.onerror = function withStoreOnError() {
        console.error("AsyncStorage: can't open database:", openreq.error.name);
      };
      openreq.onupgradeneeded = function withStoreOnUpgradeNeeded() {
        // First time setup: create an empty object store
        openreq.result.createObjectStore(STORENAME);
      };
      openreq.onsuccess = function withStoreOnSuccess() {
        db = openreq.result;
        cb(db.transaction(STORENAME, type).objectStore(STORENAME));
      };
    }
  }

  function getItem(key, callback) {
    withStore('readonly', function getItemBody(store) {
      var req = store.get(key);

      req.onsuccess = function getItemOnSuccess() {
        var value = req.result;
        if (value === undefined)
          value = null;
        callback(value);
      };

      req.onerror = function getItemOnError() {
        console.error('Error in AsyncStorage.getItem(): ', req.error.name);
        callback();
      };
    });
  }

  function setItem(key, value, callback) {
    withStore('readwrite', function setItemBody(store) {
      var req = store.put(value, key);

      req.onsuccess = function setItemOnSuccess() {
        callback();
      };

      req.onerror = function setItemOnError() {
        console.error('Error in AsyncStorage.setItem(): ', req.error.name);
        callback();
      };
    });
  }

  function removeItem(key) {
    withStore('readwrite', function removeItemBody(store) {
      var req = store.delete(key);

      req.onerror = function removeItemOnError() {
        console.error('Error in AsyncStorage.removeItem(): ', req.error.name);
      };
    });
  }

  return {
    getItem: getItem,
    setItem: setItem,
    removeItem: removeItem
  };
}());

var WebAlarmAPI = (function() {

  navigator.alarms = navigator.mozAlarms;

  if (!navigator.alarms) {
    // Tizen device because mozAlarms is not defined

    var Request = function() {
      this.done = function(result) {
        this.result = result;
        if (typeof this.onsuccess === 'function') {
          var ev = {};
          ev.target = this;
          window.setTimeout(function() {
            this.onsuccess(ev);
          }.bind(this), 0);
        }
      };

      this.failed = function(error) {
        this.error = error;
        if (typeof this.onerror === 'function') {
          var ev = {};
          ev.target = this;
          window.setTimeout(function() {
            this.onerror(ev);
          }.bind(this), 0);
        }
      };
    };

    navigator.alarms = {
      getAll: function getAll() {
        var req = new Request();

				window.setTimeout(function() {
					try {
						var alarms = [];

						var alarmAbsolutes = tizen.alarm.getAll();
						var total = alarmAbsolutes.length;

						if (total === 0) {
							req.done(alarms);
						} else {
							alarmAbsolutes.forEach(function(alarmAbsolute) {
								var alarm = {
									id: alarmAbsolute.id,
									date: alarmAbsolute.date,
								};

								AsyncStorage.getItem(alarmAbsolute.id, function(info) {
									var alarm = {
										id: alarmAbsolute.id,
										date: alarmAbsolute.date,
									};

									if (info) {
										// Enriching with respectTimezone & data saved in add method
										Object.keys(info).forEach(function(key) {
											if (info[key] && info[key] !== null) {
												alarm[key] = info[key];
											}
										});
									}

									alarms.push(alarm);

									if (--total === 0) {
										req.done(alarms);
									}
								});
							});
						}
					} catch (error) {
						req.failed(error);
					}
				});

        return req;
      },

      add: function add(date, respectTimezone, data) {
        var req = new Request();

				window.setTimeout(function() {
					try {
						// Creating a new alarm absolute from the date
						var alarm = new tizen.AlarmAbsolute(date);
						var appControl = new tizen.ApplicationControl(
											'http://tizen.org/appcontrol/operation/alarm');
						tizen.alarm.add(alarm,
														tizen.application.getCurrentApplication().appInfo.id,
														appControl);

						// We have to save respectTimezone and data on indexedDB
						AsyncStorage.setItem(alarm.id, {
							respectTimezone: respectTimezone,
							data: data
						}, function saved() {
							req.done(alarm.id);
						});
					} catch (error) {
						req.failed(error);
					}
				});

        return req;
      },

      remove: function (alarmId) {
        var req = new Request();

				window.setTimeout(function() {
					try {
						AsyncStorage.removeItem(alarmId);
						tizen.alarm.remove(alarmId);
						// Must set the result attribute of the AlarmRequest to true
						req.done(true);
					} catch (error) {
						if (error.type === 'NotFoundError') {
							// This alarm identifier cannot be found in the storage
							req.done(false);
						} else {
							req.failed(error);
						}
					}
				});

        return req;
      }
    };

		return {
			get: function(alarmId) {
				var req = new Request();

				AsyncStorage.getItem(alarmId, function(info) {
					var alarm = {
						id: alarmId,
						date: new Date(Date.now()),
					};

					if (info) {
						// Enriching with respectTimezone & data saved in add method
						Object.keys(info).forEach(function(key) {
							if (info[key] && info[key] !== null) {
								alarm[key] = info[key];
							}
						});
					}

					req.done(alarm);
				});

        return req;
			}
		}
  }
})();
