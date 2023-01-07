import * as fs from 'fs';
import * as path from'path';
import { spawn } from 'child_process';
import { CompRetty } from './lib/compretty.js';
import * as dotenv from 'dotenv';
dotenv.config();

var isQuiet = false;
var logPath = path.join(process.cwd(), 'bot.log');
var shouldRestart = false;

function _displayHelp() {
  console.log(
    'Options:' +
    '\n-h / --help			Display this page.' +
    '\n-q / --quiet\n Do not log info and warnings into console.\n  The \'-s\' option will not be affected.' +
    '\n-s / --save-log\n	Save script log to a file.\n	Default path is \'bot.log\' in parent directory, custom path can be specified with \'-o\'.' +
    '\n-o / --output <filepath>	Specify a custom log output file path instead of \'bot.log\'.' +
    '\n-r / --restart			Automatically restart this script on crash.' +
    '\n--raw\n	Execute a raw run.\n	The script will ignore all options and its output will not be formatted.'
  );
}

function log(value) {
  if (typeof value != 'string') {
    value = value.toString();
  }
  if (isQuiet) {
    var _0 = value[0];
    if (_0 != 'F' && _0 != 'S') return;
    if (value[1] != ':') return;
  }
  console.log(value.slice(0, -1));
}

function runRaw() {
  var _exitDone = false;
  var _compretty;
  function exit() {
    if (_exitDone) return;
    _exitDone = true;
    _compretty.stop();
    console.log('S:Waiting 30 seconds for any file operations to finish.');
    setTimeout((function() {
      return process.exit(0);
    }), 30000);
  }
  process.on('SIGINT', () => exit());
  process.on('SIGTERM', () => exit());
  _compretty = CompRetty.fromENV();
  _compretty.start();
}

function main() {
  function onSaveLog() {
    log = (value) => {
      if (typeof value != 'string') {
        value = value.toString();
      }
      fs.appendFileSync(logPath, value);
      if (isQuiet) {
        var _0 = value[0];
        if (_0 != 'F' && _0 != 'S') return;
        if (value[1] != ':') return;
      }
      console.log(value.slice(0, -1));
    };
  }
  
  for (var i = 0; i != process.argv.length; i++) {  
    function _onOutput(onMissing) {
      if (i == process.argv.length - 1) {
        log(`F:Command option \'${process.argv[i]}\' is missing a value.\n`);
        process.exit(1);
      }
      logPath = process.argv[++i];
    }
  
    switch (process.argv[i]) {
      case '--raw':
        runRaw();
        return;
      case 'help':
        _displayHelp();
        return;
      case '-h':
        _displayHelp();
        return;
      case '--help':
        _displayHelp();
        return;
      case '-q':
        isQuiet = true;
        break;
      case '--quiet':
        isQuiet = true;
        break;
      case '-s':
        onSaveLog();
        break;
      case '--save-log':
        onSaveLog();
        break;
      case '-o':
        _onOutput();
        break;
      case '--output':
        _onOutput();
        break;
      case '-r':
        shouldRestart = true;
        break;
      case '--restart':
        shouldRestart = true;
        break;
    }
  }
  
  async function runBot(onClose = null) {
    var _exiting = false;
    var child = spawn('node', ['start_bot.js', '--raw']);
    process.on('SIGINT', () => {
      child.kill('SIGINT');
      _exiting = true;
    });
    process.on('SIGTERM', () => {
      child.kill('SIGTERM');
      _exiting = true;
    });
    child.stdout.on('data', (data) => {
      log(data);
    });  
    child.stderr.on('data', (data) => {
      log(`F:\n ${data}`);
    });
    child.on('close', (code) => {
      log(`S:Bot exited with code ${code}.\n`);
      if (code == 0) process.exit(0);
      if (onClose != null) onClose(code);
      if (_exiting) process.exit(code);
    });
  }
  
  if (shouldRestart) {
    function _restartBot() {
      log('S:Restarting.\n');
      runBot(() => _restartBot());  
    }
    runBot(() => _restartBot());
    return;
  }
  
  runBot((code) => process.exit(code));
}

main();
