import { appendFileSync, writeFileSync, existsSync, mkdirSync, readFileSync } from 'fs';

export default class LogHandler {
  constructor() {
    this.rootDirectory = './logs'
  }

  getCurrentTimestamp() {
    const timestamp = new Date(Date.now())
    .toLocaleString('en-US', { 
      timeZone: 'America/New_York', 
      hourCycle: 'h23'
    });
    return timestamp;
  }

  getTimestampMapping(timestamp) {
    const [date, time] = timestamp.split(', ');
    const [month, day, year] = date.split('/');
    const [hour, min, sec] = time.split(':');
    const map = {year, month, day, hour, min, sec};
    return map;
  }

  buildFileStructureFromTimestampMap(timestampMap, section) {
    const { year, month, day, hour, min, sec } = timestampMap;
    const path = `${this.rootDirectory}/${section}/${year}/${month}/${day}/${hour}/${min}/${sec}/`;
    mkdirSync(path, {recursive:true})
    return path;
  }

  addCommandLog(command, messageObject) {
    const timestamp = this.getCurrentTimestamp();
    const timestampMap = this.getTimestampMapping(timestamp);

    const path = this.buildFileStructureFromTimestampMap(timestampMap, 'commands');

    const eventData = {
      command: command,
      username: messageObject.tags.username,
      messageContent: messageObject.content
    }
    
    const fileName = `${path}data.json`;
    let fileData = [];
    if (existsSync(fileName)) {
      const fileTextJSON = readFileSync(fileName, 'utf-8');
      fileData = JSON.parse(fileTextJSON);
    }
    const allData = [...fileData, eventData];
    const allDataJSON = JSON.stringify(allData);
    writeFileSync(fileName, allDataJSON);
  }

}