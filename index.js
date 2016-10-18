var Device = require('zetta-device');
var util = require('util');
var extend = require('node.extend');

var OPTOEMU_SNR_DR1_IMG = 'http://www.opto22.com/images/products/OPTOEMU-SNR-DR1_p_450.png';

function degToRad(x) {
  return x * ( Math.PI / 180 );
}

// mock device based on OPTOEMU SENSOR COMMUNICATION GUIDE
// OptoEMU Sensor(TM) Energy Monitoring Units
// http://www.opto22.com/site/pr_details.aspx?cid=8&item=OPTOEMU-SNR-DR1

var IndustrialMonitor = module.exports = function(opts) {
  Device.call(this);
  
  // Power is the live measurement value
  this.power = 0;

  // Quality (Status): 0 = Value has not been read yet. -1 or less = Number of consecutive failed reads. 1 or greater = Number of consecutive successful reads.
  this.measurementStatus = 0;

  // Quality (Freshness): Number of seconds since last successful read. Modbus inputs are read sequentially If one or more inputs is currently offline, it can affect the freshness of the points that are online.
  this.measurementFreshness = 0;

  this._opts = opts || {};
  this._increment = this._opts['increment'] || 15;
  this._timeOut = null;
  this._counter = 0;
  this._lastReadStatus = 0;
  this._lastGoodPowerReading = 0;
  
  this.style = extend(true, this.style, {properties: {
    stateImage: {
      url: OPTOEMU_SNR_DR1_IMG,
      tintMode: 'original'
    },
    power: {
      display: 'billboard',
      significantDigits: 2,
      symbol: 'kW'
    }
  }});
  
};
util.inherits(IndustrialMonitor, Device);

IndustrialMonitor.prototype.init = function(config) {
  config
    .name('Industrial Monitor')
    .type('industrial-monitor')
    .state('ready')
    .when('ready', {allow: ['make-not-ready']})
    .when('not-ready', {allow: ['make-ready']})
    .map('make-ready', this.makeReady)
    .map('make-not-ready', this.makeNotReady)
    .monitor('power')
    .monitor('measurementStatus')
    .monitor('measurementFreshness');

  this._startMockData();
};

IndustrialMonitor.prototype.makeReady = function(cb) {
  this.state = 'ready';
  this._startMockData();
  cb();
}

IndustrialMonitor.prototype.makeNotReady = function(cb) {
  this.state = 'not-ready'
  this._stopMockData();
  cb();
}

IndustrialMonitor.prototype._startMockData = function(cb) {
  var self = this;
  this._timeOut = setInterval(function() {
    self._counter += self._increment;
    
    if (Math.random() > 0.2) {
      self.power = self._lastGoodPowerReading = (Math.sin(degToRad(self._counter)) + 2.0);
      if (self._lastReadStatus === 1) {
        self.measurementStatus += 1;
      } else {
        self.measurementStatus = 1;
      }
      self.measurementFreshness = 0;
      self._lastReadStatus = 1;
    } else {
      self.power = self._lastGoodPowerReading; 
      if (self._lastReadStatus === -1) {
        self.measurementStatus -= 1;
      } else {
        self.measurementStatus = -1;
      }
      self.measurementFreshness += self._increment / 100;
      self._lastReadStatus = -1;
    }
  }, 100);
}

IndustrialMonitor.prototype._stopMockData = function(cb) {
  clearTimeout(this._timeOut);
}
