#!/usr/bin/env node

var cmdPowerLib = require('../lib/main');
var program = require('commander');

program.version('v' + require('../package.json').version)
    .description('Zhangwenan\'s First command');

program.command('say <words>')
.alias('s')
.description('say something')
.action((words)=>{
    cmdPowerLib.say(words);
})

program.parse(process.argv)

if(program.args.length === 0){
    program.help()
}
