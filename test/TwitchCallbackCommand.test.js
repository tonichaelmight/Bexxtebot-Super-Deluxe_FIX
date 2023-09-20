// import { TwitchCallbackCommand } from "../classes/TwitchCommand";
// import TwitchMessage from "../classes/TwitchMessage";

// const tcc1 = new TwitchCallbackCommand('shelby', () => 'hi this is shelby');
// const tcc2 = new TwitchCallbackCommand('esme', () => 'hi this is esme', {modOnly: true, cooldown_ms: 500});
// const tcc3 = new TwitchCallbackCommand('bella', (messageObject) => {
//     const args = messageObject.content.split(' ').slice(1);
//     const arg1 = args[0];
//     const arg2 = args[1];
//     return `bella ${arg2} ${arg1}`;
// }, {refsMessage: true});

// test('returns an object with "name", "callback", "onCooldown", "options.cooldown_ms", "options.modOnly", and "options.refsMessage" properties. Deletes the "commandText" property', () => {

//     [tcc1, tcc2, tcc3].forEach(tcc => {
//         expect(tcc).toHaveProperty('name');
//         expect(tcc).toHaveProperty('callback');
//         expect(tcc).toHaveProperty('options');
//         expect(tcc).toHaveProperty('onCooldown');
//         expect(tcc.options).toHaveProperty('cooldown_ms');
//         expect(tcc.options).toHaveProperty('modOnly');
//         expect(tcc.options).toHaveProperty('refsMessage');
    
//         expect(tcc).not.toHaveProperty('commandText');
//     })
// })

// const testMessage = new TwitchMessage('#tonichaelmight', {username: 'bexxters'}, '!bella forever edward', false);

// test('each property of the returned object holds the correct value', () => {
//     expect(tcc1.name).toStrictEqual('shelby');
//     expect(tcc1.callback()).toStrictEqual('hi this is shelby');
//     expect(tcc1.onCooldown).toStrictEqual(false);
//     expect(tcc1.options.cooldown_ms).toStrictEqual(10000);
//     expect(tcc1.options.modOnly).toStrictEqual(false);
//     expect(tcc1.options.refsMessage).toStrictEqual(false);

//     expect(tcc2.name).toStrictEqual('esme');
//     expect(tcc2.callback()).toStrictEqual('hi this is esme');
//     expect(tcc2.onCooldown).toStrictEqual(false);
//     expect(tcc2.options.cooldown_ms).toStrictEqual(500);
//     expect(tcc2.options.modOnly).toStrictEqual(true);
//     expect(tcc2.options.refsMessage).toStrictEqual(false);

//     expect(tcc3.name).toStrictEqual('bella');
//     expect(tcc3.callback(testMessage)).toStrictEqual('bella edward forever');
//     expect(tcc3.onCooldown).toStrictEqual(false);
//     expect(tcc3.options.cooldown_ms).toStrictEqual(10000);
//     expect(tcc3.options.modOnly).toStrictEqual(false);
//     expect(tcc3.options.refsMessage).toStrictEqual(true);
// })

// test('execute() works', () => {
//     tcc3.execute(testMessage);

//     expect(testMessage).toHaveProperty('response');
//     expect(testMessage.response[0]).toHaveProperty('output');
//     expect(testMessage.response[0].output).toStrictEqual('bella edward forever');
//     expect(tcc3.onCooldown).toStrictEqual(true);
// })

// test('moderation is effective', () => {
//     const testMessage1 = new TwitchMessage('#tonichaelmight', {username: 'bexxters'}, '!esme', false);
//     const testMessage2 = new TwitchMessage('#tonichaelmight', {username: 'bexxters', mod: true}, '!esme', false);
//     const testMessage3 = new TwitchMessage('#tonichaelmight', {username: 'bexxters', badges: {vip: 1}}, '!esme', false);
//     // tcc2 is mod-only so nothing should happen here
//     tcc2.execute(testMessage1);
//     expect(testMessage1).not.toHaveProperty('response');
//     // testMessage2 was sent by a mod, so a response should be added
//     tcc2.execute(testMessage2);
//     expect(testMessage2).toHaveProperty('response');
//     expect(testMessage2.response).toHaveLength(1);
//     expect(testMessage2.response[0].output).toStrictEqual('hi this is esme');
//     // vip should do nothing
//     tcc2.execute(testMessage3);
//     expect(testMessage3).not.toHaveProperty('response');
// })