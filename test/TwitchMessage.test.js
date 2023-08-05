import TwitchMessage from '../classes/TwitchMessage';

const testMessage1 = new TwitchMessage('#bexxtebot', {username: 'tonichaelmight', mod: true}, 'hi');
const testMessage2 = new TwitchMessage('#bexxtebot', {username: 'tonichaelmight', mod: false}, 'hello', false);
const testMessage3 = new TwitchMessage('#bexxtebot', {username: 'bexxtebot', mod: false}, 'hey');
const testMessage4 = new TwitchMessage('#bexxtebot', {username: 'theninjamdm', badges: {vip: '1'}}, 'ahlan')

test('returns an object with "channel", "tags", "content", and "self" properties', () => {
    const messages = [testMessage1, testMessage2, testMessage3, testMessage4];

    messages.forEach(message => {
        expect(message).toHaveProperty('channel');
        expect(message).toHaveProperty('tags');
        expect(message).toHaveProperty('content');
        expect(message).toHaveProperty('self');
    });
});

test('each property of the returned object holds the correct value', () => {
    expect(testMessage1.channel).toStrictEqual('#bexxtebot');
    expect(testMessage1.tags).toStrictEqual({username: 'tonichaelmight', mod: true});
    expect(testMessage1.content).toStrictEqual('hi');
    // value not passed to the constructor, so asserts against tags.username
    // bexxtebot didn't send the message, so self should be false
    expect(testMessage1.self).toStrictEqual(false);
    
    expect(testMessage2.channel).toStrictEqual('#bexxtebot');
    expect(testMessage2.tags).toStrictEqual({username: 'tonichaelmight', mod: false});
    expect(testMessage2.content).toStrictEqual('hello');
    // passed directly in the constructor
    expect(testMessage2.self).toStrictEqual(false);

    expect(testMessage3.channel).toStrictEqual('#bexxtebot');
    expect(testMessage3.tags).toStrictEqual({username: 'bexxtebot', mod: false});
    expect(testMessage3.content).toStrictEqual('hey');
    // value not passed to the constructor, so asserts against tags.username
    // bexxtebot did send the message, so self should be true
    expect(testMessage3.self).toStrictEqual(true);
    
    expect(testMessage4.channel).toStrictEqual('#bexxtebot');
    expect(testMessage4.tags).toStrictEqual({username: 'theninjamdm', badges: {vip: '1'}});
    expect(testMessage4.content).toStrictEqual('ahlan');
    // value not passed to the constructor, so asserts against tags.username
    // bexxtebot didn't send the message, so self should be false
    expect(testMessage4.self).toStrictEqual(false);
});

test('tags messages for moderation appropriately', () => {
    // mod = true
    expect(testMessage1.needsModeration()).toBe(false);
    // mod = false
    expect(testMessage2.needsModeration()).toBe(true);
    // bexxtebot
    expect(testMessage3.needsModeration()).toBe(false);
    // vip
    expect(testMessage4.needsModeration()).toBe(false);
});

test('adds responses correctly', () => {
    testMessage1.addResponse('hey girl');
    // response should be an array with one item
    expect(testMessage1.response).toBeDefined();
    expect(Array.isArray(testMessage1.response)).toBe(true);
    expect(testMessage1.response.length).toEqual(1);
    expect(testMessage1.response[0].output).toEqual('hey girl')
    // mean is false by default
    expect(testMessage1.response[0].mean).toEqual(false)
    
    testMessage1.addResponse('hey girl', true);
    expect(testMessage1.response.length).toEqual(2);
    expect(testMessage1.response[1].mean).toEqual(true)


    testMessage2.addResponse(['ni hao', 'zdravstvooytye', 'czesc']);
    expect(testMessage2.response).toBeDefined();
    expect(testMessage2.response.length).toEqual(3);
    expect(testMessage2.response[2].output).toEqual('czesc');
}) 

test('creates dummy messages correctly', () => {
    const dummy1 = TwitchMessage.generateDummyMessage('#bexxtebot');
    expect(dummy1.channel).toBeDefined();
    expect(dummy1.channel).toEqual('#bexxtebot');
    expect(dummy1.tags).toBeDefined();
    expect(dummy1.tags).toStrictEqual({ mod: true, username: '' });
    expect(dummy1.content).toBeDefined();
    expect(dummy1.content).toEqual('');
    expect(dummy1.self).toBeDefined();
    expect(dummy1.self).toBe(false);
    
    const dummy2 = TwitchMessage.generateDummyMessage('#bexxtebot', '!whomst');
    expect(dummy2.channel).toBeDefined();
    expect(dummy2.channel).toEqual('#bexxtebot');
    expect(dummy2.tags).toBeDefined();
    expect(dummy2.tags).toStrictEqual({ mod: true, username: '' });
    expect(dummy2.content).toBeDefined();
    expect(dummy2.content).toEqual('!whomst');
    expect(dummy2.self).toBeDefined();
    expect(dummy2.self).toBe(false);
});
