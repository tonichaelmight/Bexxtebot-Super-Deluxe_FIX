import TwitchMessage from './TwitchMessage.js';

// setting testingMode to true will make it so that 
// timers will execute regardless of whether or not 
// the streamer is live
// is also makes it so that timers activate
// 1000 times as frequently, for ease of testing
const testingMode = false;

// TIMER CLASS
export default class Timer {
  constructor(name, min, range, options={}) {
    this.name = name;
    this.min = min;
    this.range = range;

    if (!testingMode) {
      this.min *= 1000;
      this.range *= 1000;
    }

    this.options = {};
    this.options.commands = options.commands || undefined;
    this.options.gameTitle = options.gameTitle || undefined;
    this.options.outputs = options.outputs || undefined;

    const numChoices = this.options.commands?.length || this.options.outputs?.length || undefined;
    if (!numChoices) throw new Error('there is a timer with no choices!');

    this.maxCacheStorage = Math.ceil(numChoices / 3);
    if (this.maxCacheStorage === numChoices) this.maxCacheStorage--;
  }

  getRandomIndex() {
    if (this.options.commands) {
      return Math.floor(Math.random() * this.options.commands.length);
    } else if (this.options.outputs) {
      return Math.floor(Math.random() * this.options.outputs.length)
    }

  }

  async getTimerOutput() {

    return new Promise(resolve => {
      setTimeout(async () => {
        const streamerData = await this.streamer.getCurrentStreamerData();
        const live = testingMode ? true : streamerData.is_live;
        const currentGame = this.options.gameTitle ? streamerData.game_name : undefined;

        let dummyMessage;

        if (live && currentGame === this.options.gameTitle) {
          // let previous = this.streamer.cache.getTimerCache(this.name);
          let previous = await this.streamer.bot.db.getTimerPrevious(this.name);
          let i = this.getRandomIndex();
          while (previous.includes(i)) {
            i = this.getRandomIndex();
          }

          if (this.options.commands) {
            dummyMessage = TwitchMessage.generateDummyMessage(`#${this.streamer.username}`, `!${this.options.commands[i]}`);
            await this.streamer.bot.processTwitchMessage(dummyMessage)
          } else if (this.options.outputs) {
            dummyMessage = TwitchMessage.generateDummyMessage(`#${this.streamer.username}`);
            dummyMessage.addResponse(this.options.outputs[i]);
            this.streamer.bot.speakInTwitch(dummyMessage);
          } else {
            throw new Error('Timer has no commands or outputs');
          }

          previous.push(i);

          while (previous.length > this.maxCacheStorage) {
            previous.shift();
          }

          // this.streamer.cache.setTimerCache(this.name, previous);
          this.streamer.bot.db.setTimerPrevious(this.name, previous);
        } else {
          // resets the cached array for next stream
          // don't think I actually want this
          // this.streamer.cache.setTimerCache(this.name, []);
          dummyMessage = null;
        }

        resolve(dummyMessage);

      }, Math.floor(Math.random() * this.range) + this.min);
    }); 
  }

  async start() {
    while(true) {
      await this.getTimerOutput();
    }
  }
}