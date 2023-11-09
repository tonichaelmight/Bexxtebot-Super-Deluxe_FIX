import { assert } from "chai";
import bexxteFake from "./bexxtebot.test";
import TwitchMessage from "../classes/TwitchMessage";
import { wait } from "../util";

test('bot properties come out with correct values', () => {
    assert.strictEqual(bexxteFake.name, 'bexxteFake');
    assert.strictEqual(bexxteFake.channel, 'tonichaelmight');

    // don't want to actually code in the real values here
    // assert.strictEqual(bexxteFake.token, 12345);
    // assert.strictEqual(bexxteFake.clientID, 67890);
    
});


// no way to test establishTwitchClient()
test('successfully connects to twitch', async () => {
    await bexxteFake.establishTwitchClient();
    await wait(1000);
    await bexxteFake.twitchClient.disconnect();
    delete bexxteFake.twitchClient
    assert.isOk(true);
})

// moderateTwitchMessage()
test('bot-level moderation is effective', () => {
    const testMessage1 = new TwitchMessage('#tonichaelmight', { username: 'bexxters', mod: false }, 'reylo', false);
    const testMessage2 = new TwitchMessage('#tonichaelmight', { username: 'bexxters', mod: true }, 'reylo', false);
    
    bexxteFake.moderateTwitchMessage(testMessage1);
    assert.property(testMessage1, 'response')
    assert.strictEqual(testMessage1.response[0].output, 'Naughty naughty, @bexxters! We don\'t use that word here!');
    assert.strictEqual(testMessage1.response[0].mean, true);
    
    // mods should not be modded
    bexxteFake.moderateTwitchMessage(testMessage2);
    assert.notProperty(testMessage2, 'response');
})

// searchForTwitchCommand
test('searching messages for a command yields the anticipated result', () => {
    const testMessage1 = new TwitchMessage('#tonichaelmight', { username: 'bexxters' }, '!command', false);
    const testMessage2 = new TwitchMessage('#tonichaelmight', { username: 'bexxters' }, '!shelby', false);
    const testMessage3 = new TwitchMessage('#tonichaelmight', { username: 'bexxters' }, 'bye youse guyse gonna !lurk', false);
    const testMessage4 = new TwitchMessage('#tonichaelmight', { username: 'bexxters' }, 'have you met !bella', false);
    const testMessage5 = new TwitchMessage('#tonichaelmight', { username: 'bexxters' }, 'ahahah', false);

    assert.strictEqual(bexxteFake.searchForTwitchCommand(testMessage1), 'command');
    assert.strictEqual(bexxteFake.searchForTwitchCommand(testMessage2), 'shelby');
    assert.strictEqual(bexxteFake.searchForTwitchCommand(testMessage3), 'lurk');
    assert.isUndefined(bexxteFake.searchForTwitchCommand(testMessage4));
    assert.isUndefined(bexxteFake.searchForTwitchCommand(testMessage5));
})

// executeTwitchCommand
test('executing commands works correctly', () => {
    const testMessage1 = new TwitchMessage('#tonichaelmight', { username: 'bexxters' }, '!shelby', false);
    const testMessage2 = new TwitchMessage('#tonichaelmight', { username: 'bexxters' }, '!bob', false);
    bexxteFake.executeTwitchCommand(testMessage1, 'shelby');

    assert.property(testMessage1, 'response');
    assert.property(testMessage1.response[0], 'output');
    assert.strictEqual(testMessage1.response[0].output, 'hi this is shelby');

    bexxteFake.executeTwitchCommand(testMessage2, 'bob');

    assert.notProperty(testMessage2, 'response');
})

// speakInTwitch() cannot be tested

// process twitch message probably can't

// start timers likely can't either

// and i doubt run can as well