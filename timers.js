import Timer from './classes/Timer.js';
import bexxteConfig from './configuration.js';

const commandTimer = new Timer('commands', 720000, 1380000, { commands: bexxteConfig.timerCommands });

const dwarvenVowTimer = new Timer('dwarven vows', 1800000, 900000, { gameTitle: 'Tales of Symphonia', outputs: bexxteConfig.dwarvenVows });

const timers = [
    commandTimer, dwarvenVowTimer
];

export default timers;