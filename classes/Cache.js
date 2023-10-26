import { readFileSync, writeFileSync } from 'fs';

export default class Cache {
  constructor(filePath) {
    this.filePath = filePath;

    let cache;
    try {
      cache = JSON.parse(readFileSync(this.filePath, 'utf-8'));
    } catch(e) {
      if (!e.message.includes('no such file or directory, open')) {
          throw e;
      }
      console.log(e);
      writeFileSync(this.filePath, '{}');
      cache = {};
    }
    this.cache = cache;
    // console.log(this.cache);
  }

  writeCache() {
    writeFileSync(this.filePath, JSON.stringify(this.cache));
  }

  getCommandCache(commandName, defaultValue=[]) {
    if (!this.cache.commands) {
      this.cache.commands = {};
    }
    if (!this.cache.commands[commandName]) {
      this.cache.commands[commandName] = defaultValue;
    }
    return this.cache.commands[commandName];
  }

  setCommandCache(commandName, newValue) {
    if (!this.cache.commands) {
      this.cache.commands = {};
    }
    this.cache.commands[commandName] = newValue;
    this.writeCache();
  }

  getCountCache(commandName, defaultValue=0) {
    if (!this.cache.counts) {
      this.cache.counts = {};
    }
    if (!this.cache.counts[commandName]) {
      this.cache.counts[commandName] = defaultValue;
    }
    return this.cache.counts[commandName];
  }

  setCountCache(commandName, newValue) {
    if (!this.cache.counts) {
      this.cache.counts = {};
    }
    this.cache.counts[commandName] = newValue;
    this.writeCache();
  }

  getTimerCache(timerName, defaultValue=[]) {
    if (!this.cache.timers) {
      this.cache.timers = {};
    }
    if (!this.cache.timers[timerName]) {
      this.cache.timers[timerName] = defaultValue;
    }
    return this.cache.timers[timerName];
  }

  setTimerCache(timerName, newValue) {
    if (!this.cache.timers) {
      this.cache.timers = {};
    }
    this.cache.timers[timerName] = newValue;
    this.writeCache();
  }
}