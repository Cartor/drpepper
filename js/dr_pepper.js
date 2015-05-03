
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
    this.ipAddress = ipAddress;
    this.session = new QiSession(ipAddress);
  }
};

Robot.prototype._getMemoryKey = function(actuator) {
  return "Device/SubDeviceList/" + actuator + "/Temperature/Sensor/Value";
};

Robot.prototype.getTemperature = function(actuator, handler) {
  var robot = this;
  if (this.isRealRobot) {
    this.session.service("ALMemory").done(function(memory) {
      memory.getData(robot._getMemoryKey(actuator)).done(function(value) {
        handler(actuator, value);
      });
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
