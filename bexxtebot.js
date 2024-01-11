// Home of the BexxteBot object herself
// handles establishing client connections, moderating, sending messages, activating timers
// at the bottom of this page is what makes it all go

// REQUIRES
import { BOT_NAME, BEXXTEBOT_TOKEN, CLIENT_ID } from './ev.js'; // environment variables
import commands from './commands.js';
import timers from './timers.js';
import bexxteConfig from './configuration.js';
import Database from './classes/Database.js';

import LogHandler from './classes/LogHandler.js';

//const discord = require('discord.js');
import Bot from './classes/Bot.js';
let db;

(async () => {
  db = new Database();
  await db.buildTables();
})();

// THE QUEEN AND LEGEND HERSELF
const bexxteBot = new Bot(BOT_NAME, bexxteConfig.broadcastingChannel, BEXXTEBOT_TOKEN, CLIENT_ID, commands, timers, new LogHandler(), bexxteConfig, db);

// node bexxtebot.js log command
// node bexxtebot.js log error
if (process.argv.length > 2) {
  if (process.argv[2].match(/logs?/i)) {
    if (process.argv[3].match(/commands?/i)) {
      bexxteBot.logger.makeLog('command');
    } else if (process.argv[3].match(/errors?/i)) {
      bexxteBot.logger.makeLog('error');
    }
  }
} else {
  try {
    bexxteBot.run();
  } catch (e) {
    bexxteBot.logger.log('error', e);
  }
}

import express from 'express';
const app = express();
const port = 3000;

app.listen(port, () => {});