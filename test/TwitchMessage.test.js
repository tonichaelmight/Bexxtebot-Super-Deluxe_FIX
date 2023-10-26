// similar to TwitchResponse, I think all of this is fine to stay here
import TwitchMessage from '../classes/TwitchMessage';

import { assert } from 'chai';

const testMessage1 = new TwitchMessage('#bexxtebot', {username: 'tonichaelmight', mod: true}, 'hi');
const testMessage2 = new TwitchMessage('#bexxtebot', {username: 'tonichaelmight', mod: false}, 'hello', false);
const testMessage3 = new TwitchMessage('#bexxtebot', {username: 'bexxtebot', mod: false}, 'hey');
const testMessage4 = new TwitchMessage('#bexxtebot', {username: 'theninjamdm', badges: {vip: '1'}}, 'ahlan')

test('returns an object with "channel", "tags", "content", and "self" properties', () => {
    const messages = [testMessage1, testMessage2, testMessage3, testMessage4];

    messages.forEach(message => {
        assert.property(message, 'channel');
        assert.property(message, 'tags');
        assert.property(message, 'content');
        assert.property(message, 'self');
    });
});

test('each property of the returned object holds the correct value', () => {
    assert.strictEqual(testMessage1.channel, '#bexxtebot');
    assert.deepEqual(testMessage1.tags, {username: 'tonichaelmight', mod: true});
    assert.strictEqual(testMessage1.content, 'hi');
    // value not passed to the constructor, so asserts against tags.username
    // bexxtebot didn't send the message, so self should be false
    assert.isFalse(testMessage1.self);
    
    assert.strictEqual(testMessage2.channel, '#bexxtebot');
    assert.deepEqual(testMessage2.tags, {username: 'tonichaelmight', mod: false});
    assert.strictEqual(testMessage2.content, 'hello');
    // passed directly in the constructor
    assert.isFalse(testMessage2.self);
    
    assert.strictEqual(testMessage3.channel, '#bexxtebot');
    assert.deepEqual(testMessage3.tags, {username: 'bexxtebot', mod: false});
    assert.strictEqual(testMessage3.content, 'hey');
    // value not passed to the constructor, so asserts against tags.username
    // bexxtebot did send the message, so self should be true
    assert.isTrue(testMessage3.self);
    
    assert.strictEqual(testMessage4.channel, '#bexxtebot');
    assert.deepEqual(testMessage4.tags, {username: 'theninjamdm', badges: {vip: '1'}});
    assert.strictEqual(testMessage4.content, 'ahlan');
    // value not passed to the constructor, so asserts against tags.username
    // bexxtebot did send the message, so self should be true
    assert.isFalse(testMessage4.self);
});

test('tags messages for moderation appropriately', () => {
    // mod = true
    assert.isFalse(testMessage1.needsModeration());
    // mod = false
    assert.isTrue(testMessage2.needsModeration());
    // bexxtebot
    assert.isFalse(testMessage3.needsModeration());
    // vip
    assert.isFalse(testMessage4.needsModeration());
});

test('adds responses correctly', () => {
    testMessage1.addResponse('hey girl');
    // response should be an array with one item
    assert.isDefined(testMessage1.response);
    assert(Array.isArray(testMessage1.response));
    assert.lengthOf(testMessage1.response, 1);
    assert.strictEqual(testMessage1.response[0].output, 'hey girl');
    // mean is false by default
    assert.isFalse(testMessage1.response[0].mean);
    
    testMessage1.addResponse('hey girl', true);
    assert.lengthOf(testMessage1.response, 2);
    assert.isTrue(testMessage1.response[1].mean);

    // adding multiple responses as an array
    testMessage2.addResponse(['ni hao', 'zdravstvooytye', 'czesc']);
    assert.isDefined(testMessage2.response);
    assert.lengthOf(testMessage2.response, 3);
    assert.strictEqual(testMessage2.response[2].output, 'czesc');
}) 

test('creates dummy messages correctly', () => {
    const dummy1 = TwitchMessage.generateDummyMessage('#bexxtebot');
    assert.isDefined(dummy1.channel);
    assert.strictEqual(dummy1.channel, '#bexxtebot');
    assert.isDefined(dummy1.tags);
    assert.deepEqual(dummy1.tags, { mod: true, username: '' });
    assert.isDefined(dummy1.content);
    assert.strictEqual(dummy1.content, '');
    assert.isDefined(dummy1.self);
    assert.isFalse(dummy1.self);
    
    const dummy2 = TwitchMessage.generateDummyMessage('#bexxtebot', '!whomst');
    assert.isDefined(dummy2.channel);
    assert.strictEqual(dummy2.channel, '#bexxtebot');
    assert.isDefined(dummy2.tags);
    assert.deepEqual(dummy2.tags, { mod: true, username: '' });
    assert.isDefined(dummy2.content);
    assert.strictEqual(dummy2.content, '!whomst');
    assert.isDefined(dummy2.self);
    assert.isFalse(dummy2.self);
});
