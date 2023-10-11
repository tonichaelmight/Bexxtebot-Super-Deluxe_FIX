import Timer from './classes/Timer.js';
import bexxteConfig from './configuration.js';

const commandTimer = new Timer('commands', 720, 1380, { commands: bexxteConfig.timerCommands });

const dwarvenVowTimer = new Timer('dwarven vows', 1800, 900, { gameTitle: 'Tales of Symphonia', outputs: bexxteConfig.dwarvenVows });

const crypticismsTimer = new Timer('crypticisms', 3600, 7200, {
    outputs: [
        'calculating...',
        'analyzing...',
        'aggregating...',
        'hypothesizing...',
        'postulating...',
        'virtualizing...',
        'normalizing...',
        'switching to the Santa Clarita Diet...',
        'chilling in Cedar Rapids...',
        'to be... or not to be...',
        'channeling...',
        'quantum tunnelling...',
        'making things up...',
        'destroying evidence...',
        'updating protocols...',
        'mining...',
        'extracting...',
        'exfoliating...',
        'moisturizing...',
        'calibrating...',
        'slaying...',
        'promoting equality...',
        'relaxing...',
        'smoking a fat j...',
        'hyperfixating...',
        'grabbing brunch and champagne with my girlies...',
        'watching out for the killer...',
        'boiling water for the pasta...',
        'meandering...'
    ]
});

const timers = [
    commandTimer, dwarvenVowTimer, crypticismsTimer
];

export default timers;