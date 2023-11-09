import { assert } from "chai";
import bexxteFake from "./bexxtebot.test";
import TwitchMessage from "../classes/TwitchMessage";

test('bot properties come out with correct values', () => {
    assert.strictEqual(bexxteFake.name, 'bexxteFake');
    assert.strictEqual(bexxteFake.channel, 'tonichaelmight');
    assert.strictEqual(bexxteFake.token, 12345);
    assert.strictEqual(bexxteFake.clientID, 67890);
    
});


// not sure if there's a way to test actually connecting to Twitch

// moderation is doable for sure
const testMessage1 = new TwitchMessage('#tonichaelmight', { username: 'bexxters', mod: false }, 'reylo', false);
const testMessage2 = new TwitchMessage('#tonichaelmight', { username: 'bexxters', mod: true }, 'reylo', false);

bexxteFake.moderateTwitchMessage(testMessage1);
assert.property(testMessage1, 'response')
assert.strictEqual(testMessage1.response[0].output, 'Naughty naughty, @bexxters! We don\'t use that word here!');

// mode should not be modded
bexxteFake.moderateTwitchMessage(testMessage2);
assert.notProperty(testMessage2, 'response')

// command search is probalby doable

// execute command is a solid maybe

// speak in twitch probably can't be tested

// process twitch message probably can't

// start timers likely can't either

// and i doubt run can as well