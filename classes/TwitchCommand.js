// if you're trying to make a new command, this is the right page; scroll down a bit further
import { logError } from '../utils.js';

// Basic commands will yield the same output every time they are executed -- foundation for more specialized command types
export class TwitchCommand {

  constructor(name, commandText, options={}) {
    this.name = name;
    this.commandText = commandText;

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
  }

  createCooldown() {
    this.onCooldown = true;
    setTimeout(() => {
      this.onCooldown = false;
    }, this.options.cooldown_ms);
  }

  quitFromModeration(messageObject) {
    // don't execute if the user is not a mod and the command is mod-only or on cooldown
    if (messageObject.needsModeration()) {
      if (this.options.modOnly || this.onCooldown) {
        return true;
      }
    }
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
      messageObject.addResponse(this.commandText);
    } catch (e) {
      logError(e);
    }
  }
}

// Commands that do more than just yield the same text every time
export class TwitchCallbackCommand extends TwitchCommand {

  constructor(name, callback, options={}) {
    super(name, undefined, options);
    delete this.commandText;
    this.callback = callback;

    this.options.refsMessage = options.refsMessage || false;
  }

  execute(messageObject) {
    if (this.quitFromModeration(messageObject)) return;

    this.triggerCooldown();

    try {
      // pass the message object if the command needs to reference it
      this.options.refsMessage ? messageObject.addResponse(this.callback(messageObject)) : messageObject.addResponse(this.callback());
    } catch (e) {
      logError(e);
    }

  }
}

// Commands that use an asynchronous callback function
export class AsyncTwitchCallbackCommand extends TwitchCallbackCommand {

  constructor(name, callback, options={}) {
    super(name, callback, options);
  }

  async execute(messageObject) {
    if (this.quitFromModeration(messageObject)) return;

    this.triggerCooldown();

    try {
      this.options.refsMessage ? messageObject.addResponse(await this.callback(messageObject)) : messageObject.addResponse(await this.callback());
    } catch (e) {
      logError(e);
    }
  }

}

export class TwitchCounterCommand extends TwitchCommand {

  // Current work
  constructor(name, outputs, options={}) {
    super(name, undefined, options);
    this.outputs = outputs;
  }

  evaluateMessage(messageObject) {
    const messageWords = messageObject.content.split(' ');
    const command = messageWords[0].slice(1);
    const evaluation = {};

    if (command === this.name) {
      if (!messageObject.needsModeration()) {
        // !test set
        if (messageWords[1] === 'set') {
          evaluation.action = 'set';
          const newValue = messageWords[2];
          const setSuccess = this.setValue(newValue);
          if (setSuccess) {
            evaluation.successful = true;
            evaluation.endValue = newValue;
          } else {
            evaluation.successful = false;
            evaluation.endValue = this.getValue();
            evaluation.attempt = newValue;
          }
        // !test
        } else {
          evaluation.action = 'add';
          const currentValue = this.getValue();
          const newValue = currentValue * 1 + 1;
          this.setValue(newValue);
          evaluation.endValue = newValue;
        }
      } else {
        return;
      }
    // !tests
    } else if (command === `${this.name}s`) {
      evaluation.action = 'show';
      evaluation.endValue = this.getValue();
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

  getValue() {

    let currentCacheValue = this.streamer.cache.getCountCache(this.name, 0);

    return currentCacheValue;
  }

  async execute(messageObject) {
    if (this.quitFromModeration(messageObject)) return;

    let evaluation;

    if (messageObject.tags.mod || messageObject.tags.username === messageObject.channel.slice(1)) {
      evaluation = this.evaluateMessage(messageObject);
    }

    this.triggerCooldown();

    try {
      if (!evaluation) {
        return;
      }
      messageObject.addResponse(this.outputs[evaluation.action](evaluation));
      return;
    } catch (e) {
      logError(e);
    }
  }
}
