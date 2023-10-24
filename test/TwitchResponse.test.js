// I think the stuff here makes sense where it is
// this class is self contained, so it's not dependent on anything else being linked correctly
// in fact, I think it would be more difficult to make assertions for this within the context
// of the whole bot

import TwitchResponse from "../classes/TwitchResponse";

const twitchResponse1 = new TwitchResponse('hi');
const twitchResponse2 = new TwitchResponse('hey', true);

test('returns an object with "output" and "mean" prperties', () => {
    expect(twitchResponse1).toHaveProperty('output');
    expect(twitchResponse1).toHaveProperty('mean');
    
    expect(twitchResponse2).toHaveProperty('output');
    expect(twitchResponse2).toHaveProperty('mean');
})

test('each property of the returned object holds the correct value', () => {
    expect(twitchResponse1.output).toStrictEqual('hi');
    expect(twitchResponse1.mean).toStrictEqual(false);
    
    expect(twitchResponse2.output).toStrictEqual('hey');
    expect(twitchResponse2.mean).toStrictEqual(true);
})
