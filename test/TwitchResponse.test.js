import { assert } from "chai";
import TwitchResponse from "../classes/TwitchResponse";

const twitchResponse1 = new TwitchResponse('hi');
const twitchResponse2 = new TwitchResponse('hey', true);

test('returns an object with "output" and "mean" prperties', () => {
    assert.property(twitchResponse1, 'output');
    assert.property(twitchResponse1, 'mean');
    
    assert.property(twitchResponse2, 'output');
    assert.property(twitchResponse2, 'mean');
})

test('each property of the returned object holds the correct value', () => {
    assert.strictEqual(twitchResponse1.output, 'hi');
    assert.isFalse(twitchResponse1.mean);
    
    assert.strictEqual(twitchResponse2.output, 'hey');
    assert.isTrue(twitchResponse2.mean);
})
