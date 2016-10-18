# Zetta Industrial Monitor Modbus Mock Driver

## Install

```
$> npm install zetta-industrial-monitor-modbus-mock-driver
```

## Usage

```javascript
var zetta = require('zetta');
var IndustrialMonitor = require('zetta-industrial-monitor-modbus-mock-driver');

zetta()
  .use(IndustrialMonitor)
  .listen(1337)
```

