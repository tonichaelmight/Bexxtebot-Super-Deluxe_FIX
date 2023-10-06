import Bot from "../classes/Bot";
import LogHandler from "../classes/LogHandler";
import { TwitchCommand } from "../classes/TwitchCommand";
import TwitchMessage from '../classes/TwitchMessage'; 
import bexxteConfig from "../configuration.js";

const tc1 = new TwitchCommand('shelby', 'hi this is shelby');
const tc2 = new TwitchCommand('renee', 'hi this is renee', {cooldown_ms: 500})
const tc3 = new TwitchCommand('esme', 'hi this is esme', {modOnly: true})
const tc4 = new TwitchCommand('jasper', 'hi this is jasper', {modOnly: true, cooldown_ms: 1500})

const tc5 = new TwitchCommand('bella', 'hi this is bella', {aliases: 'bellabie'});
const tc6 = new TwitchCommand('edward', 'hi this is edward', {aliases: ['edwina', 'eduardo']});

const tc7 = new TwitchCommand('shelby', () => 'hi this is shelby');
const tc8 = new TwitchCommand('bella', (messageObject) => {
    const args = messageObject.content.split(' ').slice(1);
    const arg1 = args[0];
    const arg2 = args[1];
    return `bella ${arg2} ${arg1}`;
}, {refsMessage: true});

test('returns an object with "name", "outputFunction", "onCooldown", "options.cooldown_ms", and "options.modOnly" properties', () => {
    const tcs = [tc1, tc2, tc3, tc4, tc5, tc6, tc7, tc8]

    tcs.forEach(tc => {
        expect(tc).toHaveProperty('name');
        expect(tc).toHaveProperty('outputFunction');
        expect(tc).toHaveProperty('options');
        expect(tc).toHaveProperty('onCooldown');
        expect(tc.options).toHaveProperty('cooldown_ms');
        expect(tc.options).toHaveProperty('modOnly');
    });

    [tc5, tc6].forEach(tc => {
        expect(tc.options).toHaveProperty('aliases');
    })

})

test('each property of the returned object holds the correct value', () => {
    expect(tc1.name).toStrictEqual('shelby');
    expect(tc1.outputFunction()).toStrictEqual('hi this is shelby');
    // default value before execution
    expect(tc1.onCooldown).toStrictEqual(false);
    // default value
    expect(tc1.options.cooldown_ms).toStrictEqual(10000);
    // default value
    expect(tc1.options.modOnly).toStrictEqual(false);

    expect(tc2.name).toStrictEqual('renee');
    expect(tc2.outputFunction()).toStrictEqual('hi this is renee');
    expect(tc2.onCooldown).toStrictEqual(false);
    expect(tc2.options.cooldown_ms).toStrictEqual(500);
    expect(tc2.options.modOnly).toStrictEqual(false);

    expect(tc3.name).toStrictEqual('esme');
    expect(tc3.outputFunction()).toStrictEqual('hi this is esme');
    expect(tc3.onCooldown).toStrictEqual(false);
    expect(tc3.options.cooldown_ms).toStrictEqual(10000);
    expect(tc3.options.modOnly).toStrictEqual(true);

    expect(tc4.name).toStrictEqual('jasper');
    expect(tc4.outputFunction()).toStrictEqual('hi this is jasper');
    expect(tc4.onCooldown).toStrictEqual(false);
    expect(tc4.options.cooldown_ms).toStrictEqual(1500);
    expect(tc4.options.modOnly).toStrictEqual(true);

    expect(tc5.name).toStrictEqual('bella');
    expect(tc5.outputFunction()).toStrictEqual('hi this is bella');
    expect(tc5.onCooldown).toStrictEqual(false);
    expect(tc5.options.cooldown_ms).toStrictEqual(10000);
    expect(tc5.options.modOnly).toStrictEqual(false);
    // single aliases should get placed in an array
    expect(tc5.options.aliases).toStrictEqual(['bellabie']);

    expect(tc6.name).toStrictEqual('edward');
    expect(tc6.outputFunction()).toStrictEqual('hi this is edward');
    expect(tc6.onCooldown).toStrictEqual(false);
    expect(tc6.options.cooldown_ms).toStrictEqual(10000);
    expect(tc6.options.modOnly).toStrictEqual(false);
    // multiple aliases
    expect(tc6.options.aliases).toStrictEqual(['edwina', 'eduardo']);

    expect(tc7.name).toStrictEqual('shelby');
    expect(tc7.outputFunction()).toStrictEqual('hi this is shelby');
    // default value before execution
    expect(tc7.onCooldown).toStrictEqual(false);
    // default value
    expect(tc7.options.cooldown_ms).toStrictEqual(10000);
    // default value
    expect(tc7.options.modOnly).toStrictEqual(false);
    
    const testMessage = new TwitchMessage('#tonichaelmight', {username: 'bexxters'}, '!bella forever edward', false);

    expect(tc8.name).toStrictEqual('bella');
    expect(tc8.outputFunction(testMessage)).toStrictEqual('bella edward forever');
    expect(tc8.onCooldown).toStrictEqual(false);
    expect(tc8.options.cooldown_ms).toStrictEqual(10000);
    expect(tc8.options.modOnly).toStrictEqual(false);
    expect(tc8.options.refsMessage).toStrictEqual(true);
})

function wait(ms) {
    return new Promise((resolve, reject) => {
        const ref = setTimeout(() => {
            ref.unref();
            resolve(true);
        }, ms);
    })
}

test('createCooldown() creates a cooldown', async () => {
    expect(tc2.onCooldown).toStrictEqual(false);
    tc2.createCooldown();
    expect(tc2.onCooldown).toStrictEqual(true);
    await wait(tc2.options.cooldown_ms - 10);
    expect(tc2.onCooldown).toStrictEqual(true);
    await wait(15);
    expect(tc2.onCooldown).toStrictEqual(false);
})

// necessary to have these commands linked to a bot/streamer for logger logic
const bexxteFake = new Bot('bexxteFake', 'tonichaelmight', undefined, [tc1, tc3, tc5], [], new LogHandler(), bexxteConfig);

test('execute() works', () => {
    const testMessage = new TwitchMessage('#tonichaelmight', {username: 'bexxters'}, '!shelby', false);
    tc1.execute(testMessage);

    expect(testMessage).toHaveProperty('response');
    expect(testMessage.response[0]).toHaveProperty('output');
    expect(testMessage.response[0].output).toStrictEqual('hi this is shelby');
});

test('moderation is effective', () => {
    const testMessage1 = new TwitchMessage('#tonichaelmight', {username: 'bexxters'}, '!esme', false);
    const testMessage2 = new TwitchMessage('#tonichaelmight', {username: 'bexxters', mod: true}, '!esme', false);
    const testMessage3 = new TwitchMessage('#tonichaelmight', {username: 'bexxters', badges: {vip: 1}}, '!esme', false);
    // tc3 is mod-only so nothing should happen here
    tc3.execute(testMessage1);
    expect(testMessage1).not.toHaveProperty('response');
    // testMessage2 was sent by a mod, so a response should be added
    tc3.execute(testMessage2);
    expect(testMessage2).toHaveProperty('response');
    expect(testMessage2.response).toHaveLength(1);
    expect(testMessage2.response[0].output).toStrictEqual('hi this is esme');
    // vip should do nothing
    tc3.execute(testMessage3);
    expect(testMessage3).not.toHaveProperty('response');
})

test('createCooldown() is effective in execution', () => {
    const testMessage1 = new TwitchMessage('#tonichaelmight', {username: 'bexxters'}, '!bella', false);
    const testMessage2 = new TwitchMessage('#tonichaelmight', {username: 'bexxters', mod: true}, '!bella', false);
    const testMessage3 = new TwitchMessage('#tonichaelmight', {username: 'theninjamdm', badges: {vip: '1'}}, '!bella', false);
    
    expect(tc5.onCooldown).toStrictEqual(false);
    tc5.execute(testMessage1);
    expect(testMessage1).toHaveProperty('response');
    expect(testMessage1.response).toHaveLength(1);
    expect(tc5.onCooldown).toStrictEqual(true);
    tc5.execute(testMessage1);
    // should not add a message since the command is on cooldown
    expect(testMessage1.response).toHaveLength(1);

    tc5.execute(testMessage2);
    expect(testMessage2.response).toHaveLength(1);
    tc5.execute(testMessage2);
    expect(testMessage2.response).toHaveLength(2);

    // VIP is subject to cooldowns
    tc5.execute(testMessage3);
    expect(testMessage3.response).toStrictEqual(undefined);
})

