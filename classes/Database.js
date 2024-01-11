// Connect to the Database
import knex from 'knex';

export default class Database {
  constructor() {
    // console.log('DB.js constructor')
    this.db = knex({

      // We are using PostgreSQL
      client: "pg",

      // Use the `DATABASE_URL` environment variable we provide to connect to the Database
      // It is included in your Replit environment automatically (no need to set it up)
      connection: process.env.DATABASE_URL,

      // Optionally, you can use connection pools to increase query performance
      // pool: { min: 0, max: 80 },
    });
    this.searchCache = {}
  }

  async buildTables() {
    if (!await this.db.schema?.hasTable('counts')) {
      await this.db.schema.createTable("counts", table => {
        table.string("name").notNullable().unique();
        table.integer("count");
      });
    }
    if (!await this.db.schema?.hasTable('timers')) {
      await this.db.schema.createTable("timers", table => {
        table.string("name").notNullable().unique();
        table.json("previous");
      });
    }
    if (!await this.db.schema?.hasTable('commands')) {
      await this.db.schema.createTable("commands", table => {
        table.string("name").notNullable().unique();
        table.json("previous");
      });
    }
  }

  // timers
    async addTimerIfNeeded(name) {
      this.searchCache.timers[name] = true;
      try {
        await this.db('timers').insert({
          name,
          previous: JSON.stringify([])
        });
      } catch(e) {
        if (!e.message.includes('duplicate key value violates unique constraint')) {
          throw e;
        }
      }
    }

    async contingentTimerSetup(name) {
      if (!this.searchCache.timers) this.searchCache.timers = {};
      if (!this.searchCache.timers[name]) await this.addTimerIfNeeded(name);
    }

    async getTimerPrevious(name) {
      await this.contingentTimerSetup(name);
      let timer = await this.db('timers').where({ name }).first();
      const { previous } = timer;
      return previous;
    }

    async setTimerPrevious(name, array) {
      this.contingentTimerSetup(name);
      await this.db("timers")
        .where("name", name)
        .update({
          'previous': JSON.stringify(array)
        })
    }

  // commands (non-count)
  async addCommandIfNeeded(name) {
    this.searchCache.commands[name] = true;
    try {
      await this.db('commands').insert({
        name,
        previous: JSON.stringify([])
      });
    } catch(e) {
      if (!e.message.includes('duplicate key value violates unique constraint')) {
        throw e;
      }
    }
  }

  async contingentCommandSetup(name) {
    if (!this.searchCache.commands) this.searchCache.commands = {};
    if (!this.searchCache.commands[name]) await this.addCommandIfNeeded(name);
  }

  async getCommandPrevious(name) {
    await this.contingentCommandSetup(name);
    let command = await this.db('commands').where({ name }).first();
    const { previous } = command;
    return previous;
  }

  async setCommandPrevious(name, array) {
    this.contingentCommandSetup(name);
    // console.log(array);
    await this.db("commands")
      .where("name", name)
      .update({
        'previous': JSON.stringify(array)
      })
  }

  // counter commands
  async addCountIfNeeded(name) {
    this.searchCache.counts[name] = true;
    try {
      await this.db('counts').insert({
        name,
        count: 0
      });
    } catch(e) {
      if (!e.message.includes('duplicate key value violates unique constraint')) {
        throw e;
      }
    }
  }

  async contingentCountSetup(name) {
    if (!this.searchCache.counts) this.searchCache.counts = {};
    if (!this.searchCache.counts[name]) await this.addCountIfNeeded(name);
  }

  async getCount(name) {
    await this.contingentCountSetup(name);
    let count = await this.db('counts').where({ name }).first();
    count = count.count;
    return count;
  }

  async incrementCount(name) {
    this.contingentCountSetup(name);
    await this.db("counts")
      .where("name", name)
      .increment("count", 1)
  }

  async setCount(name, count) {
    this.contingentCountSetup(name);
    return await this.db("counts")
      .where("name", name)
      .update("count", count)
  }

}