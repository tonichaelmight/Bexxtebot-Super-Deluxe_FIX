import { TwitchCommand, AsyncTwitchCommand, TwitchCounterCommand } from "../classes/TwitchCommand";
import Timer from "../classes/Timer";
import LogHandler from "../classes/LogHandler";
import Bot from "../classes/Bot";

const botName = 'bexxteFake';
const broadcastingChannel = 'tonichaelmight'
const token = 12345;
const commands = {
    shelby: new TwitchCommand('shelby', 'hi this is shelby'),
    renee: new TwitchCommand('renee', 'hi this is renee', {cooldown_ms: 500}),
    esme: new TwitchCommand('esme', 'hi this is esme', {modOnly: true}),
    jasper: new TwitchCommand('jasper', 'hi this is jasper', {modOnly: true, cooldown_ms: 1500}),
    bella: new TwitchCommand('bella', 'hi this is bella', {aliases: 'bellabie'}),
    edward: new TwitchCommand('edward', 'hi this is edward', {aliases: ['edwina', 'eduardo']}),
    forever: new TwitchCommand('forever', function(messageObject) {
        const args = messageObject.content.split(' ').slice(1);
        const arg1 = args[0];
        const arg2 = args[1];
        return `${arg2} ${arg1} ${this.name}`;
    }, {refsMessage: true}),
    alice: new AsyncTwitchCommand('alice', async () => {
        return new Promise((resolve, reject) => {
            const ref = setTimeout(() => {
                ref.unref();
                resolve('hi this is alice');
            }, 500);
        })
    })
};
const timers = [];
const config = {};

const bexxteFake = new Bot(botName, broadcastingChannel, token, commands, timers, new LogHandler(), config);

export default bexxteFake;

test('the bot comes out with the correct properties', () => {
    expect(bexxteFake).toHaveProperty('name');
    expect(bexxteFake).toHaveProperty('channel');
    expect(bexxteFake).toHaveProperty('token');
    expect(bexxteFake).toHaveProperty('logger');
    expect(bexxteFake).toHaveProperty('streamer');
})