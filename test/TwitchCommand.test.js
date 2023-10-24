// here, things that are internal to the class can be tested here
// but portions relying on the bot being built out should be moved into bexxtebot.test.js

import bexxteFake from './bexxtebot.test.js';
const { commands } = bexxteFake.streamer;

// ALL COMMANDS SHOULD GO INTO bexxtebot.test.js

import { TwitchCommand } from "../classes/TwitchCommand";
import TwitchMessage from '../classes/TwitchMessage'; 

test('returns an object with "name", "outputFunction", "onCooldown", "options.cooldown_ms", and "options.modOnly" properties', () => {

    for (const command in commands) {
        expect(commands[command]).toHaveProperty('name');
        expect(commands[command]).toHaveProperty('outputFunction');
        expect(commands[command]).toHaveProperty('options');
        expect(commands[command]).toHaveProperty('onCooldown');
        expect(commands[command].options).toHaveProperty('cooldown_ms');
        expect(commands[command].options).toHaveProperty('modOnly');
    }

    [commands.edward, commands.bella].forEach(command => {
        expect(command.options).toHaveProperty('aliases');
    })

})

test('each property of the returned object holds the correct value', () => {
    expect(commands.shelby.name).toStrictEqual('shelby');
    expect(commands.shelby.outputFunction()).toStrictEqual('hi this is shelby');
    // default value before execution
    expect(commands.shelby.onCooldown).toStrictEqual(false);
    // default value
    expect(commands.shelby.options.cooldown_ms).toStrictEqual(10000);
    // default value
    expect(commands.shelby.options.modOnly).toStrictEqual(false);

    expect(commands.renee.name).toStrictEqual('renee');
    expect(commands.renee.outputFunction()).toStrictEqual('hi this is renee');
    expect(commands.renee.onCooldown).toStrictEqual(false);
    expect(commands.renee.options.cooldown_ms).toStrictEqual(500);
    expect(commands.renee.options.modOnly).toStrictEqual(false);

    expect(commands.esme.name).toStrictEqual('esme');
    expect(commands.esme.outputFunction()).toStrictEqual('hi this is esme');
    expect(commands.esme.onCooldown).toStrictEqual(false);
    expect(commands.esme.options.cooldown_ms).toStrictEqual(10000);
    expect(commands.esme.options.modOnly).toStrictEqual(true);

    expect(commands.jasper.name).toStrictEqual('jasper');
    expect(commands.jasper.outputFunction()).toStrictEqual('hi this is jasper');
    expect(commands.jasper.onCooldown).toStrictEqual(false);
    expect(commands.jasper.options.cooldown_ms).toStrictEqual(1500);
    expect(commands.jasper.options.modOnly).toStrictEqual(true);

    expect(commands.bella.name).toStrictEqual('bella');
    expect(commands.bella.outputFunction()).toStrictEqual('hi this is bella');
    expect(commands.bella.onCooldown).toStrictEqual(false);
    expect(commands.bella.options.cooldown_ms).toStrictEqual(10000);
    expect(commands.bella.options.modOnly).toStrictEqual(false);
    // single aliases should get placed in an array
    expect(commands.bella.options.aliases).toStrictEqual(['bellabie']);

    expect(commands.edward.name).toStrictEqual('edward');
    expect(commands.edward.outputFunction()).toStrictEqual('hi this is edward');
    expect(commands.edward.onCooldown).toStrictEqual(false);
    expect(commands.edward.options.cooldown_ms).toStrictEqual(10000);
    expect(commands.edward.options.modOnly).toStrictEqual(false);
    // multiple aliases
    expect(commands.edward.options.aliases).toStrictEqual(['edwina', 'eduardo']);
    
    const testMessage = new TwitchMessage('#tonichaelmight', {username: 'bexxters'}, '!forever edward bella', false);

    expect(commands.forever.name).toStrictEqual('forever');
    expect(commands.forever.outputFunction(testMessage)).toStrictEqual('bella edward forever');
    expect(commands.forever.onCooldown).toStrictEqual(false);
    expect(commands.forever.options.cooldown_ms).toStrictEqual(10000);
    expect(commands.forever.options.modOnly).toStrictEqual(false);
    expect(commands.forever.options.refsMessage).toStrictEqual(true);

    expect(commands.alice.name).toStrictEqual('alice');
    expect(commands.alice.outputFunction()).resolves.toStrictEqual('hi this is alice');
    expect(commands.alice.onCooldown).toStrictEqual(false);
    expect(commands.alice.options.cooldown_ms).toStrictEqual(10000);
    expect(commands.alice.options.modOnly).toStrictEqual(false);
    expect(commands.alice.options.refsMessage).toStrictEqual(false);
});

test('aliases build out correctly', () => {
    expect(commands.bellabie.name).toStrictEqual('bella');
    expect(commands.bellabie.outputFunction()).toStrictEqual('hi this is bella');
    expect(commands.bellabie.onCooldown).toStrictEqual(false);
    expect(commands.bellabie.options.cooldown_ms).toStrictEqual(10000);
    expect(commands.bellabie.options.modOnly).toStrictEqual(false);
    // single aliases should get placed in an array
    expect(commands.bellabie.options.aliases).toStrictEqual(['bellabie']);

    expect(commands.edwina.name).toStrictEqual('edward');
    expect(commands.edwina.outputFunction()).toStrictEqual('hi this is edward');
    expect(commands.edwina.onCooldown).toStrictEqual(false);
    expect(commands.edwina.options.cooldown_ms).toStrictEqual(10000);
    expect(commands.edwina.options.modOnly).toStrictEqual(false);
    // multiple aliases
    expect(commands.edwina.options.aliases).toStrictEqual(['edwina', 'eduardo']);

    expect(commands.eduardo.name).toStrictEqual('edward');
    expect(commands.eduardo.outputFunction()).toStrictEqual('hi this is edward');
    expect(commands.eduardo.onCooldown).toStrictEqual(false);
    expect(commands.eduardo.options.cooldown_ms).toStrictEqual(10000);
    expect(commands.eduardo.options.modOnly).toStrictEqual(false);
    // multiple aliases
    expect(commands.eduardo.options.aliases).toStrictEqual(['edwina', 'eduardo']);
});

// this will also need to go elsewhere I think

function wait(ms) {
    return new Promise((resolve, reject) => {
        const ref = setTimeout(() => {
            ref.unref();
            resolve(true);
        }, ms);
    })
}

test('createCooldown() creates a cooldown', async () => {
    expect(commands.renee.onCooldown).toStrictEqual(false);
    commands.renee.createCooldown();
    expect(commands.renee.onCooldown).toStrictEqual(true);
    await wait(commands.renee.options.cooldown_ms - 10);
    expect(commands.renee.onCooldown).toStrictEqual(true);
    await wait(15);
    expect(commands.renee.onCooldown).toStrictEqual(false);
})


test('execute() works', () => {
    const testMessage = new TwitchMessage('#tonichaelmight', {username: 'bexxters'}, '!shelby', false);
    commands.shelby.execute(testMessage);

    expect(testMessage).toHaveProperty('response');
    expect(testMessage.response[0]).toHaveProperty('output');
    expect(testMessage.response[0].output).toStrictEqual('hi this is shelby');
});

test('moderation is effective', () => {
    const testMessage1 = new TwitchMessage('#tonichaelmight', {username: 'bexxters'}, '!esme', false);
    const testMessage2 = new TwitchMessage('#tonichaelmight', {username: 'bexxters', mod: true}, '!esme', false);
    const testMessage3 = new TwitchMessage('#tonichaelmight', {username: 'bexxters', badges: {vip: 1}}, '!esme', false);
    // command is mod-only so nothing should happen here
    commands.esme.execute(testMessage1);
    expect(testMessage1).not.toHaveProperty('response');
    // testMessage2 was sent by a mod, so a response should be added
    commands.esme.execute(testMessage2);
    expect(testMessage2).toHaveProperty('response');
    expect(testMessage2.response).toHaveLength(1);
    expect(testMessage2.response[0].output).toStrictEqual('hi this is esme');
    // vip should do nothing
    commands.esme.execute(testMessage3);
    expect(testMessage3).not.toHaveProperty('response');
});

test('createCooldown() is effective in execution', () => {
    const testMessage1 = new TwitchMessage('#tonichaelmight', {username: 'bexxters'}, '!bella', false);
    const testMessage2 = new TwitchMessage('#tonichaelmight', {username: 'bexxters', mod: true}, '!bella', false);
    const testMessage3 = new TwitchMessage('#tonichaelmight', {username: 'theninjamdm', badges: {vip: '1'}}, '!bella', false);
    
    expect(commands.bella.onCooldown).toStrictEqual(false);
    commands.bella.execute(testMessage1);
    expect(testMessage1).toHaveProperty('response');
    expect(testMessage1.response).toHaveLength(1);
    expect(commands.bella.onCooldown).toStrictEqual(true);
    commands.bella.execute(testMessage1);
    // should not add a message since the command is on cooldown
    expect(testMessage1.response).toHaveLength(1);

    commands.bella.execute(testMessage2);
    expect(testMessage2.response).toHaveLength(1);
    commands.bella.execute(testMessage2);
    expect(testMessage2.response).toHaveLength(2);

    // VIP is subject to cooldowns
    commands.bella.execute(testMessage3);
    expect(testMessage3.response).toStrictEqual(undefined);
});

