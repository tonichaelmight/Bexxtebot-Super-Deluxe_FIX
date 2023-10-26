// here, things that are internal to the class can be tested here
// but portions relying on the bot being built out should be moved into bexxtebot.test.js

import bexxteFake from './bexxtebot.test.js';
const { commands } = bexxteFake.streamer;

import TwitchMessage from '../classes/TwitchMessage';
import { assert } from 'chai';

test('returns an object with "name", "outputFunction", "onCooldown", "options.cooldown_ms", and "options.modOnly" properties', () => {

    for (const command in commands) {
        assert.property(commands[command], 'name');
        assert.property(commands[command], 'outputFunction');
        assert.property(commands[command], 'options');
        assert.property(commands[command], 'onCooldown');
        assert.property(commands[command].options, 'cooldown_ms');
        assert.property(commands[command].options, 'modOnly');
    }

    [commands.edward, commands.bella, commands.jacob].forEach(command => {
        assert.property(command.options, 'aliases');
    });

    assert.property(commands.jacob, 'outputs');

});

test('each property of the returned object holds the correct value', async () => {
    assert.strictEqual(commands.shelby.name, 'shelby');
    assert.strictEqual(commands.shelby.outputFunction(), 'hi this is shelby');
    // default value before execution
    assert.isFalse(commands.shelby.onCooldown);
    // default value
    assert.strictEqual(commands.shelby.options.cooldown_ms, 10000);
    // default value
    assert.isFalse(commands.shelby.options.modOnly);

    assert.strictEqual(commands.renee.name, 'renee');
    assert.strictEqual(commands.renee.outputFunction(), 'hi this is renee');
    assert.isFalse(commands.renee.onCooldown);
    assert.strictEqual(commands.renee.options.cooldown_ms, 500);
    assert.isFalse(commands.renee.options.modOnly);

    assert.strictEqual(commands.esme.name, 'esme');
    assert.strictEqual(commands.esme.outputFunction(), 'hi this is esme');
    assert.isFalse(commands.esme.onCooldown);
    assert.strictEqual(commands.esme.options.cooldown_ms, 10000);
    assert.isTrue(commands.esme.options.modOnly);

    assert.strictEqual(commands.jasper.name, 'jasper');
    assert.strictEqual(commands.jasper.outputFunction(), 'hi this is jasper');
    assert.isFalse(commands.jasper.onCooldown);
    assert.strictEqual(commands.jasper.options.cooldown_ms, 1500);
    assert.isTrue(commands.jasper.options.modOnly);

    assert.strictEqual(commands.bella.name, 'bella');
    assert.strictEqual(commands.bella.outputFunction(), 'hi this is bella');
    assert.isFalse(commands.bella.onCooldown);
    assert.strictEqual(commands.bella.options.cooldown_ms, 10000);
    assert.isFalse(commands.bella.options.modOnly);
    // single aliases should get placed in an array
    assert.deepEqual(commands.bella.options.aliases, ['bellabie']);

    assert.strictEqual(commands.edward.name, 'edward');
    assert.strictEqual(commands.edward.outputFunction(), 'hi this is edward');
    assert.isFalse(commands.edward.onCooldown);
    assert.strictEqual(commands.edward.options.cooldown_ms, 10000);
    assert.isFalse(commands.edward.options.modOnly);
    // multiple aliases
    assert.deepEqual(commands.edward.options.aliases, ['edwina', 'eduardo']);

    const testMessage = new TwitchMessage('#tonichaelmight', { username: 'bexxters' }, '!forever edward bella', false);

    assert.strictEqual(commands.forever.name, 'forever');
    assert.strictEqual(commands.forever.outputFunction(testMessage), 'bella edward forever');
    assert.isFalse(commands.forever.onCooldown);
    assert.strictEqual(commands.forever.options.cooldown_ms, 10000);
    assert.isFalse(commands.forever.options.modOnly);
    assert.isTrue(commands.forever.options.refsMessage);

    assert.strictEqual(commands.alice.name, 'alice');
    assert.strictEqual(await commands.alice.outputFunction(), 'hi this is alice');
    assert.isFalse(commands.alice.onCooldown);
    assert.strictEqual(commands.alice.options.cooldown_ms, 10000);
    assert.isFalse(commands.alice.options.modOnly);
    assert.isFalse(commands.alice.options.refsMessage);
    
    assert.strictEqual(commands.jacob.name, 'jacob');
    assert.isUndefined(commands.jacob.outputFunction());
    assert.isFalse(commands.jacob.onCooldown);
    assert.strictEqual(commands.jacob.options.cooldown_ms, 10000);
    assert.isFalse(commands.jacob.options.modOnly);
    assert.isFalse(commands.jacob.options.refsMessage);
    assert.deepEqual(commands.jacob.options.aliases, ['jacobs']);
    
});

test('aliases build out correctly', () => {
    assert.strictEqual(commands.bellabie.name, 'bella');
    assert.strictEqual(commands.bellabie.outputFunction(), 'hi this is bella');
    assert.isFalse(commands.bellabie.onCooldown);
    assert.strictEqual(commands.bellabie.options.cooldown_ms, 10000);
    assert.isFalse(commands.bellabie.options.modOnly);
    // single aliases should get placed in an array
    assert.deepEqual(commands.bellabie.options.aliases, ['bellabie']);

    assert.strictEqual(commands.eduardo.name, 'edward');
    assert.strictEqual(commands.eduardo.outputFunction(), 'hi this is edward');
    assert.isFalse(commands.eduardo.onCooldown);
    assert.strictEqual(commands.eduardo.options.cooldown_ms, 10000);
    assert.isFalse(commands.eduardo.options.modOnly);
    // multiple aliases
    assert.deepEqual(commands.eduardo.options.aliases, ['edwina', 'eduardo']);

    assert.strictEqual(commands.eduardo.name, 'edward');
    assert.strictEqual(commands.eduardo.outputFunction(), 'hi this is edward');
    assert.isFalse(commands.eduardo.onCooldown);
    assert.strictEqual(commands.eduardo.options.cooldown_ms, 10000);
    assert.isFalse(commands.eduardo.options.modOnly);
    // multiple aliases
    assert.deepEqual(commands.eduardo.options.aliases, ['edwina', 'eduardo']);

    assert.strictEqual(commands.jacobs.name, 'jacob');
    assert.isUndefined(commands.jacobs.outputFunction());
    assert.isFalse(commands.jacobs.onCooldown);
    assert.strictEqual(commands.jacobs.options.cooldown_ms, 10000);
    assert.isFalse(commands.jacobs.options.modOnly);
    assert.isFalse(commands.jacobs.options.refsMessage);
    assert.deepEqual(commands.jacobs.options.aliases, ['jacobs']);
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


test('execute() works', async () => {
    const testMessage = new TwitchMessage('#tonichaelmight', { username: 'bexxters' }, '!shelby', false);
    commands.shelby.execute(testMessage);

    expect(testMessage).toHaveProperty('response');
    expect(testMessage.response[0]).toHaveProperty('output');
    expect(testMessage.response[0].output).toStrictEqual('hi this is shelby');

    const testMessage2 = new TwitchMessage('#tonichaelmight', { username: 'bexxters' }, '!alice', false);
    commands.alice.execute(testMessage2);

    // async function
    await wait(550);
    expect(testMessage2).toHaveProperty('response');
    expect(testMessage2.response[0]).toHaveProperty('output');
    expect(testMessage2.response[0].output).toStrictEqual('hi this is alice');
});

test('moderation is effective', () => {
    const testMessage1 = new TwitchMessage('#tonichaelmight', { username: 'bexxters' }, '!esme', false);
    const testMessage2 = new TwitchMessage('#tonichaelmight', { username: 'bexxters', mod: true }, '!esme', false);
    const testMessage3 = new TwitchMessage('#tonichaelmight', { username: 'bexxters', badges: { vip: 1 } }, '!esme', false);
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
    const testMessage1 = new TwitchMessage('#tonichaelmight', { username: 'bexxters' }, '!bella', false);
    const testMessage2 = new TwitchMessage('#tonichaelmight', { username: 'bexxters', mod: true }, '!bella', false);
    const testMessage3 = new TwitchMessage('#tonichaelmight', { username: 'theninjamdm', badges: { vip: '1' } }, '!bella', false);

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

