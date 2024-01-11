// fully covered
// if you're trying to make a new command, this is the right page; scroll down a bit further

// Basic commands will yield the same output every time they are executed -- foundation for more specialized command types
export class TwitchCommand {

  constructor(name, output, options={}) {
    this.name = name;
    if (typeof output === 'function') {
      this.outputFunction = output;
    } else {
      this.outputFunction = () => output;
    }

    this.options = {};
    this.options.cooldown_ms = options.cooldown_ms !== undefined ? options.cooldown_ms : 10000; // default cooldown is 10 sec
    this.options.modOnly = options.modOnly || false;

    if (options.aliases) {
      if (Array.isArray(options.aliases)) {
        this.options.aliases = options.aliases;
      } else {
        this.options.aliases = [options.aliases];
      }
    }

    this.onCooldown = false;

    this.options.refsMessage = options.refsMessage || false;
  }

  createCooldown() {
    this.onCooldown = true;
    const ref = setTimeout(() => {
      this.onCooldown = false;
      ref.unref();
    }, this.options.cooldown_ms);
  }

  quitFromModeration(messageObject) {
    // mods and broadcaster should not be modded
    if (messageObject.tags.mod || messageObject.tags.username === messageObject.channel.slice(1)) return false;
    // for normies, if it's mod only or is on cooldown, quit
    if (this.options.modOnly || this.onCooldown) {
      return true;
    }
    // otherwise, let it through!
    return false;
  }

  triggerCooldown() {
    if (this.options.cooldown_ms) {
      this.createCooldown();
    }
  }

  execute(messageObject) {
    if (this.quitFromModeration(messageObject)) return;

    this.triggerCooldown();

    try {
      // pass the message object if the command needs to reference it
      this.options.refsMessage ? messageObject.addResponse(this.outputFunction(messageObject)) : messageObject.addResponse(this.outputFunction());
      this.streamer.bot.logger.log('command', this.name, messageObject);
    } catch (e) {
      this.streamer.bot.logger.log('error', e, messageObject);
    }
  }
}

// Commands that use an asynchronous callback function
export class AsyncTwitchCommand extends TwitchCommand {

  constructor(name, output, options={}) {
    super(name, output, options);
  }

  async execute(messageObject) {

    if (this.quitFromModeration(messageObject)) return;

    this.triggerCooldown();

    try {
      this.options.refsMessage ? messageObject.addResponse(await this.outputFunction(messageObject)) : messageObject.addResponse(await this.outputFunction());
      this.streamer.bot.logger.log('command', this.name, messageObject);
    } catch (e) {
      this.streamer.bot.logger.log('error', e, messageObject);
    }
  }

}

export class TwitchCounterCommand extends TwitchCommand {

  // Current work
  constructor(name, outputs, options={}) {
    super(name, undefined, options);
    this.outputs = outputs;
    this.options.modOnly = true;
  }

  async evaluateMessage(messageObject) {
    const messageWords = messageObject.content.split(' ');
    const command = messageWords[0].slice(1);
    const evaluation = {};

    if (command === this.name) {
      if (!messageObject.needsModeration()) {
        // !test set
        if (messageWords[1] === 'set') {
          evaluation.action = 'set';
          const newValue = messageWords[2] * 1;
          // const setSuccess = this.setValue(newValue);          
          const setSuccess = await this.streamer.bot.db.setCount(this.name, newValue);

          if (setSuccess) {
            evaluation.successful = true;
            evaluation.endValue = newValue;
          } else {
            evaluation.successful = false;
            evaluation.endValue = await this.getValue();
            evaluation.attempt = newValue;
          }
        // !test
        } else {
          evaluation.action = 'add';
          // const currentValue = this.getValue();
          // const newValue = currentValue * 1 + 1;
          // this.setValue(newValue);
          await this.streamer.bot.db.incrementCount(this.name)
          evaluation.endValue = await this.streamer.bot.db.db('counts').where({ name: this.name }).first();
          evaluation.endValue = evaluation.endValue.count;
        }
      } else {
        return;
      }
    // !tests
    } else if (command === `${this.name}s`) {
      evaluation.action = 'show';
      evaluation.endValue = await this.getValue();
    }

    return evaluation;

  }

  setValue(newValue) {
    if (Number.isNaN(newValue * 1)) {
      return false;
    }

    this.streamer.cache.setCountCache(this.name, newValue);
    return true;
  }

  async getValue() {

    // let currentCacheValue = this.streamer.cache.getCountCache(this.name, 0);    
    let currentCacheValue = await this.streamer.bot.db.getCount(this.name);

    console.log(currentCacheValue)

    return currentCacheValue;
  }

  async execute(messageObject) {
    if (this.quitFromModeration(messageObject)) return;

    let evaluation = await this.evaluateMessage(messageObject);

    this.triggerCooldown();

    try {
      if (!evaluation) {
        return;
      }
      messageObject.addResponse(this.outputs[evaluation.action](evaluation));
      this.streamer.bot.logger.log('command', this.name, messageObject);
      return;
    } catch (e) {
      this.streamer.bot.logger.log('error', e, messageObject);
    }
  }
}
