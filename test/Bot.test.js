import { AssertionError, assert } from "chai";
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


// establishTwitchClient()
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

// searchForTwitchCommand()
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

// executeTwitchCommand()
test('executing commands works correctly', async () => {
    const testMessage1 = new TwitchMessage('#tonichaelmight', { username: 'bexxters' }, '!shelby', false);
    const testMessage2 = new TwitchMessage('#tonichaelmight', { username: 'bexxters' }, '!bob', false);
    await bexxteFake.executeTwitchCommand(testMessage1, 'shelby');

    assert.property(testMessage1, 'response');
    assert.property(testMessage1.response[0], 'output');
    assert.strictEqual(testMessage1.response[0].output, 'hi this is shelby');

    await bexxteFake.executeTwitchCommand(testMessage2, 'bob');

    // not a real command
    assert.notProperty(testMessage2, 'response');
})

// speakInTwitch() 
// not sure if there's a way to test this
// unless you could somehow check messages that follow
// to see if one has the correct output
// which is actually probably doable
test('speaking in twitch chat is successful', async () => {
    await bexxteFake.establishTwitchClient();

    const testMessage1 = new TwitchMessage('#tonichaelmight', { username: 'bexxters', mod: true }, '!shelby', false);
    await bexxteFake.executeTwitchCommand(testMessage1, 'shelby');
    console.log(testMessage1);

    bexxteFake.searching = true;
    bexxteFake.searchCriteria = testMessage1.response[0].output;
    bexxteFake.found = false;

    let tries = 0;

    const foundPromise = () => {
        return new Promise((res, rej) => {
            const intervalID = setInterval(async () => {
                if (bexxteFake.found) {
                    const result = Object.assign({}, bexxteFake.found);
                    bexxteFake.searching = false;
                    bexxteFake.searchCriteria = undefined;
                    bexxteFake.found = undefined;
                    clearInterval(intervalID);
                    await bexxteFake.twitchClient.disconnect();
                    delete bexxteFake.twitchClient;
                    res(result);
                } else {
                    tries++;
                }

                if (tries >= 20) rej(false);
            }, 200);
        })
    };

    bexxteFake.speakInTwitch(testMessage1);

    try {
        const foundMessage = await foundPromise();
        assert.isTrue(foundMessage.self);
        assert.strictEqual(foundMessage.content, 'hi this is shelby');
    } catch(e) {
        if (e instanceof AssertionError) throw e;
        throw new Error('bexxtebot did not speak the expected message in twitch');
    }


    await wait(1000);

   
}, 5000)

// processTwitchMessage()
// assuming speakInTwitch() can be tested, this should also be doable

// startTimers()
// seems like it would be tricky to pull off but we'll see!

// run()
// again would be tricky
// I'm not sure how the .on('message') handler could be invoked
// without a message being sent in the twitch chat
// unless that could somehow be intercepted
// will have to see!