var zetta = require('zetta');
var IndustrialMonitor = require('../index');
var argv = require('minimist')(process.argv.slice(2));

zetta()
  .use(IndustrialMonitor, {increment: argv['i']})
  .link('http://dev.zettaapi.org')
  .listen(1337);
