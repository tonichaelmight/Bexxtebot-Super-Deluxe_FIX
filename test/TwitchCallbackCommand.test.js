import { TwitchCallbackCommand } from "../classes/TwitchCommand";

const tcc1 = new TwitchCallbackCommand('shelby', () => 'hi this is shelby');

test('returns an object with "name", "callback", "onCooldown", "options.cooldown_ms", "options.modOnly", and "options.refsMessage" properties', () => {
    expect(tcc1).toHaveProperty('name');
    expect(tcc1).toHaveProperty('callback');
    expect(tcc1).toHaveProperty('options');
    expect(tcc1).toHaveProperty('onCooldown');
    expect(tcc1.options).toHaveProperty('cooldown_ms');
    expect(tcc1.options).toHaveProperty('modOnly');
    expect(tcc1.options).toHaveProperty('refsMessage');
})