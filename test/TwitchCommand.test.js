import { TwitchCommand } from "../classes/TwitchCommand";

const tc1 = new TwitchCommand('shelby', 'hi this is shelby');
const tc2 = new TwitchCommand('renee', 'hi this is renee', {cooldown_ms: 500})
const tc3 = new TwitchCommand('esme', 'hi this is esme', {modOnly: true})
const tc4 = new TwitchCommand('jasper', 'hi this is jasper', {modOnly: true, cooldown_ms: 1500})

const tc5 = new TwitchCommand('bella', 'hi this is bella', {aliases: 'bellabie'});
const tc6 = new TwitchCommand('edward', 'hi this is edward', {aliases: ['edwina', 'eduardo']})

test('returns an object with "name", "commandText", "options.cooldown_ms", and "options.modOnly" properties', () => {
    const tcs = [tc1, tc2, tc3, tc4, tc5, tc6]

    tcs.forEach(tc => {
        expect(tc).toHaveProperty('name');
        expect(tc).toHaveProperty('commandText');
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
    expect(tc1.commandText).toStrictEqual('hi this is shelby');
    expect(tc1.onCooldown).toStrictEqual(false);
    expect(tc1.options.cooldown_ms).toStrictEqual(10000);
    expect(tc1.options.modOnly).toStrictEqual(false);

    expect(tc2.name).toStrictEqual('renee');
    expect(tc2.commandText).toStrictEqual('hi this is renee');
    expect(tc2.onCooldown).toStrictEqual(false);
    expect(tc2.options.cooldown_ms).toStrictEqual(500);
    expect(tc2.options.modOnly).toStrictEqual(false);

    expect(tc3.name).toStrictEqual('esme');
    expect(tc3.commandText).toStrictEqual('hi this is esme');
    expect(tc3.onCooldown).toStrictEqual(false);
    expect(tc3.options.cooldown_ms).toStrictEqual(10000);
    expect(tc3.options.modOnly).toStrictEqual(true);

    expect(tc4.name).toStrictEqual('jasper');
    expect(tc4.commandText).toStrictEqual('hi this is jasper');
    expect(tc4.onCooldown).toStrictEqual(false);
    expect(tc4.options.cooldown_ms).toStrictEqual(1500);
    expect(tc4.options.modOnly).toStrictEqual(true);

    expect(tc5.name).toStrictEqual('bella');
    expect(tc5.commandText).toStrictEqual('hi this is bella');
    expect(tc5.onCooldown).toStrictEqual(false);
    expect(tc5.options.cooldown_ms).toStrictEqual(10000);
    expect(tc5.options.modOnly).toStrictEqual(false);
    expect(tc5.options.aliases).toStrictEqual(['bellabie']);

    expect(tc6.name).toStrictEqual('edward');
    expect(tc6.commandText).toStrictEqual('hi this is edward');
    expect(tc6.onCooldown).toStrictEqual(false);
    expect(tc6.options.cooldown_ms).toStrictEqual(10000);
    expect(tc6.options.modOnly).toStrictEqual(false);
    expect(tc6.options.aliases).toStrictEqual(['edwina', 'eduardo']);
})

test('createCooldown() creates a cooldown', async () => {
    expect(tc2.onCooldown).toStrictEqual(false);
    tc2.createCooldown();
    expect(tc2.onCooldown).toStrictEqual(true);
    const beforeTimeout = setTimeout(() => {
        expect(tc2.onCooldown).toStrictEqual(true);
        beforeTimeout.unref();
    }, tc2.options.cooldown_ms - 10)
    const afterTimeout = setTimeout(() => {
        expect(tc2.onCooldown).toStrictEqual(false);
        afterTimeout.unref();
    }, tc2.options.cooldown_ms + 10);
})

import TwitchMessage from '../classes/TwitchMessage';

test('execute() works', () => {
    const message1 = new TwitchMessage('#tonichaelmight', {username: 'bexxters'}, '!shelby', false);
    tc1.execute(message1)
    expect(message1).toHaveProperty('response');
})