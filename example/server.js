var zetta = require('zetta');
var IndustrialMonitor = require('../index');
var style = require('./apps/style');
var argv = require('minimist')(process.argv.slice(2));

zetta()
  .use(IndustrialMonitor, {increment: argv['i']})
  .use(style)
  .listen(1337);
