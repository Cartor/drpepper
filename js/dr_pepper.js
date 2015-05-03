
Robot = function(isRealRobot) {
  this.isRealRobot = isRealRobot;

  this.ipAddress = "";
  this.session   = null;

  arguments.callee.actuatorList = [
    "HeadYaw",
    "HeadPitch",

    "LShoulderPitch",
    "LShoulderRoll",
    "LElbowYaw",
    "LElbowRoll",
    "LWristYaw",
    "LHand",

    "RShoulderPitch",
    "RShoulderRoll",
    "RElbowYaw",
    "RElbowRoll",
    "RWristYaw",
    "RHand",

    "HipPitch",
    "HipRoll",
  ];
};

Robot.prototype.connect = function(ipAddress) {
  if (this.ipAddress != ipAddress || this.session == null) {
    var resource = "drpepper/js/qimessaging/1.0/socket.io";
    this.ipAddress = ipAddress;
    this.session = new QiSession(ipAddress, resource);
  }
};

Robot.prototype._getMemoryKey = function(actuator) {
  return "Device/SubDeviceList/" + actuator + "/Temperature/Sensor/Value";
};

Robot.prototype.getTemperature = function(actuator, handler) {
  if (this.isRealRobot) {
    this.session.service("ALMemory").done(function(memory) {
      var value = memory.getData(this._getMemoryKey(actuator));
      handler(actuator, value);
    }).fail(function(error) {
	    handler(actuator, 0);
    });

  } else {
    var host = location.hostname;
    var url = "http://" +  host + "/dr_pepper/data/baseValue.txt";
    $.ajax({
      type: "GET",
      url: url
    }).done(function(data) {
      var value = parseInt(data) + Math.random() * 10;
      handler(actuator, value.toFixed(1));
    }).error(function() {
      handler(actuator, 0);
    });
  }
};
