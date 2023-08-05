import { TwitchCommand } from "../classes/TwitchCommand";

const tc1 = new TwitchCommand('shelby', 'hi this is shelby');
const tc2 = new TwitchCommand('renee', 'hi this is renee', {cooldown_ms: 5000})
const tc3 = new TwitchCommand('esme', 'hi this is esme', {modOnly: true})
const tc4 = new TwitchCommand('jasper', 'hi this is jasper', {modOnly: true, cooldown_ms: 1500})

test('returns an object with "name", "commandText", "options.cooldown_ms", and "options.modOnly" properties', () => {
    const tcs = [tc1, tc2, tc3, tc4]

    tcs.forEach(tc => {
        expect(tc).toHaveProperty('name');
        expect(tc).toHaveProperty('commandText');
        expect(tc).toHaveProperty('options');
        expect(tc.options).toHaveProperty('cooldown_ms');
        expect(tc.options).toHaveProperty('modOnly');
    })
})

test('each property of the returned object holds the correct value', () => {
    expect(tc1.name).toStrictEqual('shelby');
    expect(tc1.commandText).toStrictEqual('hi this is shelby');
    expect(tc1.options.cooldown_ms).toStrictEqual(10000);
    expect(tc1.options.modOnly).toStrictEqual(false);

    expect(tc2.name).toStrictEqual('renee');
    expect(tc2.commandText).toStrictEqual('hi this is renee');
    expect(tc2.options.cooldown_ms).toStrictEqual(5000);
    expect(tc2.options.modOnly).toStrictEqual(false);

    expect(tc3.name).toStrictEqual('esme');
    expect(tc3.commandText).toStrictEqual('hi this is esme');
    expect(tc3.options.cooldown_ms).toStrictEqual(10000);
    expect(tc3.options.modOnly).toStrictEqual(true);

    expect(tc4.name).toStrictEqual('jasper');
    expect(tc4.commandText).toStrictEqual('hi this is jasper');
    expect(tc4.options.cooldown_ms).toStrictEqual(1500);
    expect(tc4.options.modOnly).toStrictEqual(true);
})