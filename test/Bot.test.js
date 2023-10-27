import { assert } from "chai";
import bexxteFake from "./bexxtebot.test";

test('bot properties come out with correct values', () => {
    assert.strictEqual(bexxteFake.name, 'bexxteFake');
    assert.strictEqual(bexxteFake.channel, 'tonichaelmight');
    assert.strictEqual(bexxteFake.token, 12345);
    assert.strictEqual(bexxteFake.clientID, 67890);
    
});


// not sure if there's a way to test actually connecting to Twitch

// moderation is doable for sure

// command search is probalby doable

// execute command is a solid maybe

// speak in twitch probably can't be tested

// process twitch message probably can't

// start timers likely can't either

// and i doubt run can as well